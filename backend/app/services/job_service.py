import pandas as pd
from pathlib import Path


# Project root
PROJECT_ROOT = Path(__file__).resolve().parents[3]

JOB_DATASET = (
    PROJECT_ROOT
    / "datasets"
    / "job_descriptions"
    / "job_descriptions.csv"
)


def load_job_dataset():

    if not JOB_DATASET.exists():
        raise FileNotFoundError(
            f"Job dataset not found: {JOB_DATASET}"
        )

    return pd.read_csv(JOB_DATASET)


def get_job_description(job_role: str):

    df = load_job_dataset()

    # Find likely job-title column
    title_column = None

    for column in df.columns:

        name = column.lower().replace("_", " ")

        if (
            "job title" in name
            or name == "title"
            or "position" in name
        ):
            title_column = column
            break

    # If title column cannot be identified,
    # use the first text column.
    if title_column is None:

        text_columns = df.select_dtypes(
            include="object"
        ).columns

        if len(text_columns) == 0:
            raise ValueError(
                "No text columns found in job dataset."
            )

        title_column = text_columns[0]

    # Search job title
    matches = df[
        df[title_column]
        .astype(str)
        .str.contains(
            job_role,
            case=False,
            na=False
        )
    ]

    if len(matches) == 0:

        # Try partial keyword matching
        words = job_role.lower().split()

        for word in words:

            if len(word) < 4:
                continue

            matches = df[
                df[title_column]
                .astype(str)
                .str.contains(
                    word,
                    case=False,
                    na=False
                )
            ]

            if len(matches) > 0:
                break

    if len(matches) == 0:

        return {
            "job_title": job_role,
            "job_description": job_role
        }

    row = matches.iloc[0]

    description_parts = []

    for column in df.columns:

        value = row[column]

        if pd.notna(value):

            text = str(value).strip()

            if text:
                description_parts.append(text)

    return {
        "job_title": str(row[title_column]),
        "job_description": " ".join(
            description_parts
        )
    }