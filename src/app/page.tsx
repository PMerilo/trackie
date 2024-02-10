import { getServerSession } from 'next-auth/next'
import { Session } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { authOptions } from './api/auth/[...nextauth]/route'
import { LoginBtn, LogoutBtn } from './components/auth'
import TaskDrawer from './tasks/list'
import { prisma } from '@/lib/db'

const fetchTasks = async (userId : number) => {
  const tasks = await prisma.task.findMany({
    where: {
      creatorId: userId
    },
    include : { steps: true }
  })
  return tasks
}

export default async function Home() {
  const session = await getServerSession(authOptions)

  const LoggedIn = async ({ session } : {session : Session}) => {
    const tasks = await fetchTasks(parseInt(session.user.id))
    return (
      <>
        <TaskDrawer tasks={tasks} userId={session.user.id}/>
        <LogoutBtn/>
      </>
    )
  }
  return (
    <main>
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="">
            { session ? 
            <h1 className="text-5xl font-bold">
              Good morning, {session.user.name}. Today is {new Date().toLocaleDateString('en-sg', { month: 'long', day: '2-digit' })}, what would you like to do today?
            </h1>
            :
            <h1 className="text-5xl font-bold">Welcome to Trackie</h1>
            }
            <div className="py-6 grid gap-4">
              { session ?
                <LoggedIn session={session}/>
                :
              <>
                <LoginBtn/>
                <Link className="btn btn-secondary btn-outline" href="/auth/signup">Sign Up</Link>
              </>
              }
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
