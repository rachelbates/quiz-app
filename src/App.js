import React, { useState, useEffect } from 'react';
import { Header, Quiz, Results } from './components';
import { getQuizzes } from './data/quizzes';

const App = () => {
  const [showNext, setShowNext] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isQuestionMode, setIsQuestionMode] = useState(true);
  const [quizData, setQuizData] = useState({});
  const [currentQuizData, setCurrentQuizData] = useState({});
  const [location, setLocation] = useState({ quiz: 0, question: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [correctCount, setCorrectCount] = useState([0, 0]);
  // const [countTakes, setCountTakes] = useState({});

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    await getQuizzes().then((response) => {
      setQuizData(response);
      updateQuiz(response);
      setIsLoaded(true);
    });
  }

  //Update Quiz Shown with updated data
  const updateQuiz = (response) => {
    const quizTitle = response[location.quiz].title;
    const quizQuestion =
      response[location.quiz].questions[location.question].text;
    const incorrectAnswers =
      response[location.quiz].questions[location.question].incorrectAnswers;
    const quizAnswers = [...incorrectAnswers];

    //generate random index number to insert answer into
    const correctAnswerLocation = Math.floor(
      Math.random() * incorrectAnswers.length + 1,
    );
    const quizCorrectAnswer =
      response[location.quiz].questions[location.question].correctAnswer;
    quizAnswers.splice(correctAnswerLocation, 0, quizCorrectAnswer);
    setCurrentQuizData({
      quizTitle: quizTitle,
      quizQuestion: quizQuestion,
      quizAnswers: quizAnswers,
      correctAnswerLocation: correctAnswerLocation,
      selected: null,
    });
  };

  //Update Quiz Count Tally
  // const updateQuizCount = () => {
  // };

  //Handle Click of next button
  const handleNext = () => {
    // Check if Next button is clicked while in Question Mode vs Summary
    if (isQuestionMode) {
      // Check if question is in range, if not, show Summary screen.
      if (location.question < quizData[location.quiz].questions.length - 1) {
        setLocation({
          quiz: location.quiz,
          question: (location.question += 1),
        });
        updateQuiz(quizData);
        setShowNext(false);
      } else if (
        location.question ===
        quizData[location.quiz].questions.length - 1
      ) {
        setIsQuestionMode(false);
        // updateQuizCount();
        //Show Next Button
        setShowNext(true);
        // If quiz is at the end of quizzes, reset to start
        // Otherwise, set quiz location to next quiz
        if (location.quiz >= quizData.length - 1) {
          setLocation({
            quiz: 0,
            question: 0,
          });
        } else {
          setLocation({
            quiz: (location.quiz += 1),
            question: 0,
          });
        }
      } else {
        //Should never show :)
        console.log('Encountered an exception');
      }
    } else {
      setShowNext(false);
      updateQuiz(quizData);
      setIsQuestionMode(true);
      setCorrectCount([0, 0]);
    }
  };

  //Handle answer selection on quiz
  const answerSelect = (index) => {
    if (showNext === false) {
      //Check if answer is correct
      //If so, set the correct counter and response signal to the app
      if (index === currentQuizData.correctAnswerLocation) {
        setIsCorrect(true);
        setCorrectCount([
          (correctCount[0] += 1),
          quizData[location.quiz].questions.length,
        ]);
      } else {
        setIsCorrect(false);
        setCorrectCount([
          correctCount[0],
          quizData[location.quiz].questions.length,
        ]);
      }
      Object.assign(currentQuizData, { selected: index });
      setShowNext(true);
    }
  };

  return (
    <div>
      <Header title={currentQuizData.quizTitle} />
      <Quiz
        currentQuizData={currentQuizData}
        isLoaded={isLoaded}
        answerSelect={answerSelect}
        isQuestionMode={isQuestionMode}
        correctCount={correctCount}
      />
      <Results
        handleNext={handleNext}
        isCorrect={isCorrect}
        showNext={showNext}
        isQuestionMode={isQuestionMode}
      />
    </div>
  );
};

export default App;
