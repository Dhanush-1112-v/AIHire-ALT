from pypdf import PdfReader
from pathlib import Path


def extract_resume_text(file_path: str) -> str:
    """
    Extract text from a PDF resume.
    """

    path = Path(file_path)

    if path.suffix.lower() != ".pdf":
        raise ValueError("Currently only PDF resumes are supported.")

    reader = PdfReader(str(path))

    pages = []

    for page in reader.pages:
        text = page.extract_text()

        if text:
            pages.append(text)

    return "\n".join(pages)


def normalize_text(text: str) -> str:
    """
    Basic text normalization.
    """

    return " ".join(text.lower().split())