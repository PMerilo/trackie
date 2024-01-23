import { useState, useEffect } from 'react';
import React from 'react';
function useFetchData() {
  const [hobbies, setHobbies] = useState([]);
  // const [Loading, setLoading] = useState(false);
  useEffect(() => {
    Fetchapi();
  }, []);

  const Fetchapi = () => {
    try {
        console.log("run2")
      fetch("http://127.0.0.1:5000/hobbyData")
        .then((response) => {
          return response.json();
        })
        .then((data) => setHobbies(data));
    } catch (e) {
      console.log(e);
    }
  };
  return hobbies
  }
  
export default useFetchData;