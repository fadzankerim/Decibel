import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore"
import { Calendar, Trash2 } from "lucide-react";

const AlbumsTable = () => {

    const { albums, isLoading, error, deleteAlbum} = useMusicStore();

    if(isLoading){
        return(
            <div className="flex items-center justify-center py-8">
                <div className="text-zinc-400">
                    Loading albums...
                </div>
            </div>
        )
    }  

    if(error){
        return(
            <div className="flex items-center justify-center py-8">
                <div className="text-red-500">
                    {error}
                </div>
            </div>
        )
    }

  return (
    <Table>
        <TableHeader>
            <TableRow className="hover:zinc-800/50">
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Release Year</TableHead>
                <TableHead>Songs</TableHead>
                <TableHead className="text-right">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody> 
            {albums.map((album) => (
                <TableRow key={album._id} className="hover:bg-zinc-800/50">
                    <TableCell>
                        <img src={album.imageUrl} alt={album.title} className="size-10 rounded-md object-cover"/>
                    </TableCell>
                    <TableCell className="font-medium ">
                        {album.title}
                    </TableCell>
                    <TableCell className="font-medium ">
                        {album.artist}
                    </TableCell>
                    <TableCell>
                        <span className="inline-flex items-center gap-1 text-zinc-400">
                            <Calendar className="size-4"/>
                            {album.releaseYear}
                        </span>
                    </TableCell>
                    <TableCell>
							<span className='inline-flex items-center gap-1 text-zinc-400'>
								{album.songs.length} songs
							</span>
					</TableCell>
                    <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                            <Button
                            variant={'ghost'}
                            size={'sm'}
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10 cursor-pointer"
                            onClick={() => deleteAlbum(album._id)}>
                                <Trash2 className="size-4 "/>
                            </Button>
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
  )
}

export default AlbumsTable