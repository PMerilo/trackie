'use client'

export function AddTask() {
    return (
        <div className="card w-full glass hover:animate-pulse cursor-pointer" onClick={() => {}}>
            <div className="card-body items-center text-center">
                <h1 className="card-title">Add new task +</h1>
            </div>
        </div>
    )
}

export function AddStep() {
    return (
        <button className="btn justify-start" onClick={() => {}}>
            <span className="">Add step +</span> 
        </button>
    )
}