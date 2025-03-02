
import { Route,Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import AuthCallback from "./pages/auth-callback/AuthCallback";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
import ChatPage from "./pages/chat-page/ChatPage";
import AlbumPage from "./pages/album-page/AlbumPage";
import AdminPage from "./pages/admin-page/AdminPage";
import { Toaster } from 'react-hot-toast'
import NotFound from "./pages/not-found/NotFound";

function App() {

  
  return( 
    <>
      <Routes>
        <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback 
        signInForceRedirectUrl={"/auth-callback"}/>} />
        <Route path="/auth-callback" element={<AuthCallback />} />
        <Route path="/admin" element={<AdminPage />} />

        <Route element={<MainLayout />} >
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/albums/:albumId" element={<AlbumPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster position="bottom-center"/>
    </>
      
  ) 
}

export default App
