import ScanPage from "@/app/_components/scan"

export default async function Page({params}:{
  params:Promise<{id:string}>
}) 
{
  const{id}=await params
 

  return <ScanPage id={id} />
}