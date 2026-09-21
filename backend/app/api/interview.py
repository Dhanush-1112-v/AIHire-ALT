from fastapi import APIRouter

from app.schemas.interview import (
    InterviewEvaluationRequest,
    InterviewEvaluationResponse
)

from app.services.interview_service import (
    evaluate_interview_answer
)


router = APIRouter(
    prefix="/api/interview",
    tags=["Interview"]
)


@router.post(
    "/evaluate",
    response_model=InterviewEvaluationResponse
)
def evaluate_answer(
    request: InterviewEvaluationRequest
):

    result = evaluate_interview_answer(
        question=request.question,
        skill=request.skill,
        difficulty=request.difficulty,
        answer=request.answer
    )

    return result