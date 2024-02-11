import { FormEvent, useState } from "react"
import { StepInput } from "../api/user/step/route"
import TaskStep from "./TaskStep"
import { Activity, TaskWithSteps } from "./TaskDrawer"
import { Prisma } from "@prisma/client"

export default function TaskAddCustom({ defaultTitle, activityHandler, onAdd } : { defaultTitle:string, activityHandler: Function, onAdd: Function }) {
    const [title, setNewTitle] = useState(defaultTitle)
    const [time, setNewTime] = useState((new Date().toISOString()).split('.')[0])
    const [steps, setSteps] = useState<StepInput[]>([])

    function taskApi(task: object) {
        console.log(task)
        return fetch(`/api/user/task`, {
            method: "put",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task })
        }) 
    }

    function addTask(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        taskApi({ title, time, steps })
        .then(res => res.json()
        .then((newTask: TaskWithSteps) => {
            setSteps([])
            setNewTime((new Date().toISOString()).split('.')[0])
            setNewTitle('')
            activityHandler(Activity.List)
            if (onAdd) onAdd(newTask)
        }))
        .catch(e => console.log(e))
    }

    const addStep = () => {
        setSteps([ ...steps, { content: '', completed: false }])
    }
    const updateStep = (index: number, step: StepInput) => {
        setSteps(steps.map( (s, i) => {
            return i == index ? step : s
        }))
    }
    const delStep = (index: number) => {
        setSteps(steps.filter((s, i) => index != i))
    }

    return (
        <div className="items-center">
            <h2 className="text-4xl mx-auto">Add Task</h2>
            <form className="w-full" method="post" onSubmit={(e) => addTask(e)} id="AddTask">
                <label className="form-control w-full gap-y-4">
                    <div>
                        <div className="label">
                            <span className="label-text" aria-required>Title</span>
                        </div>
                        <input type="text" placeholder="Type here" className="input input-bordered w-full" value={title} onChange={(e) => setNewTitle(e.target.value)} required/>
                    </div>
                    <div>
                        <div className="label">
                            <span className="label-text">Time</span>
                        </div>
                        <input type="datetime-local" placeholder="Type here" className="input input-bordered w-full" value={time} onChange={(e) => setNewTime(e.target.value)} required/>
                    </div>
                </label>
                {/* <StepsList steps={arr} onChange={newStepHandler}></StepsList> */}
                { steps.map((s, i) => <TaskStep checked={s.completed} value={s.content} onChange={updateStep} onDelete={delStep} index={i} key={i}/>)}
            </form>
            <button role="button" className="btn btn-block justify-start mt-2" onClick={addStep}>
                Add step +
            </button>
            <div className="card-actions justify-end w-full mt-6">
                <button className="btn btn-primary btn-block" type="submit" form="AddTask">Add Task</button>
                <button className="btn btn-error btn-block" onClick={() => activityHandler(Activity.Add)}>Cancel</button>
            </div>
        </div> 
    )
}