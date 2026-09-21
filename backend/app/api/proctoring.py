from fastapi import APIRouter

from app.schemas.proctoring import (
    IntegrityRequest,
    IntegrityResponse
)

from app.services.proctoring_service import (
    calculate_integrity_risk
)


router = APIRouter(
    prefix="/api/proctoring",
    tags=["Proctoring"]
)


@router.post(
    "/analyze",
    response_model=IntegrityResponse
)
def analyze_integrity(
    request: IntegrityRequest
):

    result = calculate_integrity_risk(
        copy_events=request.copy_events,
        paste_events=request.paste_events,
        tab_switches=request.tab_switches,
        response_time_seconds=request.response_time_seconds,
        answer_similarity=request.answer_similarity
    )

    return result