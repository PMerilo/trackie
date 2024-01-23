import { useState, useEffect } from 'react';
const Model = (props) => {
  const [generated, setGenerated] = useState([]);
  useEffect(() => {
    const formData = new FormData()
    formData.append("hobbies", props.hobbies)
    fetch('http://127.0.0.1:5000/testModel', {
        method: "POST",
        body: formData
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setGenerated(data);
      });
  }, []);
  return (
    <div>
      {generated.map((hobby) => (
        <div key={hobby.hobbyId}>{hobby.name}</div>
      ))}
    </div>
  );
};
export default Model;
