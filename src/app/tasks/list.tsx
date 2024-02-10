'use client'

import { useEffect, useRef, useState } from "react"
import { Step, Prisma } from "@prisma/client"

const taskWithSteps = Prisma.validator<Prisma.TaskDefaultArgs>()({
    include: { steps: true },
})
type TaskWithSteps = Prisma.TaskGetPayload<typeof taskWithSteps>

async function getRecommendations(userId: string) {
    const res = await fetch(`/api/user/${userId}/recommendations`)
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }
    return await res.json()
}

export default function TaskDrawer({
    tasks, userId
} : {
    tasks : TaskWithSteps[],
    userId: string
}) {
    enum Activity {
        List,
        Add,
        Custom
    }
    const [activity, setActivity] = useState<Activity>(Activity.List)
    const [rand, setRand] = useState(0)
    const [reccos, setReccos] = useState<{ name: string, hobbyId: number }[]>([])
    useEffect(() => {
        setRand(Math.floor(Math.random() * 9))
        if (activity == Activity.Add && reccos.length == 0) getRecommendations(userId).then((reco : { name: string, hobbyId: number }[]) => setReccos(reco))
    }, [activity])
    console.log(activity)
    const Wrapper =  ({ children }: { children: React.ReactNode }) => (
        <div className="p-4 flex flex-col gap-y-4 bg-gray-400 rounded-xl">
            {children}
        </div>
    )

    switch (activity) {
        case Activity.Add:
            return (
                <Wrapper>
                    <div className="flex flex-col gap-4">

                    { reccos.length > 0 ? 
                    <>
                        { [...reccos].splice(rand, 2).map((tile) => (
                            <div className="card w-full bg-base-200 cursor-pointer" onClick={() => {}}>
                                <div className="card-body items-center text-center">
                                    <h2 className="card-title">{tile.name}</h2>
                                </div>
                            </div>
                        )) }
                        <div className="card w-full bg-base-200 cursor-pointer" onClick={() => setActivity(Activity.Custom)}>
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
                    <div className="card w-full bg-base-200">
                        <div className="card-body items-center">
                        <h2 className="card-title">Add Task</h2>
                        <form className="w-full" method="post">
                            <label className="form-control w-full gap-y-4">
                                <div>
                                    <div className="label">
                                    <span className="label-text">Title</span>
                                    </div>
                                    <input type="text" placeholder="Type here" className="input input-bordered w-full" />
                                </div>
                                <div>
                                    <div className="label">
                                    <span className="label-text">Time</span>
                                    </div>
                                    <input type="datetime-local" placeholder="Type here" className="input input-bordered w-full" />
                                </div>
                            </label>
                            <StepsList steps={[]}></StepsList>
                        </form>
                        <div className="card-actions justify-end w-full mt-6">
                            <button className="btn btn-primary btn-block" type="submit">Add Task</button>
                            <button className="btn btn-error btn-block" onClick={() => setActivity(Activity.List)}>Cancel</button>
                        </div>
                        </div>
                    </div>
                </Wrapper>
            )
    
        default:
            return (
                <Wrapper>
                    { tasks.map(t => <TaskCard task={t}/>) }
                    <div className="card w-full glass hover:animate-pulse cursor-pointer" onClick={() => setActivity(Activity.Add)}>
                        <div className="card-body items-center text-center">
                            <h1 className="card-title">Add new task +</h1>
                        </div>
                    </div>
                </Wrapper>
            )
    }
}

function TaskCard({ task } : { task: TaskWithSteps }) {
    return (
        <div className="collapse collapse-plus border border-base-300 bg-base-200 ">
            <input type="checkbox" />
            <div className="collapse-title font-medium">
                <p className="text-4xl">{task.title}</p>
            </div>
            <div className="collapse-content"> 
                <StepsList steps={task.steps}/>
            </div>
        </div>
    )
}

function StepsList({ steps } : { steps: Step[] }) {
    const [stepsList, setSteps] = useState<{id?: number, content: string, completed: boolean, taskId?: number}[]>([])
    
    useEffect(() => {
        steps.forEach(s => addStep({
            id: s.id, 
            content: s.content, 
            completed: s.completed, 
            taskId: s.taskId
        }))
    }, [])

    function addStep(step : {id?: number, content: string, completed: boolean, taskId?: number}) {
        setSteps([
            ...stepsList, 
            step
        ])
    }

    function delStep(index: number) {
        const newSteps = stepsList.filter((s, i) => i != index)
        setSteps(newSteps);
    }

    function handleCompleted(index: number) {
        const newSteps = stepsList.map((s, i) => {
            if (i == index) return {...s, completed: !s.completed}
            return s
        })
        setSteps(newSteps);
    }

    function handleContent(index: number, content: string) {
        const newSteps = stepsList.map((s, i) => {
            if (i == index) return {...s, content: content}
            return s
        })
        setSteps(newSteps);
    }
    
    return (
        <div className="mt-6 flex flex-col gap-y-4">
            <div className="form-control">
            { stepsList.map(( s, i ) => 
                <label className="label cursor-pointer justify-start gap-x-4" key={i}>
                  <input type="checkbox" checked={s.completed} className="checkbox" onChange={(e) => {handleCompleted(i)}}/>
                  <input className="btn text-start grow" placeholder={`Step ${i+1}`} value={s.content} onChange={(e) => {handleContent(i, e.target.value)}}/> 
                  <button className="btn btn-error btn-outline" onClick={(e) => {e.preventDefault(); delStep(i)}}>D</button> 
                </label>
            )}
            <button role="button" className="btn justify-start" onClick={(e) => {e.preventDefault(); addStep({content: '', completed: false})}}>
                <span className="">Add step +</span> 
            </button>
            </div>
        </div>
    )
}

function StepInput() {
    return (
        <button className="btn justify-start" onClick={() => {}}>
            <span className="">Add step +</span> 
        </button>
    )
}

