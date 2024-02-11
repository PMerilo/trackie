'use client'

import { StepInput } from "@/app/api/user/step/route"
import { ChangeEvent, Key, useState } from "react"

export default function TaskStep({ checked, value, onChange, onDelete, onBlur, index} : { checked: boolean, value: string, onDelete:Function, onChange?: Function, onBlur?:Function, index: number}) {
    const [completed, setCompleted] = useState(checked)
    const [content, setContent] = useState(value)

    function onToggleCheckbox(e: ChangeEvent<HTMLInputElement>) {
        setCompleted(e.target.checked)
        if (onChange) onChange( index, { content, completed: e.target.checked } )
    }
    function onInput(e: ChangeEvent<HTMLInputElement>) {
        setContent(e.target.value)
        if (onChange) onChange( index, { content: e.target.value, completed } )
    }

    return (
        <label className="label cursor-pointer justify-start gap-x-4" key={index}>
            <input type="checkbox" checked={completed} className="checkbox" onChange={onToggleCheckbox}/>
            <input type="text" className="btn text-start grow" placeholder={`Step ${(index || 0) +1}`} value={content} onChange={onInput} onBlur={(e) => {if (onBlur) onBlur(index, { content: e.target.value, completed })}} required/> 
            <button className="btn btn-error btn-outline" onClick={() => onDelete(index)}>D</button> 
        </label>
    )
}
