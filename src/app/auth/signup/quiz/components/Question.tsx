'use client'

import React from "react";

export default function Question({
    hobbies,
    onAnswer
    } : {
    hobbies: any[]
    onAnswer: Function
  }) {
//   console.log("test")
  // console.log(hobbies[0])
  return (
    <div className="">
      <div className="flex flex-col">
        {hobbies && hobbies.map((hobby, i) => (
          <button
            className="btn btn-success btn-lg m-2 text-4xl h-32"
            onClick={() => onAnswer(parseInt(hobby.hobbyId))}
            key={i}
          >
        {hobby.name}
          </button>
        ))}
      </div>
    </div>
  )
}