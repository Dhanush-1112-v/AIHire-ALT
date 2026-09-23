from typing import Dict
import re

_MODEL = None


def get_sentence_model():
    global _MODEL

    if _MODEL is None:
        from sentence_transformers import SentenceTransformer
        _MODEL = SentenceTransformer("all-MiniLM-L6-v2")

    return _MODEL


REFERENCE_ANSWERS = {
    "Python": """
    A Python list is mutable, which means its elements can be
    added, removed, or modified after the list is created.
    A tuple is immutable, so its elements cannot be changed
    after creation. Lists are suitable when data needs to be
    modified frequently, while tuples are useful for fixed
    collections of values. Tuples can also be more memory
    efficient and are useful when data should not be modified.
    """,

    "Data Structures": """
    A stack follows the LIFO principle, which means Last In
    First Out. Elements are added using push and removed using
    pop. A stack can be used for function calls, undo operations,
    or browser history.

    A queue follows the FIFO principle, which means First In
    First Out. Elements are inserted at the rear and removed
    from the front. Queues are commonly used in scheduling,
    task processing, and printer queues.
    """,

    "SQL": """
    To find the second-highest salary, we can use a subquery,
    ORDER BY with LIMIT and OFFSET, or a window function such
    as DENSE_RANK. For example, we can rank salaries in
    descending order using DENSE_RANK and select the employee
    whose rank is 2. A subquery can also find the maximum salary
    below the highest salary.
    """
}


TECHNICAL_CONCEPTS = {
    "Python": [
        "list",
        "tuple",
        "mutable",
        "immutable",
        "modify",
        "change",
        "fixed",
        "elements"
    ],

    "Data Structures": [
        "stack",
        "queue",
        "lifo",
        "fifo",
        "push",
        "pop",
        "enqueue",
        "dequeue"
    ],

    "SQL": [
        "second highest",
        "salary",
        "select",
        "order by",
        "limit",
        "offset",
        "subquery",
        "dense_rank",
        "rank"
    ]
}


def clean_text(text: str) -> str:
    text = text.lower()

    text = re.sub(
        r"[^a-z0-9\s]",
        " ",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


def calculate_concept_score(
    answer: str,
    skill: str
) -> float:

    answer_clean = clean_text(answer)

    concepts = TECHNICAL_CONCEPTS.get(
        skill,
        []
    )

    if not concepts:
        return 50.0

    matched = 0

    for concept in concepts:
        concept_clean = clean_text(concept)

        if concept_clean in answer_clean:
            matched += 1

    score = (
        matched / len(concepts)
    ) * 100

    return round(score, 2)


def calculate_evidence_score(
    answer: str
) -> float:

    words = answer.split()

    word_count = len(words)

    score = 0

    if word_count >= 50:
        score += 40

    elif word_count >= 30:
        score += 30

    elif word_count >= 15:
        score += 20

    else:
        score += 5

    technical_indicators = [
        "because",
        "example",
        "when",
        "used",
        "difference",
        "advantage",
        "disadvantage",
        "implementation",
        "reason",
        "therefore"
    ]

    answer_lower = answer.lower()

    matches = sum(
        1
        for word in technical_indicators
        if word in answer_lower
    )

    score += min(
        matches * 6,
        35
    )

    sentence_count = len(
        re.findall(
            r"[.!?]",
            answer
        )
    )

    if sentence_count >= 4:
        score += 25

    elif sentence_count >= 2:
        score += 15

    else:
        score += 5

    return min(
        round(score, 2),
        100
    )


def calculate_semantic_similarity(
    answer: str,
    reference_answer: str
) -> float:

    from sentence_transformers import util

    model = get_sentence_model()

    answer_embedding = model.encode(
        answer,
        convert_to_tensor=True
    )

    reference_embedding = model.encode(
        reference_answer,
        convert_to_tensor=True
    )

    similarity = util.cos_sim(
        answer_embedding,
        reference_embedding
    ).item()

    similarity_score = (
        (similarity + 1) / 2
    ) * 100

    return round(
        similarity_score,
        2
    )


def evaluate_interview_answer(
    question: str,
    skill: str,
    difficulty: str,
    answer: str
) -> Dict:

    answer = answer.strip()

    if not answer:
        return {
            "score": 0,
            "relevance": "Low",
            "technical_understanding": "Needs Improvement",
            "evidence_quality": "Weak",
            "feedback": "No answer was provided.",
            "skill": skill,
            "difficulty": difficulty,
            "model": "AIHire-AMCI-SentenceTransformer"
        }

    reference_answer = REFERENCE_ANSWERS.get(
        skill
    )

    if not reference_answer:
        reference_answer = question

    semantic_score = calculate_semantic_similarity(
        answer,
        reference_answer
    )

    concept_score = calculate_concept_score(
        answer,
        skill
    )

    evidence_score = calculate_evidence_score(
        answer
    )

    final_score = (
        semantic_score * 0.60
        + concept_score * 0.25
        + evidence_score * 0.15
    )

    difficulty_bonus = {
        "Easy": 0,
        "Medium": 0,
        "Hard": 2
    }

    final_score += difficulty_bonus.get(
        difficulty,
        0
    )

    final_score = min(
        round(final_score, 2),
        100
    )

    if semantic_score >= 75:
        relevance = "High"

    elif semantic_score >= 50:
        relevance = "Moderate"

    else:
        relevance = "Low"

    if final_score >= 80:
        technical = "Strong"

    elif final_score >= 65:
        technical = "Good"

    elif final_score >= 50:
        technical = "Developing"

    else:
        technical = "Needs Improvement"

    if evidence_score >= 75:
        evidence = "Strong"

    elif evidence_score >= 50:
        evidence = "Moderate"

    else:
        evidence = "Weak"

    if final_score >= 80:

        feedback = (
            "The answer demonstrates strong semantic relevance "
            "to the expected technical concepts. It provides "
            "good technical evidence and explanation."
        )

    elif final_score >= 65:

        feedback = (
            "The answer demonstrates good understanding of "
            "the topic. Adding more technical reasoning and "
            "practical examples could make the response stronger."
        )

    elif final_score >= 50:

        feedback = (
            "The answer shows partial understanding of the "
            "question. Some important technical concepts "
            "or explanations are missing."
        )

    else:

        feedback = (
            "The answer has low semantic relevance to the "
            "question and does not demonstrate sufficient "
            "technical understanding. Review the key concepts "
            "and provide a more focused explanation."
        )

    return {
        "score": final_score,
        "relevance": relevance,
        "technical_understanding": technical,
        "evidence_quality": evidence,
        "feedback": feedback,
        "skill": skill,
        "difficulty": difficulty,
        "model": "AIHire-AMCI-SentenceTransformer"
    }