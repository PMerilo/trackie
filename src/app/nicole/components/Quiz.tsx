//Quiz.tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Question from "./Question";

const Quiz: React.FC = (props) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [hobbies, setHobbies] = useState([]);
  const [answer, setAnswer] = useState([]);
  // const router = useRouter();
  // const [Loading, setLoading] = useState(false);
  useEffect(() => {
    try {
      fetch("http://127.0.0.1:5000/hobbyData")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          // {hobbies.map((hobby) => (
          //     <div key={hobby.hobbyId}>{hobby.name}</div>
          //   ))}
          //   console.log(hobbies[1]);
          let randomsArr: number[] = [];
          //   let newArr: any[] = [];
          let setArr: any[] = [];
          while (setArr.length < 10) {
            randomsArr = [];
            while (randomsArr.length < 4) {
              var rand = data[Math.floor(Math.random() * data.length)];
              // console.log(Math.floor(Math.random() * data.length));
              if (!randomsArr.find((rnd) => rnd == rand)) {
                randomsArr.push(rand);
                //   newArr.push(rand.name);
              }
              console.log("test")
              console.log(randomsArr);
              // console.log(newArr)
            }
            setArr.push(randomsArr);
          }
          // console.log("set" + setArr.length)
          console.log(setArr)
          setHobbies(setArr)
          return setArr;
        });
    } catch (e) {
      console.log(e);
    }
  }, []);
  // console.log("test" + hobbies)
  //   const questions = splitQuestion()
  const handleAnswer = (input: number) => {
    setAnswer( (current) => [...current, input])

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < hobbies.length) {
      setCurrentQuestion(nextQuestion);
      console.log("answer"+ answer)
    } else {
      props.onComplete(answer)
      // alert(`Quiz finished. You scored ${score}/${hobbies.length}`);
    }
  };
  return (
    <div>
      <h1 className="text-center">Quiz App</h1>
      {/* {currentQuestion < hobbies.length ? (
        <Question
          question={hobbies[currentQuestion]}
          choices={hobbies[currentQuestion]}
          answer={hobbies[currentQuestion]}
          onAnswer={handleAnswer}
        />
      ) : (
        "null"
      )} */}
      <Question
      hobbies={hobbies[currentQuestion]}
      answer={hobbies[currentQuestion]}
      onAnswer={handleAnswer}>

      </Question>
    </div>
  );
};

export default Quiz;
