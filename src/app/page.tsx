import { getServerSession } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { authOptions } from './api/auth/[...nextauth]/route'
import { LoginBtn, LogoutBtn } from './components/auth'

export default async function Home() {
  const session = await getServerSession(authOptions)
  return (
    <main>
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="">
            <h1 className="text-5xl font-bold">Welcome to Trackie {session?.user?.name} {JSON.stringify(session)}</h1>
            <div className="py-6 grid gap-4">
              { session ?
                <LogoutBtn/>
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
