import { Outlet } from "react-router-dom"
import { ResizablePanelGroup,  ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import LeftSideBar from "./MainLayoutComponents/LeftSideBar";
import FriendsActivity from "./MainLayoutComponents/FriendsActivity";
import AudioPlayer from "./MainLayoutComponents/AudioPlayer";


const MainLayout = () => {

    const isMobile = false;

  return (
    <>
        <div className="h-screen bg-black text-white flex-col">
            <ResizablePanelGroup direction="horizontal" className="flex-1 flex h-full overflow-hidden p-2">

                <AudioPlayer />

                {/* LEFT SIDEBAR */}
                <ResizablePanel defaultSize={20} minSize={ isMobile? 0 : 20} maxSize={30}>
                    <LeftSideBar />
                </ResizablePanel>

                <ResizableHandle className="w-2 bg-black rounded-lg transition-colors"/>

            
                {/* MainContent */}

                <ResizablePanel defaultSize={isMobile? 80 : 60}>
                    <Outlet />
                </ResizablePanel>

                <ResizableHandle className="w-2 bg-black rounded-lg transition-colors"/>


                {/* RIGHT SIDEBAR */}

                <ResizablePanel defaultSize={20} minSize={0} maxSize={25} collapsedSize={0}>
                    <FriendsActivity />
                </ResizablePanel>

            </ResizablePanelGroup>
        </div>
    </>
  )
}

export default MainLayout