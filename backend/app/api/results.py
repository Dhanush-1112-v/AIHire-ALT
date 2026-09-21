from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.services.results_service import calculate_overall_score


router = APIRouter(
    prefix="/api/results",
    tags=["Results"]
)


class ResultsRequest(BaseModel):
    candidate_id: int
    resume_score: float
    technical_score: float
    communication_score: float
    coding_score: float


@router.post("/calculate")
def calculate_results(
    request: ResultsRequest,
    db: Session = Depends(get_db)
):
    candidate = db.execute(
        text("""
            SELECT id
            FROM candidates
            WHERE id = :candidate_id
        """),
        {
            "candidate_id": request.candidate_id
        }
    ).fetchone()

    if not candidate:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found."
        )

    result = calculate_overall_score(
        request.resume_score,
        request.technical_score,
        request.communication_score,
        request.coding_score
    )

    existing = db.execute(
        text("""
            SELECT id
            FROM assessment_results
            WHERE candidate_id = :candidate_id
            ORDER BY id DESC
            LIMIT 1
        """),
        {
            "candidate_id": request.candidate_id
        }
    ).fetchone()

    values = {
        "candidate_id": request.candidate_id,
        "resume_score": result["resume"],
        "technical_score": result["technical"],
        "communication_score": result["communication"],
        "coding_score": result["coding"],
        "overall_score": result["overall"]
    }

    if existing:
        db.execute(
            text("""
                UPDATE assessment_results
                SET
                    resume_score = :resume_score,
                    technical_score = :technical_score,
                    communication_score = :communication_score,
                    coding_score = :coding_score,
                    overall_score = :overall_score
                WHERE id = :id
            """),
            {
                **values,
                "id": existing.id
            }
        )
    else:
        db.execute(
            text("""
                INSERT INTO assessment_results (
                    candidate_id,
                    resume_score,
                    technical_score,
                    communication_score,
                    coding_score,
                    overall_score
                )
                VALUES (
                    :candidate_id,
                    :resume_score,
                    :technical_score,
                    :communication_score,
                    :coding_score,
                    :overall_score
                )
            """),
            values
        )

    db.commit()

    return {
        "success": True,
        "message": "Assessment result saved successfully.",
        "results": result
    }


@router.get("/{candidate_id}")
def get_results(
    candidate_id: int,
    db: Session = Depends(get_db)
):
    result = db.execute(
        text("""
            SELECT
                id,
                candidate_id,
                resume_score,
                technical_score,
                communication_score,
                coding_score,
                overall_score,
                created_at
            FROM assessment_results
            WHERE candidate_id = :candidate_id
            ORDER BY id DESC
            LIMIT 1
        """),
        {
            "candidate_id": candidate_id
        }
    ).mappings().first()

    if not result:
        raise HTTPException(
            status_code=404,
            detail="No assessment results found for this candidate."
        )

    return {
        "success": True,
        "results": dict(result)
    }