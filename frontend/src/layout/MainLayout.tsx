import { Outlet } from "react-router-dom"
import { ResizablePanelGroup,  ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import LeftSideBar from "./MainLayoutComponents/LeftSideBar";
import FriendsActivity from "./MainLayoutComponents/FriendsActivity";
import AudioPlayer from "./MainLayoutComponents/AudioPlayer";
import PlayBackControlls from "./MainLayoutComponents/PlayBackControlls";
import { useEffect, useState } from "react";


const MainLayout = () => {

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener("resize", checkIsMobile);
        return () => window.removeEventListener("resize", checkIsMobile)
    },[])

  return (
    <>   
     {/*edited the height of the page below here  so the playback controls fit to the page*/}
        <div className={`${isMobile?"h-[calc(100vh-80px)]":"h-[calc(100vh-100px)]"} bg-black text-white flex-col`}>
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

                {!isMobile && (
                    <>
                        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors"/>


                        {/* RIGHT SIDEBAR */}

                        <ResizablePanel defaultSize={20} minSize={0} maxSize={25} collapsedSize={0}>
                            <FriendsActivity />
                        </ResizablePanel>
                    </>
                )}

                

            </ResizablePanelGroup>

            <PlayBackControlls />
        </div>
    </>
  )
}

export default MainLayout