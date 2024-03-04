import { authOptions } from '@/lib/authOptions'
import { getServerSession } from "next-auth/next"

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "Not Authorized" }, { status: 401 })

  const { src } = await request.json()
  if (!src) return Response.json({ error: "src is required" }, { status: 400 })


  const res = await fetch(`${process.env.RTSP_SERVER_URL || "http://127.0.0.1:1984"}/api/streams?` + new URLSearchParams({
    src,
    name: `user${session.user.id}`
  }), {
    method: 'put'
  })
  
  if (!res.ok) return Response.json({ error: "server might be down" }, { status: 500 })
  
  return Response.json("Success")
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "Not Authorized" }, { status: 401 })

  const { src } = await request.json()
  if (!src) return Response.json({ error: "src is required" }, { status: 400 })

  
  const res = await fetch(`${process.env.RTSP_SERVER_URL || "http://127.0.0.1:1984"}/api/streams?` + new URLSearchParams({
    src,
    name: `user${session.user.id}`
  }), {
    method: 'PATCH'
  })
  console.log(res);
  
  if (res.status == 400) return Response.json({ error: "Invalid src value" }, { status: 400 })
  if (!res.ok) return Response.json({ error: "server might be down" }, { status: 500 })
  
  return Response.json("Success")
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "Not Authorized" }, { status: 401 })

  const res = await fetch(`${process.env.RTSP_SERVER_URL || "http://127.0.0.1:1984"}/api/streams?` + new URLSearchParams({
    src: `user${session.user.id}`
  }), {
    method: 'delete'
  })

  if (!res.ok) return Response.json({ error: "server might be down" }, { status: 500 })
  
  return Response.json("Success")
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "Not Authorized" }, { status: 401 })

  const res = await fetch(`${process.env.RTSP_SERVER_URL || "http://127.0.0.1:1984"}/api/streams`)

  if (!res.ok) return Response.json({ error: "server might be down" }, { status: 500 })
  const data = await res.json();
  
  try {
    return Response.json(data[`user${session.user.id}`]["producers"][0]["url"])
  } catch (error) {
    return Response.json("")
  }

}