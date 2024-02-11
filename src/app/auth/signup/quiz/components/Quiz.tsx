'use client'

import { useState } from "react";
import Question from "./Question";

export default function Quiz({ data, onComplete } : { data : any[], onComplete: Function }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [hobbies, setHobbies] = useState(data);
    const [answer, setAnswer] = useState<number[]>([])

    const handleAnswer = (input: number) => {
      setAnswer( (current) => [...current, input] )
      if (currentQuestion == hobbies.length-1) onComplete(answer)
      setCurrentQuestion(currentQuestion+1);
    }
    
    return (
      <div>
        <Question
          hobbies={hobbies[currentQuestion]}
          onAnswer={handleAnswer}>
  
        </Question>
      </div>
    )
  }