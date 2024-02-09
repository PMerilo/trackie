import { prisma } from "@/lib/db"
import { useEffect, useRef, useState } from "react"
import { AddStep, AddTask } from "./add";

function Steps() {
    // const tasks = prisma
    const steps = ["ewa", "dwd", "dwad", "dawd", "dwad", "dwa",]
    return (
        <div className="p-4 flex flex-col gap-y-4">
            <div className="form-control">
            { steps.map(s => 
                <label className="label cursor-pointer justify-start gap-x-4">
                  <input type="checkbox" checked={false} className="checkbox" />
                  <span className="label-text">{s}</span> 
                </label>
            )}
            <AddStep/>
            </div>
        </div>
    )
}

export default function Tasks() {
    // const tasks = prisma
    const tasks = ["ewa", "dwd", "dwad", "dawd", "dwad", "dwa",]
    return (
        <div className="p-4 flex flex-col gap-y-4">
            { tasks.map(t => 
            <>
                <div className="collapse collapse-plus border border-base-300 bg-base-200 ">
                    <input type="checkbox" />
                    <div className="collapse-title font-medium">
                        <p className="text-4xl">{t}</p>
                    </div>
                    <div className="collapse-content"> 
                        <Steps/>
                    </div>
                </div>
            </>
            )}
            <AddTask></AddTask>
        </div>
    )
}