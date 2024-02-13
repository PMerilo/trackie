import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: "Not Authorized" }, { status: 401 })
    
    const res = await fetch(`${process.env.FLASK_SERVER_URL || "http://127.0.0.1:5000"}/yewteck/detect-actions?src=user${session.user.id}`, {
        method: 'GET'
    });
    console.log(res);
    
    if (!res.ok) return Response.json(res.json(), { status: res.status })

    const data = await res.json();
    
    return Response.json(data)
}