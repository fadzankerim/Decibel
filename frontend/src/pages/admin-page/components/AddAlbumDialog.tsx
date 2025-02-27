import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { axiosInstance } from '@/lib/axios'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { Plus, Upload } from 'lucide-react'
import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast'

const AddAlbumDialog = () => {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [newAlbum, setNewAlbum] = useState({
        title: "",
        artist: "",
        releaseYear: new Date().getFullYear(),
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => { 
        const file = e.target.files?.[0];
        if(file) setImageFile(file);
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            if(!imageFile){
                toast.error("Upload album artwork");
                return;
            }

            const formData = new FormData();
            formData.append("title", newAlbum.title);
            formData.append("artist", newAlbum.artist);
            formData.append("releaseYear", newAlbum.releaseYear.toString());
            formData.append("imageFile", imageFile);

            await axiosInstance.post('/admin/albums', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

            
            setNewAlbum({
                title: "",
                artist: "",
                releaseYear: new Date().getFullYear(),
            })

            setImageFile(null);

            setAlbumDialogOpen(false);

            toast.success("Album added successfully!");

        } catch (error: any) {
            toast.error("Failed to create album " + error.message);
        }finally{
            setIsLoading(false);
        }

    }

  return (
    <Dialog>
        <DialogTrigger>
          <Button variant={'ghost'}
          size={'icon'}
          className='bg-violet-500/50 border-violet-700/50 text-white cursor-pointer'>
              <Plus/>
          </Button>
        </DialogTrigger>

        <DialogContent className='bg-zinc-900 border-zinc-700'>
            <DialogHeader>
            <DialogTitle>
                Add A New Album 
            </DialogTitle>
            <DialogDescription>
                To your collection
            </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
            <input
            type='file'
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept='image/*'
            className='hidden'/>
            <div className='flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'
            onClick={() => fileInputRef.current?.click()}>
                <div className='text-center'>
                    <div className='p-3 bg-zinc-800 rounded-full inline-block mb-2'>
                        <Upload className='size-6 text-zinc-400'/>
                    </div>
                    <div className='text-sm text-zinc-400 mb-2'>
                        {imageFile? imageFile.name : 'Upload album artwork'}
                    </div>
                    <Button
                    variant={'outline'}
                    size={'sm'}
                    className='text-xs cursor-pointer'>
                        Choose File
                    </Button>
                </div>
            </div>

            <div className='space-y-2'>
                <label htmlFor="album-title" className='text-sm font-medium'>Album title</label>
                <Input 
                value={newAlbum.title}
                onChange={(e) => setNewAlbum({...newAlbum, title: e.target.value})}
                className='bg-zinc-800 border-zinc-700 mt-1'
                placeholder='Enter album title'/>
            </div>

            <div className='space-y-2'>
                <label htmlFor="album-artist" className='text-sm font-medium'>Album artist</label>
                <Input
                value={newAlbum.artist}
                onChange={(e) => setNewAlbum({...newAlbum, artist: e.target.value})} 
                placeholder='Enter album artist'
                className='bg-zinc-800 border-zinc-700 mt-1'/>
            </div>

            <div className='space-y-2'>
                <label htmlFor="album-releaseYear" className='text-sm font-medium'>Album release year</label>
                <Input
                type='number'
                min={1900}
                value={newAlbum.releaseYear}
                onChange={(e) => setNewAlbum({...newAlbum, releaseYear: parseInt(e.target.value)})} 
                placeholder='Enter album release year'
                className='bg-zinc-800 border-zinc-700 mt-1'/>
            </div>
        </div>

        <DialogFooter>
            <Button
            variant={'outline'}
            onClick={() => setAlbumDialogOpen(false)}
            disabled={isLoading}
            className='cursor-pointer'>
                Cancel
            </Button>
            <Button
            onClick={handleSubmit}
            className='bg-violet-500/50 border-violet-700/50 cursor-pointer'
            disabled={isLoading || !imageFile || !newAlbum.title || !newAlbum.artist}>
                {isLoading ? 'Adding...' : 'Add'}
            </Button>
        </DialogFooter>

        </DialogContent>
    </Dialog>
  )
}

export default AddAlbumDialog