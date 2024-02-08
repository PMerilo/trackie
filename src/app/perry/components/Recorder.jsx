'use client'

import React, { useEffect, useState } from "react";

export const Recorder = (props) => {
    const [onClickHandler, setOnClickHandler]  = useState(null)
    const [btnState, setBtnState]  = useState('Start')
    let listening = false
    useEffect(() => {
        const recognition = new window.webkitSpeechRecognition || new window.SpeechRecognition
        recognition.continuous = true;
        recognition.onresult = (event) => {
            props.onResult ? props.onResult(event.results) : null
        }
        recognition.onend = (event) => {
            if (listening) {
                recognition.start()
                console.log("Listening stopped... Starting again")
            } else {
                setBtnState("Start")
            }
        }
        setOnClickHandler(() => () => {
            if (listening) {
                listening = false
                setBtnState("Start"); 
                recognition.stop(); 
            } else {
                listening = true
                setBtnState("Stop");                 
                recognition.start(); 
            }
        })
    }, [])


    return (
        !onClickHandler ? 

        <div>
            <span className="loading loading-spinner"></span>
        </div> :

        <div>
            <button className="btn btn-wide btn-primary" onClick={onClickHandler}>{btnState}</button>
        </div>
    )
}