import json
import os
import tempfile

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.services.resume_service import extract_resume_text
from app.services.amci_engine import analyze_resume
from app.services.job_service import get_job_description


router = APIRouter(
    prefix="/api/resume",
    tags=["Resume Intelligence"]
)


@router.post("/analyze")
async def analyze_candidate_resume(
    resume: UploadFile = File(...),
    job_role: str = Form(...),
    candidate_id: int = Form(1),
    db: Session = Depends(get_db)
):
    if not resume.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF resume."
        )

    temp_path = None

    try:
        candidate = db.execute(
            text("""
                SELECT id
                FROM candidates
                WHERE id = :candidate_id
            """),
            {
                "candidate_id": candidate_id
            }
        ).fetchone()

        if not candidate:
            raise HTTPException(
                status_code=404,
                detail="Candidate not found."
            )

        file_bytes = await resume.read()

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        ) as temp_file:
            temp_file.write(file_bytes)
            temp_path = temp_file.name

        resume_text = extract_resume_text(temp_path)

        if not resume_text.strip():
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from the resume."
            )

        job_data = get_job_description(job_role)

        result = analyze_resume(
            resume_text,
            job_role,
            job_data["job_description"]
        )

        matched_skills = result.get("matched_skills", [])
        missing_skills = result.get("missing_skills", [])

        resume_score = float(
            result.get(
                "match_score",
                result.get("skill_coverage", 0)
            )
        )

        matched_skills_text = json.dumps(
            matched_skills,
            ensure_ascii=False
        )

        missing_skills_text = json.dumps(
            missing_skills,
            ensure_ascii=False
        )

        existing = db.execute(
            text("""
                SELECT id
                FROM resumes
                WHERE candidate_id = :candidate_id
                ORDER BY id DESC
                LIMIT 1
            """),
            {
                "candidate_id": candidate_id
            }
        ).fetchone()

        resume_values = {
            "candidate_id": candidate_id,
            "filename": resume.filename,
            "resume_text": resume_text,
            "resume_score": resume_score,
            "matched_skills": matched_skills_text,
            "skill_gaps": missing_skills_text
        }

        if existing:
            db.execute(
                text("""
                    UPDATE resumes
                    SET
                        filename = :filename,
                        resume_text = :resume_text,
                        resume_score = :resume_score,
                        matched_skills = :matched_skills,
                        skill_gaps = :skill_gaps
                    WHERE id = :id
                """),
                {
                    **resume_values,
                    "id": existing.id
                }
            )
        else:
            db.execute(
                text("""
                    INSERT INTO resumes (
                        candidate_id,
                        filename,
                        resume_text,
                        resume_score,
                        matched_skills,
                        skill_gaps
                    )
                    VALUES (
                        :candidate_id,
                        :filename,
                        :resume_text,
                        :resume_score,
                        :matched_skills,
                        :skill_gaps
                    )
                """),
                resume_values
            )

        db.commit()

        return {
            "filename": resume.filename,
            "job_role": job_role,
            "job_title": job_data["job_title"],
            **result
        }

    except HTTPException:
        raise

    except Exception as error:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)