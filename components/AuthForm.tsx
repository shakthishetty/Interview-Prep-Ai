"use client"

import { Button } from "@/components/ui/button"
import {
  Form
} from "@/components/ui/form"
import { auth } from "@/firebase/client"
import { signIn, signUp } from "@/lib/actions/auth.action"
import { zodResolver } from "@hookform/resolvers/zod"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import FormField from "./FormFeild"


const AuthFormSchema = (type: FormType) => {
    return z.object({
      name: type === 'sign-up' ? z.string().min(2).max(100) : z.string().optional(),
      email: z.string().min(2).max(100).email(),
      password: z.string().min(8).max(100),
    })
}

const AuthForm = ({ type }: {type:FormType}) => {
  const router = useRouter()
  const formSchema = AuthFormSchema(type)
   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
     try{
 if(type === 'sign-up') {
       const {name,email,password} = values;
         const useCredential = await createUserWithEmailAndPassword(
           auth,
           email,
           password
         )
         const result = await signUp({
           uid: useCredential.user.uid,
           name: name!,
           email,
           password
         })
         if(!result?.success) {
           toast.error(result?.message)
           return;
         }
      
        toast.success("Account created successfully!")
        router.push('/sign-in')
      } else {
        const {email,password} = values;
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const idToken = await userCredential.user.getIdToken();
          if(!idToken) {
            toast.error("Sign in failed. Please try again.")
            return
          }
          await signIn({
            email,
            idToken
          })
        toast.success("Signed in successfully!")
        router.push('/')
      }
     } catch (error) {
       toast.error("Something went wrong.")
     }
     

  }

  const isSignIn = type === "sign-in"


  return (
      <div className="card-border">
         <div className="flex flex-col gap-6 card py-14 px-10 max-w-lg">
           <div className="flex flex-row justify-center gap-2">
             <Image 
               src="/logo.svg"
               alt="Logo"
               width={38}
               height={32}
             />
             <h2 className="text-primary-100">InterviewPrep</h2>
           </div>
            <h3 className="text-center">Ai Powered Interview Preparation with Feedback</h3>

     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full form">
           {!isSignIn && (
             <FormField
               name="name"
               control={form.control}
               placeholder="Enter your name"
               label="Name"
               type="text"
             />
           )}
            <FormField
               name="email"
               control={form.control}
               placeholder="Enter your email"
               label="Email"
               type="email"
             />
            <FormField
               name="password"
               control={form.control}
               placeholder="Enter your password"
               label="Password"
               type="password"
             />
           

        <Button type="submit" className="btn">{isSignIn ? 'Sign In': 'Create an Account'}</Button>
      </form>
       <p className="text-center">{isSignIn ? 'Create an Account?' : 'Already have an account?'}
        <Link href={isSignIn ? '/sign-up' : '/sign-in'} className="ml-1">
          {isSignIn ? 'Sign Up' : 'Sign In'}
          </Link>
       </p>
    </Form>
        </div>
      </div>
  )
}

export default AuthForm
