import { isAuthenticated } from '@/lib/actions/auth.action'
import LogoutButton from '@/components/LogoutButton'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

const HomePage = async ({children}:{children:ReactNode}) => {
    const isUserAuthenticated = await isAuthenticated();

    if (!isUserAuthenticated) {
      redirect('/sign-in')
    }
  return (
    <div className='root-layout'>
        <nav className='flex items-center justify-between px-4 py-3'>
            <Link href="/" className='flex items-center gap-2'>
                    <Image src="/logo.svg"
                     alt='logo'
                     width={38}
                     height={32}
                     />
                     <h2 className='text-primary-100'>InterviewPrep</h2>
            </Link>
            <LogoutButton />
        </nav>
        {children}
    </div>
  )
}

export default HomePage