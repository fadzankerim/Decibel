import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatStore } from '@/stores/useChatStore';
import { useUser } from '@clerk/clerk-react';
import { Send } from 'lucide-react';
import React, { useState } from 'react'

const MessageInput = () => {

    const [newMessage, setNewMessage] = useState("");
    const { user } = useUser();
    const { sendMessage, selectedUser } = useChatStore();


    const handleSend = () => {
        if(!user || !selectedUser || !newMessage) return;
        sendMessage(user.id, selectedUser.clerkId, newMessage.trim());
        setNewMessage("");
    }

  return (
    <div className='p-4 mt-auto border-t border-zinc-800'>
        <div className='flex gap-2'>
            <Input placeholder='Type a message'
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)}
            className='bg-zinc-800 border-none'
            onKeyDown={(e) => e.key === "Enter" && handleSend()}/>
            <Button
            size={'icon'}
            disabled={!newMessage.trim()}
            className='cursor-pointer bg-emerald-500/70 hover:bg-emerald-400'
            onClick={handleSend}>
                <Send/>
            </Button>
        </div>
    </div>
  )
}

export default MessageInput