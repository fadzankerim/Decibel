import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import UsersListSkeleton from "@/components/UsersListSkeleton";
import { useChatStore } from "@/stores/useChatStore";

const UsersList = () => {

  const { isLoading, users, selectedUser, setSelectedUser, onlineUsers } = useChatStore();

  return (
    <div className="border-r border-zinc-800">
        <div className="flex flex-col h-full">
          <ScrollArea className="flex flex-col h-[calc(100vh-280px)]">
            <div className="space-y-2 p-4">
              {isLoading? (
                <UsersListSkeleton />
              ) : (
                users.map((user)=>(
                  <div key={user._id} 
                  className={`cursor-pointer hover:bg-zinc-700/50 p-3 rounded-lg transition-colors group
                  flex items-center justify-center lg:justify-start gap-3 ${selectedUser?.clerkId === user.clerkId && "bg-zinc-800/50"}`}
                  onClick={() => setSelectedUser(user)}>

                    <div className="relative">
                      <Avatar className="size-7 md:size-8">
                        <AvatarImage src={user.imageUrl} />
                        <AvatarFallback className="bg-zinc-800/50">{user.fullName}</AvatarFallback>
                      </Avatar>

                      {/* Online indicator */}

                      <div className={`absolute bottom-0 right-0 h-2 w-2 rounded-full ring-2 ring-zinc-900
                      ${onlineUsers.has(user.clerkId) ? "bg-emerald-500" : "bg-zinc-600"}`}/>

                      
                    </div>

                    <div className="hidden md:block flex-1 min-w-0">
                      <span className="font-medium truncate">
                        {user.fullName}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
    </div>
  )
}

export default UsersList