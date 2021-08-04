import React from 'react';

const Results = ({ handleNext, isCorrect, showNext, isQuestionMode }) => {
  // Set quiz screen based on mode
  return (
    <div>
      {showNext && (
        <>
          {isQuestionMode && (
            <p>{isCorrect ? <em>Correct!</em> : <em>Incorrect...</em>}</p>
          )}
          <button className="next" onClick={handleNext}>
            Next
          </button>
        </>
      )}
    </div>
  );
};

export default Results;
