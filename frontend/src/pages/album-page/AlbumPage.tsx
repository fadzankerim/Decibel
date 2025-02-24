import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { Clock, Pause, Play } from "lucide-react";
import { format } from "date-fns";
import { useEffect } from "react";
import { useParams } from "react-router-dom"
import { usePlayerStore } from "@/stores/usePlayerStore";

const AlbumPage = () => {

    
    const { albumId } = useParams();
    
    const {fetchAlbumById,currentAlbum, isLoading} = useMusicStore();
    
    const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

    useEffect(() => {
        if(albumId) fetchAlbumById(albumId);
    }, [fetchAlbumById, albumId])

    if(isLoading) return null;

    const handlePlayAlbum = () => {

        if(!currentAlbum) return;

        const isCurrentAlbumPlaying = currentAlbum?.songs.some((song) => song._id === currentSong?._id);
        if(isCurrentAlbumPlaying) togglePlay();
        else{
            // start playing the album from the beginning
            playAlbum(currentAlbum?.songs, 0)
        }
    }

    const handlePlaySong = (index: number) => {

        if(!currentAlbum) return;

        playAlbum(currentAlbum?.songs, index)
    }


  return <div className="h-full">
            <ScrollArea className="h-full rounded-md">
                {/* Main content */}
                <div className=" min-h-full">
                    {/* Gradient bg */}

                    <div className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80
                    to-zinc-900 pointer-events-none" aria-hidden="true" />
                    

                    {/* Content */}
                    <div className="relative z-10 p-4">
                        <div className="flex p-6 gap-6 pb-8">
                            <img src={currentAlbum?.imageUrl} alt={currentAlbum?.title}  
                            className="w-[240px] h-[240px] shadow-xl rounded-md"/>
                            <div className="flex flex-col justify-end">
                                <p className="text-sm font-medium">
                                    Album
                                </p>
                                <h2 className="text-7xl font-bold my-4">
                                    {currentAlbum?.title}
                                </h2>
                                <div className="flex items-center gap-3 text-sm text-zinc-100 ">
                                    <span className="font-medium text-white">{currentAlbum?.artist}</span>
                                    <span>• {currentAlbum?.songs.length ?? 0} {currentAlbum?.songs.length === 1? 'song' : 'songs'}</span>
                                    <span>• {currentAlbum?.releaseYear}</span>
                                </div>
                            </div>
                        </div>

                        {/* Play button */}

                        <div className="px-6 pb-4 flex items-center gap-6">
                            <button onClick={handlePlayAlbum}
                            className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all duration-105 flex items-center justify-center cursor-pointer">
                                {isPlaying? (<Pause className="h-5 w-5 text-black" />):(<Play className="h-5 w-5 text-black" />) }
                                
                            </button>
                        </div>

                        {/* Table section */}

                        <div className="bg-black/20 backdrop-blur-lg rounded-md">

                            {/* Table header */}
                            <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm
                            text-zinc-400 border-b border-white/5">
                                <div>#</div>
                                <div>Title</div>
                                <div>Release Date</div>
                                <div>
                                    <Clock className="h-4 w-4" />
                                </div>
                            </div>

                            {/* songs list */}
                            <div className="px-6">
                                <div className="space-y-2 p-4">
                                    { currentAlbum?.songs.map((song, index) =>{
                                        const isCurrentSong = currentSong?._id === song._id
                                        return(
                                        <div key={song._id} 
                                        onClick={() => handlePlaySong(index)}
                                        className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 text-sm text-zinc-400  py-2 hover:bg-white/5 rounded-md group cursor-pointer">
                                            
                                            <div className="flex items-center justify-center">
                                                { isCurrentSong && isPlaying? (
                                                    <div className="size-4 text-green-500">
                                                        🎧
                                                    </div>
                                                ) : (<span className="group-hover:hidden">{index + 1}</span>) }
                                                {!isCurrentSong && (
                                                    <Play className="h-4 w-4 hidden group-hover:block" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <img src={song.imageUrl} alt={song.title} 
                                                className="size-10 rounded-l-md"/>
                                                <div>
                                                    {song.artist}
                                                </div>

                                            </div>

                                            <div className="flex items-center">
                                                {song.createdAt.split('T')[0]}
                                            </div>

                                            <div className="flex items-center">
                                                {format(new Date(song.duration * 1000), 'mm:ss')}
                                            </div>

                                        </div>
                                    )})}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>

        </div>
}

export default AlbumPage