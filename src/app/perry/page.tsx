'use client'

import { Speechbubble } from "./components/Speechbubble"
import { Recorder } from "./components/Recorder"
import { useEffect, useRef, useState } from "react"

export default function Home() {
  const [resultList, setResultList] = useState<SpeechRecognitionResultList>()

  const messages = useRef<any>(null)

  useEffect(() => {
    messages?.current?.lastElementChild?.scrollIntoView({behavior: 'smooth'})
  }, [resultList])
  return (
    <main>
      <div className="grid grid-cols-2 p-8 gap-16 w-full h-screen">
        <div className="flex h-full justify-evenly flex-grow card bg-base-300 rounded-box place-items-center">
          WebCam
          <Recorder onResult={setResultList}></Recorder>
          <div id="outputText" className=""></div>
        </div>
        <div className="flex h-full flex-grow card bg-base-300 rounded-box p-4 overflow-y-scroll" ref={messages}>
          { 
            resultList && Array.from(Array(resultList.length).keys()).map((index) => <Speechbubble key={index} content={resultList[index][0].transcript}/>)
          }
        </div>
      </div>
    </main>
  )
}
