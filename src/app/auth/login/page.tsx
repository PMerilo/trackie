'use client'

import { SignUpBtn } from "@/app/components/auth";
import { signIn } from "next-auth/react"
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useState } from "react";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      setFormValues({ email: "", password: "" });

      const res = await signIn("credentials", {
        redirect: false,
        email: formValues.email,
        password: formValues.password,
        callbackUrl,
      });

      setLoading(false);
      if (!res?.error) {        
        router.push(callbackUrl);
      } else {
        setError("invalid email or password");
      }
    } catch (error: any) {
      setLoading(false);
      setError(error);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <>
      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body items-center">
          <h2 className="card-title">Log In</h2>
          <form className="w-full" method="post" onSubmit={onSubmit} id="Login">
            <label className="form-control w-full gap-y-4">
              <div>
                <div className="label">
                  <span className="label-text">Email</span>
                </div>
                <input name="email" type="email" placeholder="Type here" className="input input-bordered w-full" onChange={handleChange} required value={formValues.email}/>
              </div>
              <div>
                <div className="label">
                  <span className="label-text">Password</span>
                </div>
                <input name="password" type="password" placeholder="Type here" className="input input-bordered w-full" onChange={handleChange} required value={formValues.password}/>
              </div>
            </label>
          </form>
          { error &&
            <div role="alert" className="alert alert-error mt-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          }
          <div className="card-actions w-full mt-6">
            <button className="btn btn-primary btn-block" type="submit" form="Login">{loading ? <span className="loading loading-dots loading-sm"></span> : "Sign In"}</button>
            <p className="mt-2">Don&apos;t have an account? <Link className="link text-blue-500" href="/auth/signup">Sign Up</Link></p>
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