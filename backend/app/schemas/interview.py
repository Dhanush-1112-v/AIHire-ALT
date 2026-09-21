from pydantic import BaseModel


class InterviewEvaluationRequest(BaseModel):
    question: str
    skill: str
    difficulty: str
    answer: str


class InterviewEvaluationResponse(BaseModel):
    score: float
    relevance: str
    technical_understanding: str
    evidence_quality: str
    feedback: str
    skill: str
    difficulty: str
    model: str