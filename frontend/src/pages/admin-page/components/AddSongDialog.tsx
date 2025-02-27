import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { axiosInstance } from "@/lib/axios";
import { useMusicStore } from "@/stores/useMusicStore"
import { Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";


interface NewSong{
    title: string,
    artist: string,
    album: string,
    duration: number
}

const AddSongDialog = () => {

    const { albums } = useMusicStore();
    const [songDialogOpen, setSongDialogOpen] = useState(false);
    const [isLoading,setIsLoading] = useState(false);

    const [newSong, setNewSong] = useState<NewSong>({
        title: "",
        artist: "",
        album: "",
        duration: 0,
    });

    const [files, setFiles] = useState<{audio: File | null, image: File | null}>({
        audio: null,
        image: null
    })

    const audioInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit =  async () => {
        setIsLoading(true);

        try {
            if(!files.audio || !files.image){
                toast.error("Upload both audio and image file");
                return;
            }

            const formData = new FormData();
            formData.append("title", newSong.title);
            formData.append("artist", newSong.artist);
            formData.append("duration", newSong.duration.toString());
            if(newSong.album && newSong.album !== "none"){
                formData.append("albumId", newSong.album);
            }

            formData.append("audioFile", files.audio);
            formData.append("imageFile", files.image);

            await axiosInstance.post('/admin/songs', formData,{
                headers:{
                    "Content-Type": "multipart/form-data"
                }
            });

            setNewSong({
                title: "",
                artist: "",
                album: "",
                duration: 0,
            })

            setFiles({
                audio: null,
                image: null
            })

            toast.success("Song added successfully")
        } catch (error: any) {
            console.error("Error details:", error.response?.data || error.message);
            toast.error("Failed to add song: " + (error.response?.data?.message || error.message));
        }finally{
            setIsLoading(false)
        }
    }

  return (
    <Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
        <DialogTrigger asChild>
            <Button variant={'ghost'}
            size={'icon'} 
            className="bg-zinc-600/50 border-zinc-700/50 text-white cursor-pointer">
                <Plus className="size-4"/>
            </Button>
        </DialogTrigger>

        <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto">
            <DialogHeader>
                <DialogTitle>   
                    Add New Song
                </DialogTitle>
                <DialogDescription>
                    To your music library
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <input type="file"
                accept="audio/*"
                ref={audioInputRef}
                hidden
                onChange={(e) => setFiles((prev) => ({...prev, audio: e.target.files![0]}))}/>

                <input type="file"
                accept="image/*"
                ref={imageInputRef}
                hidden
                onChange={(e) => setFiles((prev) => ({...prev, image: e.target.files![0]}))}/>


                {/* Image upload area */}

                <div className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg
                cursor-pointer"
                onClick={() => imageInputRef.current?.click()}>
                    <div className="text-center">
                        {files.image ? (
                            <div className="space-y-2">
                                <div className="text-sm text-emerald-500">
                                    Image Selected:
                                </div>
                                <div className="text-xs text-zinc-400">
                                    {files.image.name.slice(0, 20)}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                                    <Upload className="h-6 w-6 text-zinc-400"/>
                                </div>
                                <div className="text-sm text-zinc-400 mb-2">Upload Artwork</div>
                                <Button
                                variant={'outline'}
                                size={'sm'}
                                className="text-xs cursor-pointer">
                                    Choose File
                                </Button>
                            </>
                        )}
                    </div>

                </div>

                {/* Audio upload */}

                <div className="space-y-2">
                    <label htmlFor="audioFile">Audio File</label>
                    <div className="flex items-center gap-2">
                        <Button
                        variant={'outline'}
                        onClick={() => audioInputRef.current?.click()}
                        className="w-full mt-1 cursor-pointer">
                            {files.audio ? files.audio.name.slice(0,20) : "Chose Audio File"}
                        </Button>
                    </div>
                </div>

                {/* the rest of the fields */}

                <div className="space-y-2">
                    <label htmlFor="songTitle" className="text-sm font-medium">Title</label>
                    <Input value={newSong.title} 
                    onChange={(e) => setNewSong({...newSong, title: e.target.value})}
                    className="bg-zinc-800 border-zinc-700"/>
                </div>

                <div className="space-y-2">
                    <label htmlFor="songTitle" className="text-sm font-medium">Artist</label>
                    <Input value={newSong.artist} 
                    onChange={(e) => setNewSong({...newSong, artist: e.target.value})}
                    className="bg-zinc-800 border-zinc-700"/>
                </div>

                <div className='space-y-2'>
						<label className='text-sm font-medium'>Duration (seconds)</label>
						<Input
							type="number"
							min='0'
							value={newSong.duration}
							onChange={(e) => setNewSong({ ...newSong, duration: parseInt(e.target.value) || 0 })}
							className='bg-zinc-800 border-zinc-700'
						/>
				</div>

                <div className='space-y-2'>
						<label className='text-sm font-medium'>Album (Optional)</label>
						<Select
							value={newSong.album}
							onValueChange={(value) => setNewSong({ ...newSong, album: value })}
						>
							<SelectTrigger className='bg-zinc-800 border-zinc-700'>
								<SelectValue placeholder='Select album' />
							</SelectTrigger>
							<SelectContent className='bg-zinc-800 border-zinc-700'>
								<SelectItem value='none'>No Album (Single)</SelectItem>
								{albums.map((album) => (
									<SelectItem key={album._id} value={album._id}>
										{album.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
				</div>
            </div>
            <DialogFooter>
					<Button variant='outline' onClick={() => setSongDialogOpen(false)} disabled={isLoading}
                    className="cursor-pointer">
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={isLoading}
                    className="cursor-pointer"
                    variant={'outline'}>
						{isLoading ? "Uploading..." : "Add Song"}
					</Button>
			</DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default AddSongDialog