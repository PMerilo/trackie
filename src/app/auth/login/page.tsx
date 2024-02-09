'use client'

import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next"
import { getCsrfToken } from "next-auth/react"

export default function Login() {
  return (
    <>
      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body items-center">
          <h2 className="card-title">Sign Up</h2>
          <form className="w-full" method="post" action="/api/auth/callback/credentials">
            <input name="csrfToken" type="hidden" defaultValue={''} />
            <label className="form-control w-full gap-y-4">
              <div>
                <div className="label">
                  <span className="label-text">Email</span>
                </div>
                <input type="text" placeholder="Type here" className="input input-bordered w-full" />
              </div>
              <div>
                <div className="label">
                  <span className="label-text">Password</span>
                </div>
                <input type="password" placeholder="Type here" className="input input-bordered w-full" />
              </div>
            </label>
          </form>
          <div className="card-actions justify-end w-full mt-6">
            <button className="btn btn-primary btn-block" type="submit">Sign In</button>
          </div>
        </div>
      </div>
    </>
  )
}

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   return {
//     props: {
//       csrfToken: await getCsrfToken(context),
//     },
//   }
// }