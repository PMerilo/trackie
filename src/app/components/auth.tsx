'use client'

import { signIn, signOut } from "next-auth/react"
import Link from "next/link"

export const LoginBtn = () => <button className="btn btn-primary btn-outline" onClick={() => signIn()}>Log in</button>
export const LogoutBtn = () => <button className="btn btn-secondary btn-outline" onClick={() => signOut()}>Log Out</button>
export const SignUpBtn = () => <Link className="btn btn-secondary btn-outline" href="/auth/signup">Sign Up</Link>