import os
import tempfile

from fastapi import APIRouter, UploadFile, File

from app.services.speech.whisper_service import transcribe_audio
from app.services.speech.librosa_service import analyze_speech

from app.schemas.speech.speech import (
    SpeechTranscriptionResponse,
    SpeechAnalysisResponse
)


router = APIRouter(
    prefix="/api/speech",
    tags=["Speech"]
)


@router.post(
    "/transcribe",
    response_model=SpeechTranscriptionResponse
)
async def transcribe_speech(
    audio: UploadFile = File(...)
):
    result = transcribe_audio(audio)
    return result


@router.post(
    "/analyze",
    response_model=SpeechAnalysisResponse
)
async def analyze_speech_audio(
    audio: UploadFile = File(...)
):
    temp_path = None

    try:
        suffix = os.path.splitext(audio.filename)[1] or ".webm"

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix
        ) as temp_file:

            temp_path = temp_file.name

            audio.file.seek(0)

            while True:
                chunk = audio.file.read(1024 * 1024)

                if not chunk:
                    break

                temp_file.write(chunk)

        result = analyze_speech(temp_path)

        return result

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)