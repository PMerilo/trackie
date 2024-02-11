'use server'

import { prisma } from "@/lib/db"
import { Prisma } from "@prisma/client"
import { compare, hash } from "bcrypt"
import { redirect } from 'next/navigation'

type NewUser = {
  name: string,
  email: string,
  password: string,
  confirmPassword: string
}

type Response = {
  user?: NewUser,
  message?: string
}

export async function onSubmit(prevState: any, formData: FormData) {
    let response = { message: "" }
    const rawFormData = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    }

    if (!rawFormData.email || !rawFormData.name || !rawFormData.password|| !rawFormData.confirmPassword) return { ...response, message: "Invalid form" }
  
    const newuser : NewUser = {
      name : rawFormData.name!.toString(),
      email : rawFormData.email!.toString(),
      password : rawFormData.password!.toString(),
      confirmPassword : rawFormData.confirmPassword!.toString()
    }
    
    
    const PW = await hash(newuser.password, 11)
    const cPW = await hash(newuser.confirmPassword, 11)
    const pwInvalid = await compare(
      newuser.password,
      cPW
    )
    if (!pwInvalid) return { ...response, message: "Passwords are not the same" }
    
    const userExists = await prisma.user.findUnique({
        where: {
          email: newuser.email
        }
    })
    if (userExists) return { ...response, message: "User already exists" }
  
  
    let user: Prisma.UserCreateInput
    user = {
        email: newuser.email,
        password: PW,
        name: newuser.name
    }
    
    const createUser = await prisma.user.create({ data: user })
    if (createUser) redirect("signup/quiz")
    return {...response, user: createUser}
  }