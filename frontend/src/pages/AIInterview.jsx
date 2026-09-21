import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AIInterview.css";


// ==========================================================
// AIHire-AMCI ADAPTIVE QUESTION BANK
// ==========================================================

const QUESTION_BANK = [
  {
    id: 1,
    skill: "Python",
    difficulty: "Easy",
    question:
      "What is the difference between a Python list and a tuple?",
  },
  {
    id: 2,
    skill: "Python",
    difficulty: "Medium",
    question:
      "Explain the difference between a Python list and a tuple. When would you choose one over the other?",
  },
  {
    id: 3,
    skill: "Python",
    difficulty: "Hard",
    question:
      "Explain shallow copy and deep copy in Python. When would you use each?",
  },

  {
    id: 4,
    skill: "Data Structures",
    difficulty: "Easy",
    question:
      "What is a stack and what principle does it follow?",
  },
  {
    id: 5,
    skill: "Data Structures",
    difficulty: "Medium",
    question:
      "What is the difference between a stack and a queue? Give a practical example for each.",
  },
  {
    id: 6,
    skill: "Data Structures",
    difficulty: "Hard",
    question:
      "How would you implement a queue using two stacks? Explain the approach and its complexity.",
  },

  {
    id: 7,
    skill: "SQL",
    difficulty: "Easy",
    question:
      "What is the difference between WHERE and HAVING in SQL?",
  },
  {
    id: 8,
    skill: "SQL",
    difficulty: "Medium",
    question:
      "How would you find the second-highest salary from an employee table using SQL?",
  },
  {
    id: 9,
    skill: "SQL",
    difficulty: "Hard",
    question:
      "How would you find the second-highest salary using a window function? Explain the difference between RANK and DENSE_RANK.",
  },
];


// ==========================================================
// INITIAL INTERVIEW QUESTIONS
// ==========================================================

const INITIAL_QUESTIONS = [
  QUESTION_BANK[1], // Python Medium
  QUESTION_BANK[4], // Data Structures Medium
  QUESTION_BANK[7], // SQL Medium
];


// ==========================================================
// FIND ADAPTIVE QUESTION
// ==========================================================

function selectAdaptiveQuestion(
  currentQuestion,
  score,
  usedQuestionIds
) {
  const currentDifficulty = currentQuestion.difficulty;

  let targetDifficulty = currentDifficulty;

  // Strong answer → increase difficulty
  if (score >= 80) {
    if (currentDifficulty === "Easy") {
      targetDifficulty = "Medium";
    } else if (currentDifficulty === "Medium") {
      targetDifficulty = "Hard";
    }
  }

  // Weak answer → decrease difficulty
  else if (score < 50) {
    if (currentDifficulty === "Hard") {
      targetDifficulty = "Medium";
    } else if (currentDifficulty === "Medium") {
      targetDifficulty = "Easy";
    }
  }

  // Moderate answer → keep same difficulty
  else {
    targetDifficulty = currentDifficulty;
  }


  // First try to find a question for the SAME skill
  let nextQuestion = QUESTION_BANK.find(
    (item) =>
      item.skill === currentQuestion.skill &&
      item.difficulty === targetDifficulty &&
      !usedQuestionIds.includes(item.id)
  );


  // If unavailable, choose another skill
  if (!nextQuestion) {
    nextQuestion = QUESTION_BANK.find(
      (item) =>
        item.difficulty === targetDifficulty &&
        !usedQuestionIds.includes(item.id)
    );
  }


  // Final fallback
  if (!nextQuestion) {
    nextQuestion = QUESTION_BANK.find(
      (item) =>
        !usedQuestionIds.includes(item.id)
    );
  }


  return nextQuestion || null;
}


// ==========================================================
// COMPONENT
// ==========================================================

function AIInterview() {

  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(
    INITIAL_QUESTIONS[0]
  );

  const [questionHistory, setQuestionHistory] = useState(
    INITIAL_QUESTIONS
  );

  const [answer, setAnswer] = useState("");

  const [answers, setAnswers] = useState([]);

  const [evaluating, setEvaluating] = useState(false);

  const [evaluation, setEvaluation] = useState(null);

  const [finished, setFinished] = useState(false);

  // ========================================================
  // VOICE RECORDING / WHISPER
  // ========================================================

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [isRecording, setIsRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [speechAnalysis, setSpeechAnalysis] = useState(null);
  const [recordingError, setRecordingError] = useState("");

  // ========================================================
  // ASSESSMENT INTEGRITY / PROCTORING
  // ========================================================

  const [proctoring, setProctoring] = useState({
    copyEvents: 0,
    pasteEvents: 0,
    tabSwitches: 0,
    responseTimeSeconds: 0,
    riskScore: 0,
    riskLevel: "Normal",
    signals: [],
    humanReviewRequired: false,
    analyzing: false,
    error: "",
  });

  const copyEventsRef = useRef(0);
  const pasteEventsRef = useRef(0);
  const tabSwitchesRef = useRef(0);
  const responseStartTimeRef = useRef(Date.now());
  const latestProctoringRef = useRef({
    risk_score: 0,
    risk_level: "Normal",
    signals: [],
    human_review_required: false,
  });

  // Live integrity monitoring / pause control
  const [isPaused, setIsPaused] = useState(false);
  const [pauseReason, setPauseReason] = useState("");
  const [integrityWarning, setIntegrityWarning] = useState("");
  const pauseTriggeredRef = useRef(false);

  const triggerIntegrityPause = (reason) => {
    if (pauseTriggeredRef.current || finished) return;

    pauseTriggeredRef.current = true;
    setPauseReason(reason);
    setIsPaused(true);
    setIntegrityWarning("");
  };

  // Observe assessment interaction signals while this page is open.
  useEffect(() => {
    copyEventsRef.current = 0;
    pasteEventsRef.current = 0;
    tabSwitchesRef.current = 0;
    responseStartTimeRef.current = Date.now();
    latestProctoringRef.current = {
      risk_score: 0,
      risk_level: "Normal",
      signals: [],
      human_review_required: false,
    };

    pauseTriggeredRef.current = false;
    setIsPaused(false);
    setPauseReason("");
    setIntegrityWarning("");

    setProctoring({
      copyEvents: 0,
      pasteEvents: 0,
      tabSwitches: 0,
      responseTimeSeconds: 0,
      riskScore: 0,
      riskLevel: "Normal",
      signals: [],
      humanReviewRequired: false,
      analyzing: false,
      error: "",
    });

    const handleCopy = () => {
      copyEventsRef.current += 1;
      const count = copyEventsRef.current;

      if (count >= 3 && count < 5) {
        setIntegrityWarning("Multiple copy actions detected. Please answer independently.");
      }

      if (count >= 5) {
        triggerIntegrityPause(
          "Frequent copy activity detected during the assessment."
        );
      }
    };

    const handlePaste = () => {
      pasteEventsRef.current += 1;
      const count = pasteEventsRef.current;

      if (count >= 3 && count < 5) {
        setIntegrityWarning("Multiple paste actions detected. Please answer independently.");
      }

      if (count >= 5) {
        triggerIntegrityPause(
          "Frequent paste activity detected during the assessment."
        );
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchesRef.current += 1;
        const count = tabSwitchesRef.current;

        if (count >= 3 && count < 5) {
          setIntegrityWarning("Multiple tab switches detected. Please remain on the interview page.");
        }

        if (count >= 5) {
          triggerIntegrityPause(
            "Frequent tab switching detected during the assessment."
          );
        }
      }
    };

    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentQuestion.id]);

  const analyzeProctoring = async () => {
    const responseTimeSeconds = Math.max(
      0,
      Math.round((Date.now() - responseStartTimeRef.current) / 1000)
    );

    const payload = {
      copy_events: copyEventsRef.current,
      paste_events: pasteEventsRef.current,
      tab_switches: tabSwitchesRef.current,
      response_time_seconds: responseTimeSeconds,
      answer_similarity: 0.0,
    };

    setProctoring((previous) => ({
      ...previous,
      copyEvents: payload.copy_events,
      pasteEvents: payload.paste_events,
      tabSwitches: payload.tab_switches,
      responseTimeSeconds,
      analyzing: true,
      error: "",
    }));

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/proctoring/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Proctoring analysis failed");
      }

      const data = await response.json();
      latestProctoringRef.current = data;

      if ((data.risk_score ?? 0) >= 60) {
        triggerIntegrityPause(
          "High assessment-integrity risk detected by AIHire."
        );
      }

      setProctoring((previous) => ({
        ...previous,
        riskScore: data.risk_score ?? 0,
        riskLevel: data.risk_level ?? "Normal",
        signals: data.signals ?? [],
        humanReviewRequired: data.human_review_required ?? false,
        analyzing: false,
        error: "",
      }));

      return data;
    } catch (error) {
      console.error("Proctoring analysis error:", error);

      setProctoring((previous) => ({
        ...previous,
        analyzing: false,
        error: "Unable to connect to the proctoring service.",
      }));

      const fallback = {
        risk_score: 0,
        risk_level: "Unavailable",
        signals: [],
        human_review_required: false,
      };
      latestProctoringRef.current = fallback;
      return fallback;
    }
  };

  const startRecording = async () => {
    try {
      setRecordingError("");
      setTranscript("");
      setSpeechAnalysis(null);
      setEvaluation(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      audioChunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());

        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        await Promise.all([
          transcribeRecording(audioBlob),
          analyzeRecording(audioBlob),
        ]);
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone error:", error);
      setRecordingError(
        "Microphone access was not available. Please allow microphone permission and try again."
      );
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeRecording = async (audioBlob) => {
    setTranscribing(true);
    setRecordingError("");

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "interview-answer.webm");

      const response = await fetch(
        "http://127.0.0.1:8000/api/speech/transcribe",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Speech transcription failed");
      }

      const data = await response.json();

      setTranscript(data.transcript || "");
      setAnswer(data.transcript || "");
    } catch (error) {
      console.error("Speech transcription error:", error);
      setRecordingError(
        "Unable to transcribe the recording. Please make sure the backend is running."
      );
    } finally {
      setTranscribing(false);
    }
  };



  const analyzeRecording = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "interview-answer.webm");

      const response = await fetch(
        "http://127.0.0.1:8000/api/speech/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Speech analysis failed");
      }

      const data = await response.json();
      setSpeechAnalysis(data);
    } catch (error) {
      console.error("Speech analysis error:", error);
      setRecordingError(
        "Speech transcription worked, but speech feature analysis failed."
      );
    }
  };


  useEffect(() => {
    if (isPaused && mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isPaused]);

  // ========================================================
  // CURRENT PROGRESS
  // ========================================================

  const questionNumber = answers.length + 1;

  const totalQuestions = 5;


  // ========================================================
  // AI EVALUATION
  // ========================================================

  const evaluateAnswer = async () => {

    if (!answer.trim()) return;

    setEvaluating(true);
    setEvaluation(null);

    // Analyze observable assessment-integrity signals for this answer.
    const proctoringResult = await analyzeProctoring();

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/interview/evaluate",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            question: currentQuestion.question,
            skill: currentQuestion.skill,
            difficulty: currentQuestion.difficulty,
            answer: answer.trim(),
          }),
        }
      );


      if (!response.ok) {
        throw new Error(
          "Interview evaluation failed"
        );
      }


      const data = await response.json();


      setEvaluation({
        score: data.score,
        relevance: data.relevance,
        technical: data.technical_understanding,
        evidence: data.evidence_quality,
        feedback: data.feedback,
        model: data.model,
      });

    } catch (error) {

      console.error(
        "Interview evaluation error:",
        error
      );


      setEvaluation({
        score: 0,
        relevance: "Unavailable",
        technical: "Unavailable",
        evidence: "Unavailable",
        feedback:
          "Unable to connect to the AIHire evaluation service. Please make sure the backend is running.",
        model: "AIHire-AMCI",
      });

    } finally {

      setEvaluating(false);

    }
  };


  // ========================================================
  // NEXT ADAPTIVE QUESTION
  // ========================================================

  const nextQuestion = () => {

    const score = evaluation?.score || 0;


    // Save current answer
    const updatedAnswers = [
      ...answers,
      {
        question: currentQuestion.question,
        skill: currentQuestion.skill,
        difficulty: currentQuestion.difficulty,
        answer: answer,
        score: score,
        proctoring: {
          riskScore: latestProctoringRef.current.risk_score ?? 0,
          riskLevel: latestProctoringRef.current.risk_level ?? "Normal",
          signals: latestProctoringRef.current.signals ?? [],
          humanReviewRequired:
            latestProctoringRef.current.human_review_required ?? false,
        },
      },
    ];


    setAnswers(updatedAnswers);


    // Finish after 5 questions
    if (updatedAnswers.length >= totalQuestions) {

      setAnswer("");
      setEvaluation(null);
      setFinished(true);

      return;
    }


    // Get IDs of questions already used
    const usedQuestionIds = [
      ...questionHistory.map(
        (item) => item.id
      ),
    ];


    // AIHire-AMCI adaptive selection
    const next = selectAdaptiveQuestion(
      currentQuestion,
      score,
      usedQuestionIds
    );


    if (next) {

      setCurrentQuestion(next);

      setQuestionHistory([
        ...questionHistory,
        next,
      ]);

    }


    setAnswer("");
    setEvaluation(null);
    setTranscript("");
    setSpeechAnalysis(null);
    setRecordingError("");
    latestProctoringRef.current = {
      risk_score: 0,
      risk_level: "Normal",
      signals: [],
      human_review_required: false,
    };

    setProctoring({
      copyEvents: 0,
      pasteEvents: 0,
      tabSwitches: 0,
      responseTimeSeconds: 0,
      riskScore: 0,
      riskLevel: "Normal",
      signals: [],
      humanReviewRequired: false,
      analyzing: false,
      error: "",
    });
  };


  // ========================================================
  // OVERALL SCORE
  // ========================================================

  const calculateOverallScore = () => {

    if (!answers.length) {
      return 0;
    }


    const total = answers.reduce(
      (sum, item) =>
        sum + item.score,
      0
    );


    return Math.round(
      total / answers.length
    );
  };


  const resumeInterview = () => {
    setIsPaused(false);
    setPauseReason("");
    setIntegrityWarning("");
  };

  const endInterviewForReview = () => {
    setIsPaused(false);
    setPauseReason("");
    setFinished(true);
  };

  // ========================================================
  // COMPLETED SCREEN
  // ========================================================

  if (finished) {

    const overallScore =
      calculateOverallScore();


    return (
      <div className="interview-page">

        <div className="interview-header">

          <div>

            <p className="breadcrumb">
              AIHire / Adaptive Interview
            </p>

            <h1>
              Interview Completed
            </h1>

            <p>
              AIHire-AMCI has completed the
              adaptive technical assessment.
            </p>

          </div>


          <div className="model-badge">
            AIHire-AMCI
          </div>

        </div>


        <div className="completion-card">

          <span className="completion-label">
            AIHire-AMCI Interview Score
          </span>


          <h2>
            {overallScore}%
          </h2>


          <p>
            Candidate performance based on
            semantic answer evaluation and
            adaptive questioning.
          </p>


          <div className="completion-grid">

            <div>
              <strong>
                {answers.length}
              </strong>

              <span>
                Questions Evaluated
              </span>
            </div>


            <div>
              <strong>
                {
                  answers.filter(
                    (item) =>
                      item.score >= 70
                  ).length
                }
              </strong>

              <span>
                Strong Responses
              </span>
            </div>


            <div>
              <strong>
                {
                  answers.filter(
                    (item) =>
                      item.score < 55
                  ).length
                }
              </strong>

              <span>
                Skill Gaps
              </span>
            </div>

          </div>

        </div>


        <div className="evaluation-panel">

          <h3>
            Adaptive Interview Evidence
          </h3>


          {answers.map(
            (item, index) => (

              <div
                className="history-item"
                key={index}
              >

                <div>

                  <strong>
                    Question {index + 1}
                  </strong>

                  <p>
                    {item.skill} ·{" "}
                    {item.difficulty}
                  </p>

                </div>


                <div>
                  <div className="evaluation-score">
                    {item.score}%
                  </div>
                  {item.proctoring && (
                    <small>
                      Integrity: {item.proctoring.riskLevel} ({item.proctoring.riskScore}%)
                    </small>
                  )}
                </div>

              </div>

            )
          )}

        </div>

        <div className="completion-actions">
          <button
            type="button"
            className="continue-coding-button"
            onClick={() => navigate("/coding-assessment")}
          >
            Continue to Coding Assessment →
          </button>
        </div>

      </div>
    );
  }


  // ========================================================
  // INTERVIEW SCREEN
  // ========================================================

  return (

    <div className={`interview-page ${isPaused ? "interview-paused" : ""}`}>

      {/* LIVE INTEGRITY WARNING */}
      {integrityWarning && !isPaused && (
        <div className="integrity-warning">
          <div className="integrity-warning-icon">⚠</div>
          <div>
            <strong>Assessment Integrity Warning</strong>
            <p>{integrityWarning}</p>
          </div>
        </div>
      )}

      {/* PAUSE OVERLAY */}
      {isPaused && (
        <div className="pause-overlay">
          <div className="pause-modal">
            <div className="pause-icon">⏸</div>
            <div className="pause-kicker">AIHire-AMCI · Assessment Integrity</div>
            <h2>Interview Paused</h2>
            <p className="pause-main-message">
              The interview has been temporarily paused because unusual
              assessment activity was detected.
            </p>

            <div className="pause-reason">
              <span>Detected reason</span>
              <strong>{pauseReason}</strong>
            </div>

            <div className="pause-stats">
              <div>
                <span>Copy</span>
                <strong>{copyEventsRef.current}</strong>
              </div>
              <div>
                <span>Paste</span>
                <strong>{pasteEventsRef.current}</strong>
              </div>
              <div>
                <span>Tab switches</span>
                <strong>{tabSwitchesRef.current}</strong>
              </div>
            </div>

            <div className="pause-note">
              <strong>Human review recommended</strong>
              <p>
                These signals are indicators only. They do not prove cheating
                and should not be used for automatic rejection.
              </p>
            </div>

            <div className="pause-actions">
              <button
                type="button"
                className="resume-button"
                onClick={resumeInterview}
              >
                ▶ Resume Interview
              </button>

              <button
                type="button"
                className="end-interview-button"
                onClick={endInterviewForReview}
              >
                End Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}

      <div className="interview-header">

        <div>

          <p className="breadcrumb">
            AIHire / Adaptive Interview
          </p>


          <h1>
            AI Adaptive Interview
          </h1>


          <p>
            AIHire-AMCI evaluates your answer
            and dynamically selects the next
            question based on performance.
          </p>

        </div>


        <div className="model-badge">
          AIHire-AMCI
        </div>

      </div>


      {/* STATUS */}

      <div className="status-grid">

        <div className="status-card">

          <span>
            Target Role
          </span>

          <strong>
            Software Developer
          </strong>

        </div>


        <div className="status-card">

          <span>
            Progress
          </span>

          <strong>
            {questionNumber} / {totalQuestions}
          </strong>

        </div>


        <div className="status-card">

          <span>
            Interview Mode
          </span>

          <strong>
            Adaptive
          </strong>

        </div>

      </div>


      {/* PROGRESS */}

      <div className="progress-card">

        <div className="progress-top">

          <span>
            Assessment Progress
          </span>


          <strong>
            {Math.round(
              (questionNumber /
                totalQuestions) *
                100
            )}
            %
          </strong>

        </div>


        <div className="interview-progress">

          <div
            className="interview-progress-fill"
            style={{
              width: `${
                (questionNumber /
                  totalQuestions) *
                100
              }%`,
            }}
          />

        </div>

      </div>


      {/* QUESTION */}

      <div className="question-card">

        <div className="question-top">

          <div>

            <span>
              Question {questionNumber}
            </span>


            <h2>
              {currentQuestion.question}
            </h2>

          </div>


          <div className="difficulty-badge">
            {currentQuestion.difficulty}
          </div>

        </div>


        {/* SKILL */}

        <div className="skill-tag">
          Assessing:{" "}
          {currentQuestion.skill}
        </div>


        {/* ADAPTIVE NOTE */}

        <div className="adaptive-note">

          <strong>
            AIHire-AMCI Adaptive Question Selection
          </strong>


          <p>
            The next question is selected
            according to your previous answer
            performance and current skill level.
          </p>

        </div>



        {/* VOICE ANSWER */}

        <div className="voice-answer-section">
          <div className="answer-title">
            <label>Voice Answer</label>
            <span>
              {isRecording
                ? "Recording..."
                : transcribing
                ? "Transcribing..."
                : "Speak your answer"}
            </span>
          </div>

          <div className="voice-controls">
            {!isRecording ? (
              <button
                type="button"
                className="record-button"
                onClick={startRecording}
                disabled={isPaused || evaluating || transcribing || evaluation}
              >
                🎤 Start Recording
              </button>
            ) : (
              <button
                type="button"
                className="stop-recording-button"
                onClick={stopRecording}
              >
                ⏹ Stop Recording
              </button>
            )}
          </div>

          {isRecording && (
            <div className="recording-status">
              🔴 Recording your answer... Click <strong>Stop Recording</strong>{" "}
              when you finish.
            </div>
          )}

          {transcribing && (
            <div className="transcribing-status">
              🤖 Whisper is converting your speech to text...
            </div>
          )}

          {recordingError && (
            <div className="recording-error">{recordingError}</div>
          )}

          {transcript && (
            <div className="transcript-box">
              <div className="transcript-heading">Whisper Transcript</div>
              <p>{transcript}</p>
            </div>
          )}

          {speechAnalysis && (
            <div className="speech-analysis-box">
              <div className="transcript-heading">
                Librosa Speech Analysis
              </div>

              <div className="speech-analysis-grid">
                <div>
                  <span>Duration</span>
                  <strong>{speechAnalysis.duration_seconds} sec</strong>
                </div>

                <div>
                  <span>Speech Energy</span>
                  <strong>{speechAnalysis.average_energy}</strong>
                </div>

                <div>
                  <span>Signal Variation</span>
                  <strong>{speechAnalysis.zero_crossing_rate}</strong>
                </div>

                <div>
                  <span>Frequency Profile</span>
                  <strong>{speechAnalysis.spectral_centroid} Hz</strong>
                </div>

                <div>
                  <span>Tempo</span>
                  <strong>{speechAnalysis.tempo_bpm} BPM</strong>
                </div>
              </div>
            </div>
          )}
        </div>


        {/* ASSESSMENT INTEGRITY */}

        <div className="adaptive-note">
          <strong>Assessment Integrity Monitoring</strong>
          <p>
            AIHire observes assessment interaction signals such as copy/paste activity,
            tab switching, and response timing. These signals are used for risk
            assessment and human review, not automatic rejection.
          </p>
        </div>

        <div className="speech-analysis-box">
          <div className="transcript-heading">
            Proctoring Status
          </div>

          <div className="speech-analysis-grid">
            <div>
              <span>Copy Events</span>
              <strong>{proctoring.copyEvents}</strong>
            </div>

            <div>
              <span>Paste Events</span>
              <strong>{proctoring.pasteEvents}</strong>
            </div>

            <div>
              <span>Tab Switches</span>
              <strong>{proctoring.tabSwitches}</strong>
            </div>

            <div>
              <span>Response Time</span>
              <strong>{proctoring.responseTimeSeconds} sec</strong>
            </div>

            <div>
              <span>Integrity Risk</span>
              <strong>
                {proctoring.analyzing
                  ? "Analyzing..."
                  : `${proctoring.riskScore}%`}
              </strong>
            </div>

            <div>
              <span>Risk Level</span>
              <strong
                className={`risk-value risk-${proctoring.riskLevel
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                {proctoring.riskLevel}
              </strong>
            </div>
          </div>

          {proctoring.signals.length > 0 && (
            <div style={{ marginTop: "16px" }}>
              <strong>Detected Signals</strong>
              <ul>
                {proctoring.signals.map((signal, index) => (
                  <li key={index}>{signal}</li>
                ))}
              </ul>
            </div>
          )}

          {proctoring.humanReviewRequired && (
            <div className="adaptive-note">
              <strong>Human Review Recommended</strong>
              <p>
                Observable assessment signals indicate that this response should be
                reviewed by a human evaluator.
              </p>
            </div>
          )}

          {proctoring.error && (
            <div className="recording-error">
              {proctoring.error}
            </div>
          )}
        </div>

        {/* ANSWER */}

        <div className="answer-section">

          <div className="answer-title">

            <label>
              Your Answer
            </label>


            <span>
              {answer.trim()
                ? answer
                    .trim()
                    .split(/\s+/)
                    .length
                : 0}{" "}
              words
            </span>

          </div>


          <textarea
            value={answer}
            onChange={(e) => {
              setAnswer(
                e.target.value
              );

              setEvaluation(null);
            }}
            placeholder="Explain your answer with relevant technical examples..."
            disabled={
              evaluating ||
              evaluation ||
              isRecording ||
              transcribing
            }
          />


          <button
            className="evaluate-button"
            onClick={evaluateAnswer}
            disabled={
              isPaused ||
              !answer.trim() ||
              evaluating ||
              evaluation ||
              isRecording ||
              transcribing
            }
          >

            {evaluating
              ? "AI Evaluating..."
              : "Evaluate Answer"}

          </button>

        </div>


        {/* EVALUATION */}

        {evaluation && (

          <div className="evaluation-panel">

            <h3>
              AI Answer Evaluation
            </h3>


            <div className="evaluation-score">
              {evaluation.score}%
            </div>


            <div className="evaluation-grid">

              <div>

                <span>
                  Relevance
                </span>

                <strong>
                  {evaluation.relevance}
                </strong>

              </div>


              <div>

                <span>
                  Technical Understanding
                </span>

                <strong>
                  {evaluation.technical}
                </strong>

              </div>


              <div>

                <span>
                  Evidence Quality
                </span>

                <strong>
                  {evaluation.evidence}
                </strong>

              </div>

            </div>


            <p>
              {evaluation.feedback}
            </p>


            <small>
              Evaluation Model:{" "}
              {evaluation.model}
            </small>


            {/* ADAPTIVE DECISION */}

            <div className="adaptive-note">

              <strong>
                Next Question Decision
              </strong>


              <p>

                {evaluation.score >= 80
                  ? "Strong performance detected → the system will increase the difficulty."
                  : evaluation.score < 50
                  ? "Weak performance detected → the system will reduce the difficulty or reinforce the skill."
                  : "Moderate performance detected → the system will maintain a similar difficulty level."}

              </p>

            </div>


            <button
              className="next-question-button"
              onClick={nextQuestion}
            >

              {questionNumber >=
              totalQuestions
                ? "Complete Interview"
                : "Next Adaptive Question"}

            </button>

          </div>

        )}

      </div>

    </div>
  );
}


export default AIInterview;