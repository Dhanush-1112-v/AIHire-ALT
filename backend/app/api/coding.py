from fastapi import APIRouter

from app.schemas.coding import (
    CodingSubmission,
    CodingResult
)

from app.services.coding_service import (
    execute_code
)


router = APIRouter(
    prefix="/api/coding",
    tags=["Coding"]
)


@router.post(
    "/submit",
    response_model=CodingResult
)
def submit_code(
    request: CodingSubmission
):
    test_cases = [
        {
            "input": test_case.input,
            "expected_output": test_case.expected_output
        }
        for test_case in request.test_cases
    ]

    return execute_code(
        request.code,
        request.language,
        test_cases
    )