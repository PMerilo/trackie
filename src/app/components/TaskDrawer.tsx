'use client'

import { useEffect, useState } from "react"
import { StepInput } from "@/app/api/user/step/route"
import { Prisma } from "@prisma/client"
import TaskStep from "@/app/components/TaskStep"
import TaskCard from "@/app/components/TaskCard"
import TaskAddCustom from "./TaskAddCustom"

const taskWithSteps = Prisma.validator<Prisma.TaskDefaultArgs>()({
    include: { steps: true },
})
export type TaskWithSteps = Prisma.TaskGetPayload<typeof taskWithSteps>


async function getRecommendations() {
    const res = await fetch(`/api/user/recommendations`)
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }
    return await res.json()
}

export enum Activity {
    List,
    Add,
    Custom
}

export default function TaskDrawer({
    tasks
} : {
    tasks : TaskWithSteps[],
}) {
    
    const [taskList, setTaskList] = useState<TaskWithSteps[]>(tasks)

    const [title, setTitle] = useState('')
    const [hobbyId, setHobbyId] = useState<number | undefined>(undefined)
    const [activity, setActivity] = useState<Activity>(Activity.List)
    const [reccos, setReccos] = useState<{ name: string, hobbyId: number }[]>([])


    const Wrapper =  ({ children }: { children: React.ReactNode }) => (
        <div className="p-4 flex flex-col gap-y-4 bg-base-100 rounded-xl">
            {children}
        </div>
    )

    function taskApi(method: string, task: object) {
        return fetch(`/api/user/task`, {
            method: method,
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task })
        }) 
    }


    function updateTask({ title, time, id } : { title: string, time: Date, id: number }) {
        taskApi("post", { title, time, id })
        .then(() => {
            setTaskList(taskList.map( t => {
                title = title ?? t.title
                time = time ?? t.time
                return t.id == id ? { ...t, title, time } : t
            }))
        })
    }

    function delTask(id: number) {
        taskApi("delete", { id })
        .then(() => setTaskList(taskList.filter((t) => id != t.id)))
    }

    useEffect(() => {
        if (activity == Activity.Add && reccos.length == 0) getRecommendations().then((reco : { name: string, hobbyId: number }[]) => setReccos(reco))
    }, [activity])
    
    switch (activity) {
        case Activity.Add:


            return (
                <Wrapper>
                    <div className="flex flex-col gap-4">

                    { reccos.length > 0 ? 
                    <>
                        { [...reccos].splice(Math.floor(Math.random() * 9), 2).map((tile, i) => (
                            <div className="card w-full bg-base-200 cursor-pointer" onClick={() => {setHobbyId(tile.hobbyId); setTitle(tile.name); setActivity(Activity.Custom)}} key={i}>
                                <div className="card-body items-center text-center">
                                    <h2 className="card-title">{tile.name}</h2>
                                </div>
                            </div>
                        )) }
                        <div className="card w-full bg-base-200 cursor-pointer" onClick={() => {setHobbyId(undefined); setTitle(''); setActivity(Activity.Custom)}}>
                            <div className="card-body items-center text-center">
                                <h2 className="card-title">I would like to do something else</h2>
                            </div>
                        </div>
                        <button className="btn btn-error btn-outline" onClick={() => setActivity(Activity.List)}>Cancel</button>
                    </>
                    : <span className="loading loading-bars loading-lg m-auto"></span> }
                    </div>
                </Wrapper>
            )

        case Activity.Custom:
            return (
                <Wrapper>
                    <TaskAddCustom defaultTitle={title} defaultHobbyId={hobbyId} activityHandler={setActivity} onAdd={(task: TaskWithSteps) => setTaskList([...taskList, task])}></TaskAddCustom>
                </Wrapper>
            )
    
        default:
            return (
                <Wrapper>
                    { tasks.map((t, i) => <TaskCard task={t} key={i}/>) }
                    <div className="card w-full glass hover:animate-pulse cursor-pointer" onClick={() => setActivity(Activity.Add)}>
                        <div className="card-body items-center text-center">
                            <h1 className="card-title">Add new task +</h1>
                        </div>
                    </div>
                </Wrapper>
            )
    }
}