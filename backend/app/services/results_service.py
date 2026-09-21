def calculate_overall_score(
    resume_score: float,
    technical_score: float,
    communication_score: float,
    coding_score: float
):
    scores = {
        "resume": max(0, min(100, float(resume_score))),
        "technical": max(0, min(100, float(technical_score))),
        "communication": max(0, min(100, float(communication_score))),
        "coding": max(0, min(100, float(coding_score)))
    }

    overall = (
        scores["resume"] * 0.25 +
        scores["technical"] * 0.25 +
        scores["communication"] * 0.25 +
        scores["coding"] * 0.25
    )

    return {
        "overall": round(overall, 2),
        "resume": scores["resume"],
        "technical": scores["technical"],
        "communication": scores["communication"],
        "coding": scores["coding"]
    }