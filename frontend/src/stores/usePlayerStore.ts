import { create } from "zustand";
import { Song } from "@/types";
import { useChatStore } from "./useChatStore";


interface PlayerStore{
    currentSong: Song | null;
    isPlaying: boolean;
    queue: Song[];
    currentIndex: number;

    initializeQueue: (songs: Song[]) => void;
    playAlbum: (songs: Song[], startIndex?: number) => void;
    setCurrentSong: (song: Song | null) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrevious: () => void;

}


export const usePlayerStore = create<PlayerStore>((set, get) => ({
    currentSong: null,
    isPlaying: false,
    queue: [],
    currentIndex: -1,

    initializeQueue: (songs: Song[]) => {
        set({
            queue: songs,
            currentSong: get().currentSong || songs[0],
            currentIndex: get().currentIndex === -1? 0 : get().currentIndex
        })
    },

    playAlbum: (songs: Song[], startIndex = 0) => {
        if(songs.length === 0) return;

        const song = songs[startIndex];

        const socket = useChatStore.getState().socket;
        
        if(socket.auth){
            socket.emit("update_activity", 
                {userId: socket.auth.userId, activity: `Listening to ${song.title} by ${song.artist}`}
            );
        }

        set({
            currentSong: song,
            isPlaying: true,
            queue: songs,
            currentIndex: startIndex
        })
    },

    setCurrentSong: (song: Song | null) => {
        if(!song) return;

        const songIndex = get().queue.findIndex((s) => s._id === song._id);

        const socket = useChatStore.getState().socket;
        
        if(socket.auth){
            socket.emit("update_activity", 
                {userId: socket.auth.userId, activity: `Listening to ${song.title} by ${song.artist}`}
            );
        }

        set({
            currentSong: song,
            isPlaying: true,
            currentIndex: songIndex !== -1? songIndex : get().currentIndex
        })
    },

    togglePlay: () => {
        const willStartPlaying = !get().isPlaying;
        

        const currentSong = get().currentSong;
        const socket = useChatStore.getState().socket;

        if(socket.auth){
            socket.emit("update_activity",{
                userId: socket.auth.userId,
                activity: willStartPlaying && currentSong? `Listening to ${currentSong?.title} by ${currentSong?.artist}` : "Idle"
            })
        }


        set({
            isPlaying: willStartPlaying,
        })
    },

    playNext: () => {
        const { currentIndex, queue } = get();
        const nextIndex = currentIndex + 1;


        

        // if there is a next song to play execute 
        if(nextIndex < queue.length){
            const nextSong = queue[nextIndex]
            const socket = useChatStore.getState().socket;
        
            if(socket.auth){
                socket.emit("update_activity", 
                    {userId: socket.auth.userId, activity: `Listening to ${nextSong.title} by ${nextSong.artist}`}
                );
            }
            set({
                currentSong: nextSong,
                currentIndex: nextIndex,
                isPlaying: true,
            })
        }else{
            // if there isn't a next song
           set({isPlaying:false})
        }
    },

    playPrevious: () => {
        const { currentIndex, queue } = get();
        const prevIndex = currentIndex - 1;


        

        //there is a prev song
        if(prevIndex >= 0){
            const prevSong = queue[prevIndex];
            const socket = useChatStore.getState().socket;
        
        if(socket.auth){
            socket.emit("update_activity", 
                {userId: socket.auth.userId, activity: `Listening to ${prevSong.title} by ${prevSong.artist}`}
            );
        }
            set({
                currentIndex: prevIndex,
                currentSong: prevSong,
                isPlaying: true
            })
        }else{
            // no prev song
            set({isPlaying: false})
        }
    }

})) 