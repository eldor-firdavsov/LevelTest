import { useState, useCallback } from 'react';
import englishPlacementTest from './data';

const normalize = (str) => {
  return (str || "")
    .toLowerCase()
    .replace(/[.,!?;:'"()[\]{}-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

export const usePlacementTest = () => {
  const [submission, setSubmission] = useState(null);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [shownBlocks, setShownBlocks] = useState([]);

  const levels = englishPlacementTest.meta.levels;
  const questionsByLevel = {};
  
  levels.forEach(level => {
    questionsByLevel[level] = englishPlacementTest.questions.filter(q => q.level === level);
  });

  const getCurrentLevelQuestions = useCallback(() => {
    const currentLevel = levels[currentLevelIndex];
    return questionsByLevel[currentLevel] || [];
  }, [currentLevelIndex, levels, questionsByLevel]);

  const getQuestionsForLevel = useCallback((level) => {
    return questionsByLevel[level] || [];
  }, [questionsByLevel]);

  const getCurrentQuestion = useCallback(() => {
    const levelQuestions = getCurrentLevelQuestions();
    return levelQuestions[currentQuestionIndex];
  }, [currentQuestionIndex, getCurrentLevelQuestions]);

  const checkAutoGradedAnswer = useCallback((question, studentAnswer) => {
    if (!question.autoGraded) return null;
    
    if (question.type === 'multiple_choice') {
      return studentAnswer === question.correctAnswer;
    }
    
    if (question.type === 'fill_blank') {
      const normalizedStudent = normalize(studentAnswer);
      const correctAnswers = Array.isArray(question.correctAnswer) 
        ? question.correctAnswer 
        : [question.correctAnswer];
      return correctAnswers.some(ans => normalize(ans) === normalizedStudent);
    }
    
    return null;
  }, []);

  const handleAnswer = useCallback((questionId, studentAnswer) => {
    const question = englishPlacementTest.questions.find(q => q.id === questionId);
    const autoCorrect = checkAutoGradedAnswer(question, studentAnswer);
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        studentAnswer,
        autoCorrect,
        manualCorrect: null
      }
    }));
  }, [checkAutoGradedAnswer]);

  const handleNext = useCallback(() => {
    const levelQuestions = getCurrentLevelQuestions();
    
    if (currentQuestionIndex < levelQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // End of block - check if should continue
      const blockAutoCorrectCount = levelQuestions
        .filter(q => q.autoGraded)
        .reduce((count, q) => {
          const answerData = answers[q.id];
          return count + (answerData?.autoCorrect === true ? 1 : 0);
        }, 0);

      const autoGradedInBlock = levelQuestions.filter(q => q.autoGraded).length;
      const passedBlock = blockAutoCorrectCount >= (autoGradedInBlock / 2);

      if (passedBlock && currentLevelIndex < levels.length - 1) {
        // Continue to next level
        setShownBlocks(prev => [...prev, levels[currentLevelIndex]]);
        setCurrentLevelIndex(prev => prev + 1);
        setCurrentQuestionIndex(0);
      } else {
        // Stop test - submit for review
        const finalShownBlocks = [...shownBlocks, levels[currentLevelIndex]];
        setSubmission({
          studentId: Date.now().toString(),
          answers: { ...answers },
          shownBlocks: finalShownBlocks,
          status: 'submitted_pending_review',
          timestamp: new Date().toISOString()
        });
      }
    }
  }, [currentQuestionIndex, currentLevelIndex, getCurrentLevelQuestions, answers, shownBlocks, levels]);

  const handleSkip = useCallback(() => {
    const levelQuestions = getCurrentLevelQuestions();
    
    if (currentQuestionIndex < levelQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Skip at end of block - same logic as next
      handleNext();
    }
  }, [currentQuestionIndex, getCurrentLevelQuestions, handleNext]);

  const startNewTest = useCallback(() => {
    setSubmission(null);
    setCurrentLevelIndex(0);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShownBlocks([]);
  }, []);

  const finalizeSubmission = useCallback((submissionId, manualGrades) => {
    if (!submission || submission.studentId !== submissionId) return null;

    const finalAnswers = {};
    let totalScore = 0;
    const blockResults = {};

    submission.shownBlocks.forEach(level => {
      const levelQuestions = questionsByLevel[level];
      let correctCount = 0;
      let pointsEarned = 0;
      let pointsPossible = 0;

      levelQuestions.forEach(q => {
        const answerData = submission.answers[q.id];
        const manualGrade = manualGrades[q.id];
        
        let finalCorrect;
        if (q.autoGraded) {
          finalCorrect = answerData?.autoCorrect === true;
        } else {
          finalCorrect = manualGrade === true;
        }

        finalAnswers[q.id] = {
          ...answerData,
          manualCorrect: q.autoGraded ? null : manualGrade,
          finalCorrect
        };

        if (finalCorrect) {
          correctCount++;
          pointsEarned += q.points;
        }
        pointsPossible += q.points;
      });

      blockResults[level] = {
        correct: correctCount,
        total: levelQuestions.length,
        pointsEarned,
        pointsPossible
      };

      totalScore += pointsEarned;
    });

    // Determine final CEFR level
    let finalLevel = "Pre-A1 / Beginner";
    for (const level of submission.shownBlocks) {
      const result = blockResults[level];
      if (result.correct >= 3) {
        finalLevel = level;
      } else {
        break;
      }
    }

    // Special case for C1
    if (submission.shownBlocks.includes("C1")) {
      const c1Result = blockResults["C1"];
      if (c1Result && c1Result.correct < 3) {
        finalLevel = "B2+ (approaching C1)";
      }
    }

    const finalizedSubmission = {
      ...submission,
      answers: finalAnswers,
      blockResults,
      totalScore,
      finalLevel,
      status: 'finalized'
    };

    setSubmission(finalizedSubmission);
    return finalizedSubmission;
  }, [submission, questionsByLevel]);

  const resetTest = useCallback(() => {
    startNewTest();
  }, [startNewTest]);

  return {
    // State
    submission,
    currentLevelIndex,
    currentQuestionIndex,
    answers,
    shownBlocks,

    // Computed
    currentLevel: levels[currentLevelIndex],
    currentQuestion: getCurrentQuestion(),
    levelQuestions: getCurrentLevelQuestions(),
    getQuestionsForLevel,
    totalQuestions: englishPlacementTest.meta.totalQuestions,
    maxScore: englishPlacementTest.meta.maxScore,

    // Actions
    handleAnswer,
    handleNext,
    handleSkip,
    startNewTest,
    finalizeSubmission,
    resetTest
  };
};
