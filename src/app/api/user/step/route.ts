import { authOptions } from '@/lib/authOptions'
import { prisma } from "@/lib/db"
import { Prisma } from "@prisma/client"
import { getServerSession } from "next-auth/next"

export type StepInput = {
    id?: number, 
    content: string, 
    completed: boolean, 
    taskId?: number
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "Not Authorized" }, { status: 401 })

  let step: Prisma.StepCreateInput

  const body = await request.json()
  const s: StepInput = body["step"]

  if (!s) return Response.json({ error: "step is undefined" }, { status: 400 })

  step = {
    content: s.content,
    completed: s.completed,
    task: {
      connect: { id:  s.taskId }
    }
  }

  const createStep = await prisma.step.create({ data: step })
  
  return Response.json(createStep)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "Not Authorized" }, { status: 401 })

  let step: Prisma.StepUpdateInput

  const body = await request.json()
  const s: StepInput = body["step"]

  if (!s) return Response.json({ error: "step is undefined" }, { status: 400 })

  step = {
    content: s.content,
    completed: s.completed
  }

  const updateStep = await prisma.step.update({
    where: { 
     id: s.id
   }, 
   data: step 
 })
  
  return Response.json(updateStep)
}
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "Not Authorized" }, { status: 401 })

  const body = await request.json()
  const id: number= body["step"]["id"]

  if (!id) return Response.json({ error: "id is undefined" }, { status: 400 })

  const deleteStep = await prisma.step.delete({
    where: {
      id: id,
    },
  })
  
  return Response.json(deleteStep)
}