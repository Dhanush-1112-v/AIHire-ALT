def calculate_integrity_risk(
    copy_events: int,
    paste_events: int,
    tab_switches: int,
    response_time_seconds: float,
    answer_similarity: float = 0.0
):
    """
    Calculate assessment-integrity risk using
    observable candidate interaction signals.

    This is a risk indicator for human review.
    It is NOT a definitive cheating detector.
    """

    risk_score = 0.0
    signals = []

    # -----------------------------
    # Copy activity
    # -----------------------------
    if copy_events >= 3:
        risk_score += 20
        signals.append("Frequent copy activity")
    elif copy_events > 0:
        risk_score += 8
        signals.append("Copy activity detected")

    # -----------------------------
    # Paste activity
    # -----------------------------
    if paste_events >= 3:
        risk_score += 20
        signals.append("Frequent paste activity")
    elif paste_events > 0:
        risk_score += 8
        signals.append("Paste activity detected")

    # -----------------------------
    # Tab switching
    # -----------------------------
    if tab_switches >= 5:
        risk_score += 25
        signals.append("Frequent tab switching")
    elif tab_switches > 0:
        risk_score += 10
        signals.append("Tab switching detected")

    # -----------------------------
    # Response timing
    # -----------------------------
    if response_time_seconds < 10:
        risk_score += 20
        signals.append("Unusually fast response")
    elif response_time_seconds < 20:
        risk_score += 10
        signals.append("Fast response")

    # -----------------------------
    # Answer similarity
    # -----------------------------
    if answer_similarity >= 0.90:
        risk_score += 25
        signals.append("Very high answer similarity")
    elif answer_similarity >= 0.75:
        risk_score += 15
        signals.append("High answer similarity")

    # -----------------------------
    # Limit score to 100
    # -----------------------------
    risk_score = min(risk_score, 100)

    # -----------------------------
    # Determine risk level
    # -----------------------------
    if risk_score >= 60:
        risk_level = "High Risk"
    elif risk_score >= 30:
        risk_level = "Suspicious"
    else:
        risk_level = "Normal"

    # -----------------------------
    # No suspicious signals
    # -----------------------------
    if not signals:
        signals.append(
            "No unusual assessment signals detected"
        )

    return {
        "risk_score": round(risk_score, 2),
        "risk_level": risk_level,
        "signals": signals,
        "human_review_required": risk_score >= 30
    }