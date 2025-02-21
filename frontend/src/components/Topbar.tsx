import { SignedOut, SignedIn, SignOutButton} from '@clerk/clerk-react'
import { LogOut, ShieldCheckIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import SignedInAuthButtons from './SignedInAuthButtons'

const Topbar = () => {


    const isAdmin = false

  return(
    <> 
        <div className='flex items-center justify-between p-4 sticky t-0 bg-zinc-900/75 backdrop-blur-md z-10 rounded-lg'>
            <div className='flex items-center gap-2'>
                Decibel
            </div>
            <div className='flex items-center gap-4'>
                <ShieldCheckIcon className='size-7 mr-2'/>
                { isAdmin && 
                ( <Link to="/admin">Admin Dashboard</Link>)}

                <SignedOut>
                    <SignedInAuthButtons />
                </SignedOut>

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