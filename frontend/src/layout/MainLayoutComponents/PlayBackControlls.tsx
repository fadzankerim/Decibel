import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore"
import { Laptop, ListMusic, Mic2, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { Slider } from "@/components/ui/slider";


const PlayBackControlls = () => {

    const { currentSong, isPlaying, togglePlay, playNext, playPrevious } = usePlayerStore();

    const [volume, setVolume] = useState(75);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);


    useEffect(() => {
        audioRef.current = document.querySelector("audio");
        const audio = audioRef.current;

        if(!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);

        const updateDuration = () => setDuration(audio.duration);

        const handleEnded = () => {
            usePlayerStore.setState({isPlaying: false});
        }

        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("loadedmetadata", updateDuration);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", updateDuration);
            audio.removeEventListener("ended", handleEnded);
        }

    },[currentSong]);

    const handleSeek = (value: number[]) => {
        if(audioRef.current){
            audioRef.current.currentTime = value[0]
        }
    }

  return (
    <footer className="h-20 sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4 rounded-lg">
        <div className="flex justify-between items-center h-full max-w-[1800px] mx-auto">
            {/* Currently playing song */}
            <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]">
                { currentSong && (
                    <>
                        <img src={currentSong.imageUrl} alt={currentSong.title} 
                        className="w-14 h-14 object-cover rounded-md"/>
                        <div className="flex-1 min-w-0">
                            <div className="font-medium truncate hover:underline cursor-pointer">
                                {currentSong.title}
                            </div>
                            <div className="text-sm text-zinc-400 truncate hover:underline cursor-pointer">
                                {currentSong.artist}
                            </div>
                        </div>
                    </>
                )}

            </div>

            {/* Player controls */}

            <div className="flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]">
                <div className="flex items-center gap-4 sm:gap-6">
                    <Button size={'icon'}
                    variant={'ghost'}
                    className="hidden sm:inline-flex hover:text-white text-zinc-400 cursor-pointer">
                        <Shuffle className="h-4 w-4"/>
                    </Button>

                    <Button size={'icon'}
                    variant={'ghost'}
                    className=" hover:text-white text-zinc-400 cursor-pointer"
                    disabled={!currentSong}
                    onClick={playPrevious}>
                        <SkipBack className="h-4 w-4"/>
                    </Button>

                    
                    <Button size={'icon'}
                    variant={'ghost'}
                    className="bg-white hover:bg-white/80 text-black rounded-full h-8 w-8 cursor-pointer"
                    onClick={togglePlay}
                    disabled={!currentSong}>
                        {isPlaying? (
                            <Pause/>
                        ):(
                            <Play/>
                        )}
                    </Button>

                    <Button size={'icon'}
                    variant={'ghost'}
                    className=" hover:text-white text-zinc-400 cursor-pointer"
                    onClick={playNext}
                    disabled={!currentSong}>
                        <SkipForward className="h-4 w-4"/>
                    </Button>

                    <Button size={'icon'}
                    variant={'ghost'}
                    className=" hover:text-white text-zinc-400 cursor-pointer">
                        <Repeat className="h-4 w-4"/>
                    </Button>
                </div>
                <div className="hidden sm:flex items-center gap-2 w-full">
                    <div className="text-xs text-zinc-400">
                        {format(new Date(currentTime * 1000), 'mm:ss')}
                    </div>
                    <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={1} 
                    className="w-full hover:cursor-grab active:cursor-grabbing"
                    onValueChange={handleSeek}/>

                    <div className="text-xs text-zinc-400">
                        {format(new Date(duration * 1000), 'mm:ss')}
                    </div>
                </div>

            </div>
                {/* Volume controls */}
                <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end">
                    <Button size={'icon'} variant={'ghost'} className="hover:text-white text-zinc-400">
                        <Mic2 className="h-4 w-4"/>  
                    </Button>
                    <Button size={'icon'} variant={'ghost'} className="hover:text-white text-zinc-400">
                    <ListMusic className="h-4 w-4"/>
                    </Button>
                    <Button size={'icon'} variant={'ghost'} className="hover:text-white text-zinc-400">
                        <Laptop className="h-4 w-4"/>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Button size={'icon'} variant={'ghost'} className="hover:text-white text-zinc-400">
                            <Volume className="h-4 w-4"/>
                        </Button>
                        <Slider 
                        value={[volume]}
                        max={100}
                        step={1}
                        className="w-24 hover:cursor-grab active:cursor-grabbing"
                        onValueChange={(value) => {
                            setVolume(value[0]);
                            if(audioRef.current){
                                audioRef.current.volume = value[0] / 100
                            }
                        }}
                        />
                    </div>
                </div>
        </div>
    </footer>
  )
}

export default PlayBackControlls