from pydantic import BaseModel
from typing import List


class ResumeAnalysisResponse(BaseModel):
    filename: str
    job_role: str

    match_score: float
    skill_coverage: float

    matched_skills: List[str]
    missing_skills: List[str]

    recommendation: str
    explanation: List[str]