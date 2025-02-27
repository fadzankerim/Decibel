import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Library } from "lucide-react"
import AddAlbumDialog from "./AddAlbumDialog"
import AlbumsTable from "./AlbumsTable"

const AlbumsTabContent = () => {
  return (
    <Card>
      <CardHeader className="bg-zinc-800/50 border-zinc-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Library className="h-5 w-5 text-violet-500"/>
                Albums Library
              </CardTitle>
              <CardDescription>
                Manage you Album collection
              </CardDescription>
            </div> 
          </div>
          <AddAlbumDialog />
        </div>
      </CardHeader>

      <CardContent>
        <AlbumsTable />
      </CardContent>
    </Card>
  )
}

export default AlbumsTabContent