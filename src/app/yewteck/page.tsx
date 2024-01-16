import Image from 'next/image'

export default function Home() {
  return (
    <main>
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="">
            <h1 className="text-5xl font-bold">YewTeck's Page</h1>
            <div className="py-6 grid gap-4">
              <button className="btn btn-primary btn-outline">Login</button>
              <button className="btn btn-secondary btn-outline">Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
