import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth/next"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "Not Authorized" }, { status: 401 })

  const { state, model } = await request.json()
  if (!state) return Response.json({ error: "state is invalid" }, { status: 400 })
  if (!model) return Response.json({ error: "model is invalid" }, { status: 400 })
  console.log({ state, model });
  
  const res = await fetch(`${process.env.FLASK_SERVER_URL || "http://127.0.0.1:5000"}/perry/${state == "true" ? "start" : "stop"}?model=${model}&src=user${session.user.id}`, {
    method: "post",
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const data = await res.text()
  
  return Response.json(data)
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "Not Authorized" }, { status: 401 })

  const res = await fetch(`${process.env.FLASK_SERVER_URL || "http://127.0.0.1:5000"}/perry/state`, {
    method: "get",
    headers: {
      'Content-Type': 'application/json'
    }
  })
  
  const data = await res.json()
  
  return Response.json(data)
}

