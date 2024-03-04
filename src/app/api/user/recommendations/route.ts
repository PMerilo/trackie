import { authOptions } from '@/lib/authOptions'
import { getServerSession } from "next-auth/next"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "Not Authorized" }, { status: 401 })

  const res = await fetch(`${process.env.FLASK_SERVER_URL || "http://127.0.0.1:5000"}/nicole/user/${session.user.id}/get-recommendations`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const data = await res.json()
  
  return Response.json(data)
}