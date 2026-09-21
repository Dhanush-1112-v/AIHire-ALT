import os
import tempfile
import whisper


# Load Whisper model once when the service starts
model = whisper.load_model("base")


def transcribe_audio(audio_file):
    """
    Save uploaded audio temporarily,
    transcribe it using Whisper,
    then delete the temporary file.
    """

    temp_path = None

    try:
        suffix = os.path.splitext(audio_file.filename)[1] or ".mp3"

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix
        ) as temp_file:

            temp_path = temp_file.name

            audio_file.file.seek(0)

            while True:
                chunk = audio_file.file.read(1024 * 1024)

                if not chunk:
                    break

                temp_file.write(chunk)

        result = model.transcribe(
            temp_path,
            language="en"
        )

        transcript = result["text"].strip()

        return {
            "transcript": transcript,
            "language": "English",
            "model": "Whisper-base"
        }

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)