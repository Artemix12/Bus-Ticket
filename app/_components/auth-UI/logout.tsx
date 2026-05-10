'use client'
import { authClient } from "@/utils/auth-client"
import {useRouter} from 'next/navigation'
import { Button } from "@/components/ui/button"

export  function LogoutForm(){

    const router = useRouter()

  const logoutHandler =async ()=>{
    await authClient.signOut({
    fetchOptions: {
    onSuccess: () => {
      router.push("/login"); 
    },
    },
});
  }

  return(
    <div>
        <p className="text-4xl text-red-700">Are you sure you want to logout?</p>
    <Button className="text-white" onClick={logoutHandler}>Logout</Button>
    </div>
  )
    
}