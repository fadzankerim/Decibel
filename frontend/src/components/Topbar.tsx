import { SignedOut, SignedIn, SignOutButton, UserButton} from '@clerk/clerk-react'
import { LayoutDashboardIcon, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import SignedInAuthButtons from './SignedInAuthButtons'
import { useAuthStore } from '@/stores/useAuthStore'


const Topbar = () => {


    const {isAdmin} = useAuthStore();

  return(
    <> 
        <div className='flex items-center justify-between p-4 sticky t-0 bg-zinc-900/75 backdrop-blur-md z-10 rounded-lg'>
            <div className='flex items-center gap-2 font-semibold'>
                <img src="/d.png" alt="" className='size-8 rounded-lg shadow-blue-500'/>
                Decibel
            </div>
            <div className='flex items-center gap-4'>
                { isAdmin && 
                ( <Link to="/admin" className='flex items-center bg-zinc-800 rounded-lg p-1 hover:bg-zinc-700'>
                    <LayoutDashboardIcon className='size-4 mr-2'/>Admin Dashboard
                    </Link>)}

                
                <SignedOut>
                    <SignedInAuthButtons />
                </SignedOut>


                <UserButton />

                <SignedIn>
                    <SignOutButton>
                        <LogOut className='cursor-pointer'></LogOut>
                    </SignOutButton>
                </SignedIn>

            </div>
        </div>
    </>

  )
}

export default Topbar