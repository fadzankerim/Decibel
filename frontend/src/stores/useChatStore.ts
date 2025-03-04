import { axiosInstance } from "@/lib/axios";
import { Message } from "@/types";
import { create } from "zustand";
import { io } from "socket.io-client";
import { User } from "@/types";


interface ChatStore {
    selectedUser: User | null;
    users: User[];
    isLoading: boolean;
    error: string | null;
    socket: any;
    isConnected: boolean;
    onlineUsers: Set<string>;
    userActivities: Map<string, string>;
    messages: Message[];
    fetchUsers: () => Promise<void>;
    initSocket: (userId: string) => void;
    disconnectSocket: () => void;
    sendMessage: (senderId: string, receiverId: string, content: string) => void;
    fetchMessages: (userId: string) => Promise<void>;
    setSelectedUser: (user: User | null) => void;
}

const baseURL = import.meta.env.MODE === 'development' ? 'http://localhost:5005' : '/';

const socket = io(baseURL,{
    autoConnect: false, // only connect if user is authenticated
    withCredentials: true
});

export const useChatStore = create<ChatStore>((set, get) => ({
    users: [],
    isLoading: false,
    error: null,
    socket: socket,
    isConnected: false,
    onlineUsers: new Set(),
    userActivities: new Map(),
    messages: [],
    selectedUser: null,

    setSelectedUser: (user) => set({selectedUser: user}),


    fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try{
            const response = await axiosInstance.get('/users');
            set({users: response.data});
        }catch(error: any){
            set({error: error.response.data.message});
        }finally{
            set({isLoading: false});
        }
    },

    initSocket: async(userId: string) => {
        if(!get().isConnected){
            socket.auth = {userId};
            socket.connect();
            socket.emit("user_connected", userId);

            socket.on("users_online", (users: string[]) => {
                set({onlineUsers: new Set(users)});
            })

            socket.on('activities', (activities: [string, string][]) => {
                set({userActivities: new Map(activities)});
            })

            socket.on('users_online', (userId: string) => {
                set((state) => ({
                    onlineUsers: new Set([...state.onlineUsers, userId])
                }))
            })

            socket.on('receive_message', (message: Message) => {
                set((state) => ({
                    messages: [...state.messages, message]
                }))
            })

            socket.on('message_sent', (message: Message) => {
                set((state) => ({
                    messages: [...state.messages, message]
                }))
            })

            socket.on('activity_updated', ({userId, activity}) => {
                set((state) => {
                    const newActivities = new Map(state.userActivities);
                    newActivities.set(userId, activity);
                    return {userActivities: newActivities};
                })
            })

            set({isConnected: true});

            
        }
    },

    disconnectSocket: () => {

        if(get().isConnected){
            socket.disconnect();
            set({isConnected: false});
        }
    },

    sendMessage: async (senderId: string, receiverId: string, content: string) => {
        const socket = get().socket;
        if(!socket) return;

        socket.emit('send_message', {senderId, receiverId, content});
    },

    fetchMessages: async (userId: string) => {
        set({isLoading: true, error: null});
        try {
            const response = await axiosInstance.get(`/users/messages/${userId}`);
            set({messages: response.data});
        } catch (error: any) {
            set({error: error.response.data.message});
        }finally{
            set({isLoading: false});
        }
    }
}))