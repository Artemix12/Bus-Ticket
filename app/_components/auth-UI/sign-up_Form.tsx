'use client'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {useState} from 'react'
import{redirect} from 'next/navigation'
import {authClient} from '@/utils/auth-client'
import * as Sentry from "@sentry/nextjs";

export function CardDemo() {

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  const[username,setUsername]=useState('')
  const[email,setEmail] = useState('')
  const[password,setPassword] = useState('')
  const[errorMessage,setErrorMessage]= useState<string|undefined>('')



   async function signUp(e:React.SubmitEvent<HTMLFormElement>)
   {
  
    try 
    {
      e.preventDefault()
     if(!passwordRegex.test(password)){
      setErrorMessage('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number.')
     }
     const { data, error } = await authClient.signUp.email({
      name:username,
      email:email,
      password:password,
      
     })

     if(error){
      setErrorMessage(error.message)
     }

    if(data){
    setUsername('')
    setPassword('')
    setEmail('')
    redirect('/login')
     
    }
    } catch (error) 
    {
    Sentry.captureException(error, {tags: {section: "sign-up-form",component: "signUp"}})
    Sentry.logger.error("Failed to sign up with email", {endpoint: "authClient.signUp.email"})
    }

   }

    const signUpWithGoogle = async () => {
     try 
     {
        await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard", 
      });
     } catch (error) {
      Sentry.captureException(error, {tags: {section: "sign-up-form",component: "signUpWithGoogle"}})
      Sentry.logger.error("Failed to sign up with Google", {endpoint: "authClient.signUp.social"})
     }
    };



  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0d1117]">
      <Card className="w-full max-w-sm border border-white/[0.07] bg-white/[0.03] text-white shadow-none">

        <CardHeader>
          <Link href="/" className="text-xl font-bold tracking-tight text-white mb-1 block">
            Bus<span className="text-sky-400">Ticket</span>
          </Link>
          <CardTitle className="text-base font-semibold text-white">
            Create your account
          </CardTitle>
          <CardDescription className="text-sm text-slate-400">
            Fill in the details below to get started
          </CardDescription>
          <CardAction>
            <Link href="/login">
              <Button variant="link" className="text-sky-400 hover:cursor-pointer hover:text-sky-300 px-0 text-sm">
                Sign In
              </Button>
            </Link>
          </CardAction>
        </CardHeader>

        <CardContent>
          <form onSubmit={signUp}>
            <div className="flex flex-col gap-5">

              <div className="grid gap-1.5">
                <Label htmlFor="email" className="text-sm text-slate-300">Username</Label>
                <Input
                  id="text"
                  type="text"
                  placeholder="Jhon Doe"
                  required
                  className="border-white/[0.08] bg-white/[0.04] text-white placeholder:text-slate-600 focus-visible:ring-sky-500/40"
                  value={username}
                  onChange={e=>setUsername(e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="email" className="text-sm text-slate-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="border-white/[0.08] bg-white/[0.04] text-white placeholder:text-slate-600 focus-visible:ring-sky-500/40"
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="password" className="text-sm text-slate-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  className="border-white/[0.08] bg-white/[0.04] text-white placeholder:text-slate-600 focus-visible:ring-sky-500/40"
                />
              </div>
              <p className="text-sm text-gray-500">
              Password must contain at least 8 characters, including one uppercase letter,one lowercase letter, and one number.
            </p>

            </div>
               <Button
            type="submit"
            className="w-full bg-sky-900 font-semibold text-sky-100 shadow-none hover:cursor-pointer transition hover:bg-sky-800 hover:text-white"
          >
            Create account
          </Button>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-3">

       

          <div className="flex w-full items-center gap-3">
            <div className="h-px flex-1 bg-sky-900/30" />
            <span className="text-xs text-slate-600">or</span>
            <div className="h-px flex-1 bg-sky-900/30" />
          </div>

          <Button
            onClick={()=>signUpWithGoogle()}
            variant="outline"
            className="w-full border-color: color-mix(in oklab, var(--color-white)  background-color: color-mix(in oklab, var(--color-white) hover:cursor-pointer text-slate-300 shadow-none transition hover:bg-white/[0.07] hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          <p className='text-red-600 py-0 font-semibold'>{errorMessage}</p>

          <p className="mt-1 text-center text-xs text-slate-600">
            By signing up you agree to our{" "}
            <Link href="#" className="underline underline-offset-2 transition hover:text-slate-400">Terms</Link>
            {" "}and{" "}
            <Link href="#" className="underline underline-offset-2 transition hover:text-slate-400">Privacy Policy</Link>.
          </p>

        </CardFooter>
      </Card>
    </div>
  )
}