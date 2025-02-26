import { UserButton } from "@clerk/clerk-react"
import { Link } from "react-router-dom"


const Header = () => {
  return (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 mb-8">
          <Link to='/' className="rounded-lg">
            <img src="d.png" alt="" className='size-13 text-black rounded-lg'/>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Music Manager</h1>
            <p className="text-zinc-400 mt-1">Manage your music catalog</p>
          </div>
        </div>
        <div className="relative top-[-25px] right-1 ">
          <UserButton />
        </div>
    </div>
  )
}

export default Header