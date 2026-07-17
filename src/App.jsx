import { useState, useEffect } from "react";
import { usePlacementTest } from "./usePlacementTest";
import "./index.css";

export default function App() {
  const [testState, setTestState] = useState("guidance");
  const [timeLeft, setTimeLeft] = useState(1800);
  const [teacherGrades, setTeacherGrades] = useState({});

  const {
    submission,
    currentLevelIndex,
    currentLevel,
    currentQuestion,
    levelQuestions,
    getQuestionsForLevel,
    answers,
    handleAnswer,
    handleNext,
    handleSkip,
    startNewTest,
    finalizeSubmission,
    resetTest
  } = usePlacementTest();

  useEffect(() => {
    if (testState !== "testing") return;

    if (timeLeft <= 0) {
      // Submit test when time runs out
      handleNext();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [testState, timeLeft, handleNext]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSelect = (qid, value) => {
    handleAnswer(qid, value);
  };

  // Transition to teacher review when submission is created
  useEffect(() => {
    if (submission && submission.status === 'submitted_pending_review' && testState === 'testing') {
      setTestState('pending_review');
    }
  }, [submission, testState]);

  const handleFinishReview = () => {
    const finalized = finalizeSubmission(submission.studentId, teacherGrades);
    if (finalized) {
      setTestState('final_result');
    }
  };

  // 1. Guidance Screen
  if (testState === "guidance") {
    return (
      <div style={{ minHeight: '100vh', padding: 'var(--spacing-10) var(--spacing-6)' }} className="flex-center">
        <div style={{ width: '100%', maxWidth: '48rem' }} className="animate-pop-in">
          <div className="kid-card" style={{ textAlign: 'center', background: 'white' }}>
            <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-4)' }}>👋</div>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-2)' }}>
              Welcome to the Test!
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', fontWeight: '600' }}>
              Here is how to play:
            </p>

            <ul className="guidance-list" style={{ textAlign: 'left' }}>
              <li>
                <span>👀</span> Read each question carefully.
              </li>
              <li>
                <span>👆</span> Click the answer you think is right.
              </li>
              <li>
                <span>⏩</span> Click <strong>Next</strong> to move forward.
              </li>
              <li>
                <span>🤷</span> Not sure? Just click <strong>Skip</strong>!
              </li>
            </ul>

            <div style={{ marginTop: 'var(--spacing-8)', padding: 'var(--spacing-6)', background: '#f8fafc', borderRadius: 'var(--radius-lg)', border: '3px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-4)' }}>Test Levels</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', justifyContent: 'center' }}>
                {['A1', 'A2', 'B1', 'B2', 'C1'].map((level, index) => (
                  <div key={level} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e0f2fe', border: '3px solid #3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.875rem', color: '#1d4ed8' }}>
                      {index + 1}
                    </div>
                    <span style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>{level}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: 'var(--spacing-4)' }}>
                The test adapts to your level. Answer well to unlock harder questions!
              </p>
            </div>

            <button
              className="kid-btn btn-primary"
              style={{ fontSize: '1.5rem', padding: 'var(--spacing-5) var(--spacing-12)', marginTop: 'var(--spacing-6)' }}
              onClick={() => {
                startNewTest();
                setTimeLeft(1800);
                setTestState("testing");
              }}
            >
              Start Test! 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pending Review Screen (shown to students after test submission)
  if (testState === "pending_review") {
    return (
      <div style={{ minHeight: '100vh', padding: 'var(--spacing-10) var(--spacing-6)', background: 'var(--color-bg-primary)' }} className="flex-center">
        <div style={{ width: '100%', maxWidth: '42rem' }} className="animate-pop-in">
          <div className="kid-card" style={{ textAlign: 'center', background: 'white' }}>
            <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-4)' }}>✅</div>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-2)' }}>
              Submitted!
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', fontWeight: '600', marginBottom: 'var(--spacing-6)' }}>
              Your test has been submitted and is pending teacher review.
            </p>
            <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: 'var(--spacing-8)' }}>
              Your teacher will review your translation answers and finalize your results.
            </p>
            <button
              onClick={() => {
                setTeacherGrades({});
                setTestState('teacher_review');
              }}
              className="kid-btn btn-outline"
              style={{ background: 'white' }}
            >
              Teacher Review (Demo)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Teacher Review Screen
  if (testState === "teacher_review" && submission) {
    const translateQuestions = submission.shownBlocks.flatMap(level =>
      getQuestionsForLevel(level).filter(q => !q.autoGraded)
    );

    return (
      <div className="teacher-mode-bg" style={{ minHeight: '100vh', padding: 'var(--spacing-6)', paddingBottom: 'var(--spacing-16)' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }} className="animate-pop-in">
          <div className="flex-between" style={{ borderBottom: '4px solid var(--color-border)', paddingBottom: 'var(--spacing-6)', marginBottom: 'var(--spacing-10)' }}>
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-2)' }}>Teacher Review</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontWeight: '600', fontSize: '1.125rem' }}>
                Translation Answers — {translateQuestions.length} questions
              </p>
            </div>
            <div className="timer-badge" style={{ background: '#e0f2fe', borderColor: '#bae6fd', color: '#0369a1' }}>
              Grading Mode
            </div>
          </div>

          <div>
            {translateQuestions.map((q) => {
              const answerData = submission.answers[q.id];
              const modelAnswer = Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer;
              return (
                <div key={q.id} className="kid-card" style={{ background: 'white' }}>
                  <div style={{ display: 'flex', gap: 'var(--spacing-5)', marginBottom: 'var(--spacing-6)', alignItems: 'center' }}>
                    <div className="q-badge" style={{ background: '#e0f2fe', borderColor: '#7dd3fc', color: '#0369a1', boxShadow: '0 3px 0 0 #7dd3fc' }}>{q.id}</div>
                    <div className="q-badge" style={{ background: '#fef3c7', borderColor: '#fcd34d', color: '#d97706', fontSize: '0.875rem' }}>{q.level}</div>
                    <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-primary)', lineHeight: '1.4' }}>
                      {q.prompt}
                    </p>
                  </div>

                  <div style={{ background: '#f0fdf4', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-4)', border: '2px solid #86efac', marginBottom: 'var(--spacing-4)' }}>
                    <p style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', color: '#166534', fontWeight: '700', marginBottom: 'var(--spacing-1)' }}>
                      Model Answer
                    </p>
                    <p style={{ fontSize: '1rem', color: '#166534', fontWeight: '500' }}>
                      {modelAnswer}
                    </p>
                  </div>

                  <div style={{ background: '#f8fafc', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6)', border: '3px solid var(--color-border)' }}>
                    <p style={{ textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.05em', color: '#64748b', fontWeight: '700', marginBottom: 'var(--spacing-2)' }}>
                      Student's Answer
                    </p>
                    <p style={{ fontSize: '1.25rem', color: '#334155', fontWeight: '600', minHeight: '2rem' }}>
                      {answerData?.studentAnswer || <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>No answer provided</span>}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-6)' }}>
                    <button
                      onClick={() => setTeacherGrades(prev => ({ ...prev, [q.id]: true }))}
                      className={`kid-btn ${teacherGrades[q.id] === true ? 'btn-correct' : 'btn-outline'}`}
                      style={{ flex: 1 }}
                    >
                      Correct
                    </button>
                    <button
                      onClick={() => setTeacherGrades(prev => ({ ...prev, [q.id]: false }))}
                      className={`kid-btn ${teacherGrades[q.id] === false ? 'btn-incorrect' : 'btn-outline'}`}
                      style={{ flex: 1 }}
                    >
                      Incorrect
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleFinishReview}
            className="kid-btn btn-primary"
            style={{ width: '100%', marginTop: 'var(--spacing-8)', fontSize: '1.5rem', padding: 'var(--spacing-6)' }}
          >
            Finish & Show Results
          </button>
        </div>
      </div>
    );
  }

  // Final Result Screen
  if (testState === "final_result" && submission && submission.status === 'finalized') {
    const levelLabels = {
      "Pre-A1 / Beginner": "Beginner",
      "A1": "Beginner",
      "A2": "Elementary",
      "B1": "Intermediate",
      "B2": "Upper-Intermediate",
      "B2+ (approaching C1)": "Approaching Advanced",
      "C1": "Advanced"
    };

    const percentage = Math.round((submission.totalScore / 90) * 100);
    const totalCorrect = Object.values(submission.blockResults).reduce((sum, b) => sum + b.correct, 0);
    const totalQuestions = Object.values(submission.blockResults).reduce((sum, b) => sum + b.total, 0);

    return (
      <div style={{ minHeight: '100vh', padding: 'var(--spacing-10) var(--spacing-6)', background: 'var(--color-bg-primary)' }} className="flex-center">
        <div style={{ width: '100%', maxWidth: '48rem' }} className="animate-pop-in">
          <div className="kid-card" style={{ textAlign: 'center', background: 'white' }}>
            <div style={{ display: 'inline-block', background: '#fef3c7', color: '#d97706', padding: 'var(--spacing-2) var(--spacing-6)', borderRadius: 'var(--radius-full)', fontSize: '1rem', fontWeight: '700' }}>
              Awesome Job!
            </div>

            <h1 style={{ fontSize: '5rem', color: 'var(--color-accent-secondary)', margin: '0', lineHeight: '1.1' }}>{submission.finalLevel}</h1>
            <p style={{ fontSize: '1.5rem', color: 'var(--color-text-secondary)', fontWeight: '700', marginBottom: 'var(--spacing-4)' }}>
              {levelLabels[submission.finalLevel] || "Assessing"}
            </p>

            <div style={{ fontSize: '2rem', color: 'var(--color-text-primary)', fontWeight: '800', marginBottom: 'var(--spacing-6)' }}>
              {submission.totalScore} / 90 points
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-6)', paddingTop: 'var(--spacing-6)', borderTop: '4px solid var(--color-border)' }}>
              <div className="stat-box">
                <div className="stat-huge">{submission.totalScore}</div>
                <div className="stat-label-kid">Points</div>
              </div>
              <div className="stat-box" style={{ borderColor: '#4ade80', boxShadow: '0 6px 0 0 #4ade80' }}>
                <div className="stat-huge">{percentage}%</div>
                <div className="stat-label-kid">Accuracy</div>
              </div>
              <div className="stat-box" style={{ borderColor: '#a78bfa', boxShadow: '0 6px 0 0 #a78bfa' }}>
                <div className="stat-huge">{totalCorrect}/{totalQuestions}</div>
                <div className="stat-label-kid">Correct</div>
              </div>
            </div>
          </div>

          <div className="kid-card" style={{ background: 'white' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-6)', textAlign: 'center' }}>Level Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              {submission.shownBlocks.map(level => {
                const result = submission.blockResults[level];
                const blockPercentage = Math.round((result.correct / result.total) * 100);
                return (
                  <div key={level} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-4)', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '2px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                      <div className="q-badge" style={{ background: '#e0f2fe', borderColor: '#7dd3fc', color: '#0369a1' }}>{level}</div>
                      <span style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>
                        {result.correct}/{result.total} correct
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                      <span style={{ fontWeight: '700', color: 'var(--color-accent-secondary)' }}>
                        {result.pointsEarned}/{result.pointsPossible} pts
                      </span>
                      <span style={{ fontWeight: '600', color: '#64748b', fontSize: '0.875rem' }}>
                        {blockPercentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="kid-card" style={{ background: 'white' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-6)', textAlign: 'center' }}>Question Details</h3>
            <div className="breakdown-grid">
              {submission.shownBlocks.flatMap(level =>
                getQuestionsForLevel(level)
              ).map(q => {
                const answerData = submission.answers[q.id];
                const isCorrect = answerData?.finalCorrect === true;
                return (
                  <div key={q.id} className={`breakdown-item ${isCorrect ? 'correct' : 'incorrect'}`} title={`${q.type} - ${q.level}`}>
                    {q.id}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-4)', justifyContent: 'center' }}>
            <button onClick={() => setTestState("teacher_review")} className="kid-btn btn-outline" style={{ background: 'white' }}>
              Back to Review
            </button>
            <button onClick={() => {
              resetTest();
              setTimeLeft(1800);
              setTestState("guidance");
            }} className="kid-btn btn-primary">
              Restart Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Student Test Mode (One-by-One)
  if (testState === "testing" && currentQuestion) {
    const currentQuestionInLevel = levelQuestions.findIndex(q => q.id === currentQuestion.id);
    const isLastInLevel = currentQuestionInLevel === levelQuestions.length - 1;
    const progressPercent = ((currentQuestionInLevel + 1) / levelQuestions.length) * 100;

    const getBadgeTypeClass = (type) => {
      switch(type) {
        case 'multiple_choice': return 'type-mc';
        case 'fill_blank': return 'type-fill';
        case 'translate': return 'type-translate';
        default: return '';
      }
    };

    const getLevelDotClass = (index) => {
      if (index < currentLevelIndex) return 'completed';
      if (index === currentLevelIndex) return 'current';
      return 'locked';
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header className="kid-header">
          <div className="container" style={{ padding: '0 var(--spacing-6)' }}>
            <div className="flex-between" style={{ marginBottom: 'var(--spacing-4)' }}>
              <div>
                <div className="header-title">English Level Test</div>
                <div className="header-subtitle">
                  {currentLevel} — Question {currentQuestionInLevel + 1} of {levelQuestions.length}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
                <div className={`timer-badge ${timeLeft < 300 ? 'timer-danger' : ''}`}>
                  ⏱️ {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            <div className="level-progress">
              {['A1', 'A2', 'B1', 'B2', 'C1'].map((level, index) => (
                <div
                  key={level}
                  className={`level-dot ${getLevelDotClass(index)}`}
                  title={level}
                />
              ))}
            </div>

            <div className="progress-label">
              <span>Level Progress</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="progress-container">
              <div
                className="progress-bar"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </header>

        <main className="container" style={{ paddingTop: 'var(--spacing-10)', flex: 1 }}>
          <div key={currentQuestion.id} className="q-container animate-slide-in">
            <div className="q-header">
              <div className="q-badge">{currentQuestion.id}</div>
              <div className={`q-badge ${getBadgeTypeClass(currentQuestion.type)}`} style={{ fontSize: '0.875rem' }}>
                {currentQuestion.type.replace('_', ' ')}
              </div>
              <div className="q-text">{currentQuestion.prompt}</div>
            </div>

            <div style={{ paddingLeft: 'calc(3.5rem + var(--spacing-4))' }}>
              {currentQuestion.type === 'multiple_choice' ? (
                <div className="grid-2">
                  {currentQuestion.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(currentQuestion.id, opt)}
                      className={`option-btn ${answers[currentQuestion.id]?.studentAnswer === opt ? 'selected' : ''}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    placeholder="Type your answer here..."
                    value={answers[currentQuestion.id]?.studentAnswer || ""}
                    onChange={(e) => handleSelect(currentQuestion.id, e.target.value)}
                    className="kid-input"
                    autoFocus
                  />
                  {currentQuestion.type === 'translate' && (
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: 'var(--spacing-2)', fontStyle: 'italic' }}>
                      💡 Tip: Translate the Uzbek text to English
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>

        <div className="bottom-nav">
          <div className="container flex-between" style={{ padding: '0 var(--spacing-6)' }}>
            <button onClick={handleSkip} className="kid-btn btn-skip">
              {isLastInLevel ? 'Skip & Finish' : 'Skip Question'}
            </button>
            <button
              onClick={handleNext}
              className={`kid-btn ${isLastInLevel ? 'btn-finish' : 'btn-primary'}`}
            >
              {isLastInLevel ? 'Finish Test 🎉' : 'Next Question ➡'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
