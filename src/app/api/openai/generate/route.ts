import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/authOptions'

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: "Not Authorized" }, { status: 401 })
  
    const task = await request.json()
    if (!task) return Response.json({ error: "task is invalid" }, { status: 400 })
    
    const res = await fetch(`${process.env.FLASK_SERVER_URL || "http://127.0.0.1:5000"}/nicole/generate-steps`, { 
        method: 'POST', 
        headers: {
        'Content-Type': 'application/json'
        },
       body: JSON.stringify(task)
    })

    if (!res.ok) return Response.json({ error: res.text() }, { status: res.status })

    
    const data = await res.json()

    return Response.json(data)
}
