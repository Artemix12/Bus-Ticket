import ScanPage from "@/app/_components/scan"

export const metadata =
{
  title:{
    template:'Scan'
  },
  description:"This the scan page"
}
export default async function Page({params}:{
  params:Promise<{id:string}>
}) 
{
  const{id}=await params
 

  return <ScanPage id={id} />
}