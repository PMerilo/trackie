"use client";

import { useState } from "react";
import { StepInput } from "../api/user/step/route";
import { Prisma, Step } from "@prisma/client";
import TaskStep from "@/app/components/TaskStep";
import { TaskWithSteps } from "./TaskDrawer";

export default function TaskCard({ task, onDelete }: { task: TaskWithSteps, onDelete: Function }) {
  const [steps, setSteps] = useState<StepInput[]>(task.steps);

  function stepApi(method: string, step: object) {
    return fetch(`/api/user/step`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ step }),
    });
  }

  function addStep() {
    setSteps([...steps, { content: "", completed: false, taskId: task.id }]);

    stepApi("put", { content: "", completed: false, taskId: task.id }).then(
      (res) => {
        res.json().then((newStep) => {
          setSteps((steps) =>
            steps.map((s, i) =>
              i == steps.length - 1 ? { ...s, id: newStep.id } : s
            )
          );
        });
      }
    );
  }

  function updateStep(index: number, step: StepInput) {
    const id = steps[index].id;
    stepApi("post", { ...step, id }).then(() => {
      setSteps(
        steps.map((s) => {
          return s.id == id ? { ...step, id } : s;
        })
      );
    });
  }

  function delStep(index: number) {
    const id = steps[index].id;
    setSteps(steps.filter((s) => id != s.id));
    stepApi("delete", { id: id });
  }
  var moment = require("moment");

  return (
    <div className="collapse collapse-plus border border-base-300 bg-base-200 ">
      <input type="checkbox" />
      <div className="collapse-title font-medium">
        <span className="text-4xl">{task.title}</span>
      </div>
      <div className="collapse-content">
        <div className="mt-6 flex flex-col gap-y-4">
        <span className="text-xl">
          {moment(task.time).utcOffset(0).format("DD/MM/YYYY hh:mma")}
        </span>
          <div className="form-control">
            {steps.map((s, i) => (
              <TaskStep
                checked={s.completed}
                value={s.content}
                onBlur={updateStep}
                onDelete={delStep}
                index={i}
                key={i}
              />
            ))}
            <button
              role="button"
              className="btn btn-block justify-start"
              onClick={addStep}
            >
              Add step +
            </button>
          </div>
          <div className="flex justify-end gap-x-4">
            <button
              className="btn bg-slate-500"
              onClick={() => console.log("test")}
            >
              Edit
            </button>
            <button className="btn btn-error" onClick={() => onDelete()}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}
