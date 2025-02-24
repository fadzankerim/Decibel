import { useEffect, useRef } from "react"
import { usePlayerStore } from "@/stores/usePlayerStore";

const AudioPlayer = () => {

    const audioRef = useRef<HTMLAudioElement>(null);
    const prevSongRef = useRef<String | null>(null);

    const { currentSong, isPlaying, playNext } = usePlayerStore();

    // handle play/pause logic

    useEffect(()=>{
        if(isPlaying) audioRef.current?.play();
        else audioRef.current?.pause();
    },[isPlaying]);
    
    // handle if the song ends

    useEffect(() => {
        const audio = audioRef.current;

        const handleEnded = () => {
            playNext();
        }

        audio?.addEventListener("ended", handleEnded)

        return () => audio?.removeEventListener("ended", handleEnded)

    },[playNext]);

    // handle song changes

    useEffect(() => {
        if(!audioRef.current || !currentSong) return;

        const audio = audioRef.current;

        // i need to check if it is a new song 

        const isSongChanged = prevSongRef.current !== currentSong?.audioUrl;

        if(isSongChanged){
            audio.src = currentSong?.audioUrl; 
            //reset the playback position
            audio.currentTime = 0;

            prevSongRef.current = currentSong?.audioUrl

        }

        if(isPlaying){
            audio.play();
        }

    },[isPlaying, currentSong]);

  return <audio ref={audioRef}/>
}

export default AudioPlayer