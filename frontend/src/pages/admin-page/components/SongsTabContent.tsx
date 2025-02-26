import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music } from "lucide-react"
import SongsTable from "./SongsTable"

const SongsTabContent = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"> 
              <Music className="h-5 w-5 text-emerald-500"/>
              Songs Library
            </CardTitle>
            <CardDescription>
              Manage your music
            </CardDescription>
          </div>
            <Button size={'icon'}
            variant={'ghost'}
            className="bg-zinc-700 flex items-center justify-center cursor-pointer">
              + 
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <SongsTable/>
      </CardContent>
    </Card>
  )
}

export default SongsTabContent