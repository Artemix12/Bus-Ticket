import AdminDashboard from "@/app/_components/admin_dashboard_UI/dashboard-admin";
import { auth } from "@/utils/auth"
import{headers} from 'next/headers'
import {redirect} from 'next/navigation'

export const metadata={
  title:{
    absolute:'Admin Dashboard',
  }
}

async function isConnected()
{
   const session = await auth.api.getSession({
    headers: await headers() 
    })

    if(!session || session.user.role!=='admin'){
      return redirect('/login')
    } 
}
export default async function Page() {
  await isConnected()
  return <AdminDashboard />
    
  
  
}