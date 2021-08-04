import React from 'react';
import { getMessage } from '../data/messages';

const Quiz = ({
  currentQuizData,
  isLoaded,
  answerSelect,
  isQuestionMode,
  correctCount,
}) => {
  // Get message from messages file
  const message = getMessage();

  //choose style class based on whether the answer was correct
  const colorSelector = () => {
    if (currentQuizData.selected === currentQuizData.correctAnswerLocation) {
      return 'correct-answer';
    } else {
      return 'incorrect-answer';
    }
  };
  const selectedColor = colorSelector();

  //Check if the mode is Question Mode vs Summary, and display accordingly
  if (isQuestionMode) {
    //Check if the data from server has loaded
    if (isLoaded) {
      return (
        <>
          <div>
            <h2>{currentQuizData.quizQuestion}</h2>
            <ol type="A">
              {currentQuizData.quizAnswers.map((answer, index) => (
                <li
                  key={index}
                  onClick={(e) => answerSelect(index)}
                  className={
                    currentQuizData.selected === index ? selectedColor : null
                  }
                >
                  {answer}
                </li>
              ))}
            </ol>
          </div>
        </>
      );
    } else {
      return <p>Loading...</p>;
    }
  } else {
    return (
      <div>
        <p>
          You got {correctCount[0]} of {correctCount[1]} questions right.
        </p>
        <p>{message}</p>
      </div>
    );
  }
};

export default Quiz;
