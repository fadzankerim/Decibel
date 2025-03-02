import Topbar from "@/components/Topbar";
import { useChatStore } from "@/stores/useChatStore"
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import UsersList from "./components/UsersList";
import ChatHeader from "./components/ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import MessageInput from "./components/MessageInput";

const ChatPage = () => {

  const { user } = useUser();
  const { messages, selectedUser, fetchUsers, fetchMessages } = useChatStore();

  //if the user is authenticated then fetch the users, if possible :)
  useEffect(() => {
    if(user) fetchUsers();
  },[fetchUsers, user]);

  // if a user is selected in the chat page try to fetch all linked messages with the user
  useEffect(() => {
    if(selectedUser) fetchMessages(selectedUser.clerkId);
  },[selectedUser, fetchMessages]);

  return (
    <main className="h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden">
      <Topbar/>

      <div className="grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)]">
        <UsersList/>

        {/* Chat messages */}
        <div className="flex flex-col h-full">
          {selectedUser? (
            <>
              <ChatHeader/>

              {/* Messages */}
              <ScrollArea className="h-[calc(100vh-340px)]">
                <div className="p-4 space-y-4">
                  {messages.map((message)=>(
                    <div key={message._id}
                    className={`flex items-start gap-3 ${message.senderId === user?.id ? "flex-row-reverse" : ""}`}>
                      <Avatar className="size-7 md:size-8">
                        <AvatarImage src={
                          message.senderId === user?.id ? user.imageUrl : selectedUser.imageUrl
                        } className="rounded-full"/>
                      </Avatar>

                      <div className={`rounded-lg p-3 max-w-[70%] ${message.senderId === user?.id ? "bg-emerald-600/50" : "bg-zinc-700/50"} text-white`}>
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs text-zinc-300 mt-1 block">
                          {message.createdAt.split("T")[1].slice(0,5)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <MessageInput/>
            </>
          ):
          (
            <NoConversationPlaceholder/>
          )}
        </div>
      </div>
    </main>
  )
}

export default ChatPage



const NoConversationPlaceholder = () =>{
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <img src="/d.png" alt="Decibel" className="size-16 animate-bounce rounded-2xl"/>
      <div className="text-center">
        <h3 className="text-zinc-300 text-lg font-medium mb-1">
          Select a chat or start a new conversation
        </h3>
        <p className="text-zinc-500 text-sm">Choose a friend to chat with</p>
      </div>
    </div>
  )
}