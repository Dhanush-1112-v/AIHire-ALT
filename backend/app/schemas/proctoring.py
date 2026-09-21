from pydantic import BaseModel


class IntegrityRequest(BaseModel):
    copy_events: int = 0
    paste_events: int = 0
    tab_switches: int = 0
    response_time_seconds: float = 0
    answer_similarity: float = 0.0


class IntegrityResponse(BaseModel):
    risk_score: float
    risk_level: str
    signals: list[str]
    human_review_required: bool