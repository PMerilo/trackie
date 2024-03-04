import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/authOptions'

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: "Not Authorized" }, { status: 401 })
  
    const res = await fetch(`${process.env.FLASK_SERVER_URL || "http://127.0.0.1:5000"}/perry/user/${session.user.id}/get-transcripts`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const data = await res.json()
    console.log(data);
    
    return Response.json(data)
}