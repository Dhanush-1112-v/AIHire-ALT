from pydantic import BaseModel


class SpeechTranscriptionResponse(BaseModel):
    transcript: str
    language: str
    model: str


class SpeechAnalysisResponse(BaseModel):
    duration_seconds: float
    average_energy: float
    zero_crossing_rate: float
    spectral_centroid: float
    tempo_bpm: float