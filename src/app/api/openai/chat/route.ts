import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/authOptions'

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: "Not Authorized" }, { status: 401 })
    
    const body = await request.json()
    const res = await fetch(`${process.env.FLASK_SERVER_URL || "http://127.0.0.1:5000"}/yewteck/chat`, { 
        method: 'POST', 
        headers: {
            "Content-Type": "application/json",
        },
       body: JSON.stringify(body)
    })
    const data = await res.json()
    
    if (!res.ok) return Response.json(res.json(), { status: res.status })

    
    return Response.json(data.choices[0].message)
}
