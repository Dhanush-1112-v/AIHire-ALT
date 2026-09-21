from pydantic import BaseModel
from typing import List


class TestCase(BaseModel):
    input: str
    expected_output: str


class CodingSubmission(BaseModel):
    code: str
    language: str = "python"
    test_cases: List[TestCase]


class CodingResult(BaseModel):
    success: bool
    score: float
    passed_test_cases: int
    total_test_cases: int
    execution_time: float
    results: List[dict]
    message: str