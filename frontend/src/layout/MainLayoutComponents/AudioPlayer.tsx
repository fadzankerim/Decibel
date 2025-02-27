import { useEffect, useRef } from "react"
import { usePlayerStore } from "@/stores/usePlayerStore";

const AudioPlayer = () => {

    const audioRef = useRef<HTMLAudioElement>(null);
    const prevSongRef = useRef<string | null>(null);

    const { currentSong, isPlaying, playNext } = usePlayerStore();

    // handle play/pause logic

    useEffect(()=>{
        if(isPlaying) audioRef.current?.play();
        else audioRef.current?.pause();
    },[isPlaying]);
    
    // handle if the song ends

    useEffect(() => {
        const audio = audioRef.current;
        console.log('Audio URL:', currentSong?.audioUrl)

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
            audio.innerHTML = '';
            const source = document.createElement('source');
            source.src = currentSong.audioUrl
            source.type = 'audio/mpeg';
            audio.appendChild(source)
            // audio.src = currentSong?.audioUrl;
            audio.load(); 
            //reset the playback position
            audio.currentTime = 0;

            prevSongRef.current = currentSong?.audioUrl

        }

        if(isPlaying){
            audio.play();
        }

    },[isPlaying, currentSong]);

  return <audio ref={audioRef} />
}

export default AudioPlayer