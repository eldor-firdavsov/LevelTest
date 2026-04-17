import { useState, useEffect } from "react";
import englishPlacementTest from "./data";

export default function App() {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [teacherGrades, setTeacherGrades] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800);

  const allQuestions = englishPlacementTest.parts.flatMap(p => p.questions);

  useEffect(() => {
    if (!started || finished) return;
    if (Object.keys(answers).length === allQuestions.length) return;

    if (timeLeft <= 0) {
      setFinished(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, finished, answers, allQuestions.length, timeLeft]);

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

  const handleLogin = () => {
    if (login === "admin" && password === "1234") {
      setStarted(true);
      setError("");
    } else {
      setError("Incorrect username or password");
    }
  };

  // 1. Login Screen
  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center px-6 font-sans">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">

            <h1 className="text-4xl font-bold tracking-tighter text-white">English Level Test</h1>
            <p className="text-blue-300 mt-3 text-lg">Admin Access</p>
          </div>

          <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-xs font-semibold tracking-widest text-slate-500 mb-2">
                  USERNAME
                </label>
                <input
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="w-full border border-slate-300 focus:border-blue-600 rounded-2xl px-6 py-4 text-lg focus:outline-none"
                  placeholder="admin"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-widest text-slate-500 mb-2">
                  PASSWORD
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-300 focus:border-blue-600 rounded-2xl px-6 py-4 text-lg focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm text-center bg-red-50 py-3 rounded-2xl">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-4 rounded-2xl text-lg"
              >
                Sign In
              </button>
            </form>
          </div>

          <p className="text-center text-blue-200/70 text-xs mt-8">Authorized personnel only</p>
        </div>
      </div>
    );
  }

  // 3. Teacher Review Mode (Clean White Background)
  if (finished && !showFinal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-6 font-sans text-slate-950">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 flex justify-between items-end border-b border-slate-200 pb-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Teacher Review</h2>
              <p className="text-slate-500 mt-1">Part 3 — Open-ended Answers</p>
            </div>
            <div className="text-sm font-medium text-blue-700 bg-blue-100 px-4 py-1 rounded-full">Grading Mode</div>
          </div>

          <div className="space-y-10">
            {part3.map((q) => (
              <div key={q.id} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow transition-shadow">
                <div className="flex gap-5 mb-7">
                  <div className="w-11 h-11 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center font-bold text-2xl flex-shrink-0">
                    {q.id}
                  </div>
                  <p className="text-xl leading-relaxed font-medium text-slate-800">{q.question}</p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-7 mb-8">
                  <p className="uppercase text-xs tracking-widest text-slate-500 mb-3 font-semibold">Student's Answer</p>
                  <p className="text-lg text-slate-700 leading-relaxed min-h-[70px]">
                    {answers[q.id] || <span className="italic text-slate-400">No answer provided</span>}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setTeacherGrades(prev => ({ ...prev, [q.id]: true }))}
                    className={`flex-1 py-5 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-3
                      ${teacherGrades[q.id] === true
                        ? "bg-emerald-600 text-white shadow-md"
                        : "border-2 border-slate-300 hover:bg-slate-50 text-slate-700"}`}
                  >
                    Correct (1 pt)
                  </button>
                  <button
                    onClick={() => setTeacherGrades(prev => ({ ...prev, [q.id]: false }))}
                    className={`flex-1 py-5 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-3
                      ${teacherGrades[q.id] === false
                        ? "bg-red-600 text-white shadow-md"
                        : "border-2 border-slate-300 hover:bg-slate-50 text-slate-700"}`}
                  >
                    Incorrect (0 pt)
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowFinal(true)}
            className="mt-12 w-full bg-blue-700 hover:bg-blue-800 text-white py-5 rounded-3xl text-xl font-semibold tracking-wide transition-all active:scale-[0.985]"
          >
            Show Final Result →
          </button>
        </div>
      </div>
    );
  }

  // 4. Final Result Screen (Clean White Background)
  if (showFinal) {
    const autoScore = getAutoScore();
    const teacherScore = getTeacherScore();
    const totalScore = autoScore + teacherScore;
    const finalLevel = getLevel(totalScore);
    const percentage = Math.round((totalScore / 30) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 py-20 px-6 font-sans text-slate-950 flex items-center justify-center">
        <div className="w-full max-w-2xl text-center">
          <div className="bg-white border border-slate-200 rounded-3xl p-16 shadow-sm mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-6 py-2 rounded-full mb-8">
              OFFICIAL RESULT
            </div>

            <h1 className="text-7xl font-black tracking-tighter text-slate-900 mb-3">{finalLevel?.level}</h1>
            <p className="text-2xl text-slate-600 font-medium">{finalLevel?.label}</p>

            <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-slate-100">
              <div>
                <p className="text-5xl font-bold text-slate-900 mb-1">{totalScore}<span className="text-2xl text-slate-400">/30</span></p>
                <p className="text-sm font-medium text-slate-500 tracking-widest">TOTAL SCORE</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-slate-900 mb-1">{percentage}%</p>
                <p className="text-sm font-medium text-slate-500 tracking-widest">ACCURACY</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-slate-900 mb-1">{totalScore}</p>
                <p className="text-sm font-medium text-slate-500 tracking-widest">CORRECT ANSWERS</p>
              </div>
            </div>
          </div>

          {/* Question Breakdown */}
          <div className="bg-white border border-slate-200 rounded-3xl p-10 mb-12 shadow-sm">
            <h3 className="font-semibold text-lg mb-8 text-slate-700">Question Breakdown</h3>
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-3">
              {allQuestions.map(q => {
                const isCorrect = checkCorrectness(q);
                return (
                  <div
                    key={q.id}
                    className={`aspect-square rounded-2xl flex items-center justify-center font-semibold text-lg border-2 transition-all
                      ${isCorrect
                        ? "bg-emerald-100 border-emerald-400 text-emerald-700"
                        : "bg-red-100 border-red-400 text-red-700"}`}
                  >
                    {q.id}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center gap-10 mt-10 text-sm font-medium text-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-xl bg-emerald-100 border-2 border-emerald-400"></div>
                Correct
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-xl bg-red-100 border-2 border-red-400"></div>
                Incorrect
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowFinal(false)}
              className="px-12 py-5 border border-slate-300 hover:bg-slate-100 rounded-3xl font-medium transition-all"
            >
              Back to Review
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-12 py-5 bg-blue-700 text-white rounded-3xl font-medium hover:bg-blue-800 transition-all"
            >
              Restart Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Student Test Mode
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white font-sans pb-32">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-white/10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">

            <div>
              <div className="font-bold text-2xl tracking-tight text-slate-950">English Level Test</div>
              <div className="text-xs text-slate-500 -mt-1">30 Questions • Placement Test</div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="bg-blue-50 text-blue-700 text-sm font-medium px-6 py-2.5 rounded-3xl border border-blue-100 text-center min-w-[80px]">
              {formatTime(timeLeft)}
            </div>
            <div className="bg-blue-50 text-blue-700 text-sm font-medium px-6 py-2.5 rounded-3xl border border-blue-100">
              {Object.keys(answers).length} / {allQuestions.length}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-14">
        <div className="space-y-20">
          {allQuestions.map((q) => (
            <div key={q.id} className="scroll-mt-20">
              <div className="flex gap-5 mb-7">
                <div className="w-11 h-11 bg-white/10 backdrop-blur border border-white/20 text-white rounded-2xl flex items-center justify-center font-bold text-2xl flex-shrink-0">
                  {q.id}
                </div>
                <p className="text-[22px] leading-tight font-medium text-white">{q.question}</p>
              </div>

              <div className="pl-14">
                {q.options ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelect(q.id, opt)}
                        className={`text-left px-7 py-6 border-2 rounded-3xl text-lg transition-all font-medium
                          ${answers[q.id] === opt
                            ? "bg-white border-white text-slate-950 shadow-md"
                            : "border-white/30 hover:border-white/60 hover:bg-white/10 text-white"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="Type your answer here..."
                    value={answers[q.id] || ""}
                    onChange={(e) => handleSelect(q.id, e.target.value)}
                    className="w-full bg-white/10 border border-white/30 focus:border-blue-400 rounded-3xl px-7 py-6 text-lg focus:outline-none transition-all placeholder-white/60 text-white"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 flex justify-center">
          <button
            onClick={() => setFinished(true)}
            className="px-16 py-6 bg-white hover:bg-blue-50 text-slate-950 font-semibold text-xl rounded-3xl transition-all active:scale-[0.985]"
          >
            Finish Test
          </button>
        </div>
      </main>
    </div>
  );
}