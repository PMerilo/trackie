import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from 'next-auth/providers/credentials'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import { compare } from "bcrypt"
import { prisma } from "@/lib/db"
import { User } from "@prisma/client"

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
      GithubProvider({
        clientId: process.env.GITHUB_ID || "",
        clientSecret: process.env.GITHUB_SECRET || "",
      }),
      CredentialsProvider({
        // The name to display on the sign in form (e.g. "Sign in with...")
        name: "Credentials",
        // `credentials` is used to generate a form on the sign in page.
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
          email: { label: "Email", type: "text", placeholder: "example@trackie.io" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
          if (!credentials?.email || !credentials?.password) return null
          const user = await prisma?.user.findUnique({
            where: {
              email: credentials.email
            }
          })
          if (!user) return null
          const pwInvalid = compare(
            credentials.password,
            user.password
          )
          if (!pwInvalid) return null
          return {
            id : user.id + "",
            email: user.email,
            name: user.name
          }
        }
      })
    ],
    callbacks: {
      session: ({ session, token }) => {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.id
          }
        }
      },
      jwt: ({ token, user }) => {
        // const u = user as unknown as User
        if (user) {
          return {
            ...token, 
            id: user.id
          }
        }
        return token
      }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }