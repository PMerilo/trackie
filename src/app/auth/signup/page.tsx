'use client'

import { useEffect, useState } from "react"
import { onSubmit } from "./actions"
import { useFormState, useFormStatus } from "react-dom"
import { LoginBtn } from "@/app/components/auth"
import Link from "next/link"
import { signIn } from "next-auth/react"

const initialState = {
  message: '',
}

export default function Signup() {
  const [state, formAction] = useFormState(onSubmit, initialState)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(false)
  }, [state])

  return (
    <>
      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body items-center">
          <h2 className="card-title">Sign Up</h2>
          <form className="w-full" id="Register" onSubmit={() => setLoading(true)} action={formAction}>
            <label className="form-control w-full gap-y-4">
              <div>
                <div className="label">
                  <span className="label-text">Name</span>
                </div>
                <input name="name" type="text" placeholder="Type here" className="input input-bordered w-full" required/>
              </div>
              <div>
                <div className="label">
                  <span className="label-text">Email</span>
                </div>
                <input name="email" type="email" placeholder="Type here" className="input input-bordered w-full" required/>
              </div>
              <div>
                <div className="label">
                  <span className="label-text">Password</span>
                </div>
                <input name="password" type="password" placeholder="Type here" className="input input-bordered w-full" required/>
              </div>
              <div>
                <div className="label">
                  <span className="label-text">Confirm Password</span>
                </div>
                <input name="confirmPassword" type="password" placeholder="Type here" className="input input-bordered w-full" required/>
              </div>
            </label>
          </form>
          { state?.message &&
            <div role="alert" className="alert alert-error mt-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{state?.message}</span>
            </div>
          }
          <div className="card-actions justify-end w-full mt-6">
            <button className="btn btn-primary btn-block" type="submit" form="Register" >
              {loading ? <span className="loading loading-dots loading-sm"></span> : "Sign In"}
            </button>
            <p className="mt-2">Already have an account? <Link className="link text-blue-500" href="/auth/login">Log In</Link></p>
          </div>
        </div>
      </div>
    </>
  )
}
