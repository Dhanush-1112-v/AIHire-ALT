from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.results import router as results_router
from app.api.resume import router as resume_router
from app.api.interview import router as interview_router
from app.api.speech.speech import router as speech_router
from app.api.proctoring import router as proctoring_router
from app.api.coding import router as coding_router


app = FastAPI(
    title="AIHire API",
    description="AI-Powered Smart Interview and Candidate Assessment Platform",
    version="1.0.0"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://ai-hire-alt.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# ROUTES
# --------------------------------------------------

app.include_router(resume_router)
app.include_router(interview_router)
app.include_router(speech_router)
app.include_router(proctoring_router)
app.include_router(coding_router)
app.include_router(results_router)


# --------------------------------------------------
# ROOT
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "AIHire API is running",
        "project": "AIHire-AMCI",
        "status": "active"
    }


# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }
