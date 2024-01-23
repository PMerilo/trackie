import React from "react";

interface Props {
  hobbies: any[];
  answer: string;
  onAnswer: (answer: number) => void;
}

const Question: React.FC<Props> = (props) => {
  console.log("test")
  // console.log(props.hobbies[0])
  return (
    <div
      className=""
    >
      <h2 className="text-center">hello</h2>
      <div className="">
        {props.hobbies && props.hobbies.map((hobby) => (
          // eslint-disable-next-line react/jsx-key
          <button
            className="btn btn-success m-2"
            onClick={() => props.onAnswer(parseInt(hobby.hobbyId))}
          >
            {hobby.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Question;
