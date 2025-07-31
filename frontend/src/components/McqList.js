import React, { useState } from "react";

const McqList = ({ mcqs, language }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showAnswers, setShowAnswers] = useState(false);

  const handleAnswerSelect = (questionIndex, option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: option,
    });
  };

  const toggleAnswers = () => {
    setShowAnswers(!showAnswers);
  };

  const getScore = () => {
    let correct = 0;
    mcqs.forEach((mcq, index) => {
      if (selectedAnswers[index] === mcq.answer) {
        correct++;
      }
    });
    return correct;
  };

  const allQuestionsAnswered =
    Object.keys(selectedAnswers).length === mcqs.length;

  return (
    <div className="mcq-section">
      <div className="mcq-header">
        <h2>🧠 Generated MCQs ({mcqs.length} questions)</h2>
        <div className="header-buttons">
          {allQuestionsAnswered && showAnswers && (
            <div className="score-display">
              Score: {getScore()}/{mcqs.length} (
              {Math.round((getScore() / mcqs.length) * 100)}%)
            </div>
          )}
          <button onClick={toggleAnswers} className="toggle-answers">
            {showAnswers ? "🙈 Hide Answers" : "👁️ Show Answers"}
          </button>
        </div>
      </div>

      <div className="mcq-list">
        {mcqs.map((mcq, index) => (
          <div
            key={index}
            className={`mcq-item ${
              showAnswers
                ? selectedAnswers[index] === mcq.answer
                  ? "correct-item"
                  : "incorrect-item"
                : ""
            }`}
          >
            <h3>
              ❓ {index + 1}. {mcq.question}
            </h3>
            <div className="options">
              {Object.entries(mcq.options).map(([key, value]) => {
                const isSelected = selectedAnswers[index] === key;
                const isCorrect = mcq.answer === key;
                const showCorrect = showAnswers && isCorrect;
                const showIncorrect = showAnswers && isSelected && !isCorrect;

                return (
                  <div
                    key={key}
                    className={`option ${isSelected ? "selected" : ""} ${
                      showCorrect ? "correct-option" : ""
                    } ${showIncorrect ? "incorrect-option" : ""}`}
                  >
                    <input
                      type="radio"
                      id={`q${index}-${key}`}
                      name={`question-${index}`}
                      checked={isSelected}
                      onChange={() => handleAnswerSelect(index, key)}
                    />
                    <label htmlFor={`q${index}-${key}`}>
                      <span className="option-key">{key.toUpperCase()})</span>
                      <span className="option-text">{value}</span>
                      {showCorrect && <span className="status-icon">✅</span>}
                      {showIncorrect && <span className="status-icon">❌</span>}
                    </label>
                  </div>
                );
              })}
            </div>
            {showAnswers && mcq.explanation && (
              <div className="explanation">
                <strong>💡 Explanation:</strong> {mcq.explanation}
              </div>
            )}
            {showAnswers && !mcq.explanation && (
              <div className="correct-answer">
                <strong>✅ Correct answer:</strong> {mcq.answer.toUpperCase()}
              </div>
            )}
          </div>
        ))}
      </div>

      {allQuestionsAnswered && !showAnswers && (
        <div className="completion-message">
          <p>
            🎉 Great! You've answered all questions. Click "Show Answers" to see
            your results!
          </p>
        </div>
      )}
    </div>
  );
};

export default McqList;
