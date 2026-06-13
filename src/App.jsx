import { useState, useEffect } from "react";
import englishPlacementTest from "./data";
import "./index.css";

export default function App() {
  // testState: "guidance" | "testing" | "teacher_review" | "final_result"
  const [testState, setTestState] = useState("guidance");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [answers, setAnswers] = useState({});
  const [teacherGrades, setTeacherGrades] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800);

  const allQuestions = englishPlacementTest.parts.flatMap(p => p.questions);
  const currentQuestion = allQuestions[currentQuestionIndex];

  useEffect(() => {
    if (testState !== "testing") return;
    
    // Automatically finish if all questions answered and we are on the last screen? 
    // Wait, let the user manually finish via Next/Skip on the last screen.
    // Timer Logic:
    if (timeLeft <= 0) {
      setTestState("teacher_review");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [testState, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const part1And2 = allQuestions.filter(q => q.id <= 20);
  const part3 = allQuestions.filter(q => q.id > 20);

  const handleSelect = (qid, value) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setTestState("teacher_review");
    }
  };

  const handleSkip = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setTestState("teacher_review");
    }
  };

  const normalize = (str) => {
    return (str || "")
      .toLowerCase()
      .replace(/[.,!?;:'"()[\]{}-]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const getAutoScore = () => {
    return part1And2.reduce((acc, q) => {
      const userAns = answers[q.id];
      if (q.options) return acc + (userAns === q.correctAnswer ? 1 : 0);
      return acc + (normalize(userAns) === normalize(q.correctAnswer) ? 1 : 0);
    }, 0);
  };

  const getTeacherScore = () => {
    return part3.reduce((acc, q) => acc + (teacherGrades[q.id] === true ? 1 : 0), 0);
  };

  const getLevel = (score) => {
    return englishPlacementTest.grading.levels.find(l => score >= l.min && score <= l.max);
  };

  const checkCorrectness = (q) => {
    if (q.id <= 20) {
      const userAns = answers[q.id];
      if (q.options) return userAns === q.correctAnswer;
      return normalize(userAns) === normalize(q.correctAnswer);
    } else {
      return teacherGrades[q.id] === true;
    }
  };

  // 1. Guidance Screen
  if (testState === "guidance") {
    return (
      <div style={{ minHeight: '100vh', padding: 'var(--spacing-10) var(--spacing-6)' }} className="flex-center">
        <div style={{ width: '100%', maxWidth: '40rem' }} className="animate-pop-in">
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

            <button 
              className="kid-btn btn-primary" 
              style={{ fontSize: '1.5rem', padding: 'var(--spacing-5) var(--spacing-12)', marginTop: 'var(--spacing-6)' }}
              onClick={() => setTestState("testing")}
            >
              Start Test! 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Teacher Review Mode
  if (testState === "teacher_review") {
    return (
      <div className="teacher-mode-bg" style={{ minHeight: '100vh', padding: 'var(--spacing-6)', paddingBottom: 'var(--spacing-16)' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }} className="animate-pop-in">
          <div className="flex-between" style={{ borderBottom: '4px solid var(--color-border)', paddingBottom: 'var(--spacing-6)', marginBottom: 'var(--spacing-10)' }}>
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-2)' }}>Teacher Review</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontWeight: '600', fontSize: '1.125rem' }}>Part 3 — Open-ended Answers</p>
            </div>
            <div className="timer-badge" style={{ background: '#e0f2fe', borderColor: '#bae6fd', color: '#0369a1' }}>
              Grading Mode
            </div>
          </div>

          <div>
            {allQuestions.map((q) => (
              <div key={q.id} className="kid-card" style={{ background: 'white' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-5)', marginBottom: 'var(--spacing-6)', alignItems: 'center' }}>
                  <div className="q-badge" style={{ background: '#e0f2fe', borderColor: '#7dd3fc', color: '#0369a1', boxShadow: '0 3px 0 0 #7dd3fc' }}>{q.id}</div>
                  <p style={{ fontSize: '1.375rem', fontWeight: '700', color: 'var(--color-text-primary)', lineHeight: '1.4' }}>
                    {q.question}
                  </p>
                </div>

                <div style={{ background: '#f8fafc', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-6)', border: '3px solid var(--color-border)' }}>
                  <p style={{ textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.05em', color: '#64748b', fontWeight: '700', marginBottom: 'var(--spacing-2)' }}>
                    Student's Answer
                  </p>
                  <p style={{ fontSize: '1.25rem', color: '#334155', fontWeight: '600', minHeight: '2rem' }}>
                    {answers[q.id] || <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>No answer provided</span>}
                  </p>
                </div>

                {q.id > 20 && (
                  <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-6)' }}>
                    <button
                      onClick={() => setTeacherGrades(prev => ({ ...prev, [q.id]: true }))}
                      className={`kid-btn ${teacherGrades[q.id] === true ? 'btn-correct' : 'btn-outline'}`}
                      style={{ flex: 1 }}
                    >
                      Correct (+1)
                    </button>
                    <button
                      onClick={() => setTeacherGrades(prev => ({ ...prev, [q.id]: false }))}
                      className={`kid-btn ${teacherGrades[q.id] === false ? 'btn-incorrect' : 'btn-outline'}`}
                      style={{ flex: 1 }}
                    >
                      Incorrect (0)
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setTestState("final_result")}
            className="kid-btn btn-primary"
            style={{ width: '100%', marginTop: 'var(--spacing-8)', fontSize: '1.5rem', padding: 'var(--spacing-6)' }}
          >
            Show Final Result
          </button>
        </div>
      </div>
    );
  }

  // 4. Final Result Screen
  if (testState === "final_result") {
    const autoScore = getAutoScore();
    const teacherScore = getTeacherScore();
    const totalScore = autoScore + teacherScore;
    const finalLevel = getLevel(totalScore);
    const percentage = Math.round((totalScore / 30) * 100);

    return (
      <div style={{ minHeight: '100vh', padding: 'var(--spacing-10) var(--spacing-6)', background: 'var(--color-bg-primary)' }} className="flex-center">
        <div style={{ width: '100%', maxWidth: '42rem' }} className="animate-pop-in">
          <div className="kid-card" style={{ textAlign: 'center', background: 'white' }}>
            <div style={{ display: 'inline-block', background: '#fef3c7', color: '#d97706', padding: 'var(--spacing-2) var(--spacing-6)', borderRadius: 'var(--radius-full)', fontSize: '1rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: 'var(--spacing-6)', border: '3px solid #fde68a' }}>
              Awesome Job!
            </div>

            <h1 style={{ fontSize: '6rem', color: 'var(--color-accent-secondary)', margin: '0' }}>{finalLevel?.level}</h1>
            <p style={{ fontSize: '1.75rem', color: 'var(--color-text-secondary)', fontWeight: '700' }}>{finalLevel?.label}</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-8)', paddingTop: 'var(--spacing-8)', borderTop: '4px solid var(--color-border)' }}>
              <div className="stat-box">
                <div className="stat-huge">{totalScore}</div>
                <div className="stat-label-kid">Score</div>
              </div>
              <div className="stat-box" style={{ borderColor: '#4ade80', boxShadow: '0 6px 0 0 #4ade80' }}>
                <div className="stat-huge">{percentage}%</div>
                <div className="stat-label-kid">Accuracy</div>
              </div>
              <div className="stat-box" style={{ borderColor: '#a78bfa', boxShadow: '0 6px 0 0 #a78bfa' }}>
                <div className="stat-huge">{totalScore}</div>
                <div className="stat-label-kid">Correct</div>
              </div>
            </div>
          </div>

          <div className="kid-card" style={{ background: 'white' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-6)', textAlign: 'center' }}>Question Breakdown</h3>
            <div className="breakdown-grid">
              {allQuestions.map(q => {
                const isCorrect = checkCorrectness(q);
                return (
                  <div key={q.id} className={`breakdown-item ${isCorrect ? 'correct' : 'incorrect'}`}>
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
            <button onClick={() => window.location.reload()} className="kid-btn btn-primary">
              Restart Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Student Test Mode (One-by-One)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header className="kid-header">
        <div className="container flex-between" style={{ padding: '0 var(--spacing-6)' }}>
          <div>
            <div className="header-title">English Level Test</div>
            <div className="header-subtitle">Question {currentQuestionIndex + 1} of {allQuestions.length}</div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
            <div className={`timer-badge ${timeLeft < 300 ? 'timer-danger' : ''}`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: 'var(--spacing-10)', flex: 1 }}>
        <div key={currentQuestion.id} className="q-container animate-slide-in">
          <div className="q-header">
            <div className="q-badge">{currentQuestion.id}</div>
            <div className="q-text">{currentQuestion.question}</div>
          </div>

          <div style={{ paddingLeft: 'calc(3.5rem + var(--spacing-4))' }}>
            {currentQuestion.options ? (
              <div className="grid-2">
                {currentQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(currentQuestion.id, opt)}
                    className={`option-btn ${answers[currentQuestion.id] === opt ? 'selected' : ''}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <input
                type="text"
                placeholder="Type your answer here..."
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleSelect(currentQuestion.id, e.target.value)}
                className="kid-input"
              />
            )}
          </div>
        </div>
      </main>

      <div className="bottom-nav">
        <div className="container flex-between" style={{ padding: '0 var(--spacing-6)' }}>
          <button onClick={handleSkip} className="kid-btn btn-skip">
            {currentQuestionIndex < allQuestions.length - 1 ? 'Skip Question' : 'Skip & Finish'}
          </button>
          <button 
            onClick={handleNext} 
            className={`kid-btn ${currentQuestionIndex < allQuestions.length - 1 ? 'btn-primary' : 'btn-finish'}`}
          >
            {currentQuestionIndex < allQuestions.length - 1 ? 'Next Question ➡' : 'Finish Test 🎉'}
          </button>
        </div>
      </div>
    </div>
  );
}