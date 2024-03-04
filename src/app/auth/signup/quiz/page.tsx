import { getServerSession } from 'next-auth/next'
import Quiz from './components/Quiz';
import { authOptions } from '@/lib/authOptions'
import { useState } from 'react';
import { redirect } from 'next/navigation';

async function fetchHobbies() {
    const res = await fetch(`${process.env.FLASK_SERVER_URL || "http://127.0.0.1:5000"}/nicole/hobbies`)
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
   
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
   
    return res.json()
    .then((data) => {
        // console.log(data);
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
            // console.log("test")
            // console.log(randomsArr);
            // console.log(newArr)
          }
          setArr.push(randomsArr);
        }
        // console.log("set" + setArr.length)
        // console.log(setArr)
        return setArr;
      });
}

export default async function Home() {
    const session = await getServerSession(authOptions)
    const hobbies = await fetchHobbies()

    if (!session) redirect("/auth/login?callbackUrl=/auth/signup/quiz")

    async function onComplete(hobbies: number[]){
        'use server'
        const data = {
            id: parseInt(session!.user.id),
            hobbies
        }
        // console.log(data)
        fetch(`${process.env.FLASK_SERVER_URL || "http://127.0.0.1:5000"}/nicole/add-hobbies`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
        .then((res) => res.text())
        .then(() => redirect("/"))
        // .then(data => console.log(data))
    }
    return (
        <div className="grid gap-y-8">
            <h1 className="text-5xl font-bold text-left">Which activity would interest you the most?</h1>
            <div className="py-6 grid gap-4">
                <Quiz data={hobbies} onComplete={onComplete}></Quiz>
            </div>
        </div>
    )
}
