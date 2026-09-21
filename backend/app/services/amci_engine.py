import re

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# --------------------------------------------------
# ROLE KNOWLEDGE
# --------------------------------------------------

ROLE_REQUIREMENTS = {

    "Software Developer": [
        "python",
        "java",
        "sql",
        "javascript",
        "react",
        "data structures",
        "algorithms",
        "git",
        "api",
        "database"
    ],

    "Data Scientist": [
        "python",
        "machine learning",
        "statistics",
        "pandas",
        "numpy",
        "sql",
        "data analysis",
        "scikit learn",
        "deep learning",
        "data visualization"
    ],

    "Machine Learning Engineer": [
        "python",
        "machine learning",
        "deep learning",
        "pytorch",
        "tensorflow",
        "scikit learn",
        "nlp",
        "model deployment",
        "docker",
        "api"
    ],

    "Frontend Developer": [
        "html",
        "css",
        "javascript",
        "react",
        "typescript",
        "responsive design",
        "git",
        "api"
    ],

    "Backend Developer": [
        "python",
        "java",
        "sql",
        "api",
        "rest",
        "database",
        "fastapi",
        "spring",
        "docker",
        "git"
    ]
}


# --------------------------------------------------
# SKILL EXTRACTION
# --------------------------------------------------

def extract_skills(text: str, skills: list[str]) -> list[str]:

    text = text.lower()

    found = []

    for skill in skills:

        pattern = r"\b" + re.escape(skill.lower()) + r"\b"

        if re.search(pattern, text):
            found.append(skill)

    return found


# --------------------------------------------------
# BASELINE SEMANTIC MATCHING
# --------------------------------------------------

def semantic_similarity(
    resume_text: str,
    requirements: list[str]
) -> float:

    requirement_text = " ".join(requirements)

    vectorizer = TfidfVectorizer(
        stop_words="english"
    )

    vectors = vectorizer.fit_transform(
        [
            resume_text,
            requirement_text
        ]
    )

    score = cosine_similarity(
        vectors[0:1],
        vectors[1:2]
    )[0][0]

    return float(score)


# --------------------------------------------------
# AIHire-AMCI SCORING
# --------------------------------------------------

def calculate_amci_score(
    semantic_score: float,
    skill_coverage: float
) -> float:

    """
    Initial AIHire-AMCI scoring layer.

    Current model combines:

    1. Semantic relevance
    2. Job skill evidence

    Future stages will add:

    3. Interview evidence
    4. Coding evidence
    5. Speech evidence
    6. Integrity signals
    7. Adaptive job-specific weighting
    """

    semantic_component = semantic_score * 60

    skill_component = skill_coverage * 40

    final_score = (
        semantic_component
        + skill_component
    )

    return round(final_score, 2)


# --------------------------------------------------
# SKILL EVIDENCE ANALYSIS
# --------------------------------------------------

def build_skill_evidence(
    resume_text: str,
    requirements: list[str]
) -> list[dict]:

    """
    Creates an evidence profile for every required skill.

    Evidence score is based on observable occurrences
    in the resume.

    0 occurrences  -> Needs Verification
    1 occurrence   -> Evidence Found
    2+ occurrences -> Strong Evidence
    """

    skill_evidence = []

    resume_lower = resume_text.lower()

    for skill in requirements:

        skill_lower = skill.lower()

        pattern = (
            r"\b"
            + re.escape(skill_lower)
            + r"\b"
        )

        occurrences = len(
            re.findall(
                pattern,
                resume_lower
            )
        )

        if occurrences == 0:

            evidence_score = 0
            evidence_status = "Needs Verification"

        elif occurrences == 1:

            evidence_score = 70
            evidence_status = "Evidence Found"

        else:

            evidence_score = 100
            evidence_status = "Strong Evidence"

        skill_evidence.append({

            "skill": skill,

            "evidence_score": evidence_score,

            "status": evidence_status,

            "occurrences": occurrences
        })

    return skill_evidence


# --------------------------------------------------
# COMPLETE RESUME ANALYSIS
# --------------------------------------------------

def analyze_resume(
    resume_text: str,
    job_role: str,
    job_description: str | None = None
):

    # --------------------------------------------------
    # GET ROLE REQUIREMENTS
    # --------------------------------------------------

    if job_role in ROLE_REQUIREMENTS:

        requirements = ROLE_REQUIREMENTS[job_role]

    else:

        requirements = []


    # --------------------------------------------------
    # JOB-AWARE TEXT
    # --------------------------------------------------

    if job_description:

        semantic_text = job_description

    else:

        semantic_text = " ".join(
            requirements
        )


    # --------------------------------------------------
    # SKILL MATCHING
    # --------------------------------------------------

    matched_skills = extract_skills(
        resume_text,
        requirements
    )


    # --------------------------------------------------
    # MISSING SKILLS
    # --------------------------------------------------

    missing_skills = [

        skill

        for skill in requirements

        if skill not in matched_skills
    ]


    # --------------------------------------------------
    # SKILL COVERAGE
    # --------------------------------------------------

    if requirements:

        skill_coverage = (
            len(matched_skills)
            /
            len(requirements)
        )

    else:

        skill_coverage = 0.0


    # --------------------------------------------------
    # SKILL EVIDENCE PROFILE
    # --------------------------------------------------

    skill_evidence = build_skill_evidence(
        resume_text,
        requirements
    )


    # --------------------------------------------------
    # SEMANTIC MATCHING
    # --------------------------------------------------

    vectorizer = TfidfVectorizer(
        stop_words="english"
    )

    vectors = vectorizer.fit_transform(
        [
            resume_text,
            semantic_text
        ]
    )

    semantic_score = cosine_similarity(
        vectors[0:1],
        vectors[1:2]
    )[0][0]


    # --------------------------------------------------
    # AIHire-AMCI SCORE
    # --------------------------------------------------

    amci_score = calculate_amci_score(
        semantic_score,
        skill_coverage
    )


    # --------------------------------------------------
    # RECOMMENDATION
    # --------------------------------------------------

    if amci_score >= 75:

        recommendation = "Strong Match"

    elif amci_score >= 55:

        recommendation = "Moderate Match"

    else:

        recommendation = "Needs Review"


    # --------------------------------------------------
    # EXPLANATION
    # --------------------------------------------------

    explanation = []


    explanation.append(
        f"{len(matched_skills)} of "
        f"{len(requirements)} identified skills "
        f"were found in the resume."
    )


    explanation.append(
        "Semantic relevance score: "
        f"{round(semantic_score * 100, 2)}%."
    )


    if missing_skills:

        explanation.append(
            "Skills requiring verification: "
            + ", ".join(missing_skills[:5])
        )

    else:

        explanation.append(
            "All identified role skills "
            "were found in the resume."
        )


    # --------------------------------------------------
    # MODEL COMPONENT SUMMARY
    # --------------------------------------------------

    model_components = {

        "semantic_matching": round(
            semantic_score * 100,
            2
        ),

        "skill_coverage": round(
            skill_coverage * 100,
            2
        ),

        "semantic_weight": 60,

        "skill_weight": 40
    }


    # --------------------------------------------------
    # FINAL RESULT
    # --------------------------------------------------

    return {

        "match_score": amci_score,

        "skill_coverage": round(
            skill_coverage * 100,
            2
        ),

        "matched_skills": matched_skills,

        "missing_skills": missing_skills,

        "skill_evidence": skill_evidence,

        "recommendation": recommendation,

        "explanation": explanation,

        "model": "AIHire-AMCI",

        "model_components": model_components,

        "semantic_method": (
            "TF-IDF + Cosine Similarity"
        ),

        "job_source": (
            "Job Description Dataset"
            if job_description
            else "Role Requirement Profile"
        )
    }