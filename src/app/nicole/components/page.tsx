
//App.tsx
"use client";
import { useState, useEffect } from 'react';
import Quiz from "./Quiz";
import Model from "./fetch"
// import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
    const [array, setArray] = useState([]);
    return (
        <div className="container
        pt-10       
        h-screen
        flex
        mx-auto
        content-center
        justify-center">
            
            {array.length > 0 ? <Model hobbies={array}></Model>: <Quiz onComplete={setArray}/>}
        </div>
    );
}
 
export default App;