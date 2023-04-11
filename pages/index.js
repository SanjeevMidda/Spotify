import Sidebar from '../components/Sidebar'
import { Inter } from 'next/font/google'
import Center from '../components/Center'
import { getSession } from 'next-auth/react'
import Player from '../components/Player'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className='bg-black h-screen overflow-hidden'>
      <main className='flex'>
        <Sidebar />
        <Center />
      </main>

      <div className='sticky bottom-0'>
        <Player />
      </div>
    </div>
  )
}

export async function getServerSideProps(context){
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}