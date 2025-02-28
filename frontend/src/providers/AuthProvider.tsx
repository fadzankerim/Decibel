import { axiosInstance } from '@/lib/axios';
import { useAuth } from '@clerk/clerk-react';
import React, {  useEffect } from 'react'
import { useState } from 'react';
import { Loader } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useChatStore } from '@/stores/useChatStore';



const AuthProvider = ({ children }: { children:React.ReactNode } ) => {

  const { getToken, userId } = useAuth();
  const [loading, setLoading] = useState(true);

  const  {  checkAdminStatus  } = useAuthStore();

  const { initSocket, disconnectSocket } = useChatStore();

  const updateApiToken = (token: string | null) => {
    if(token){
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }else{
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  }


  useEffect(() => {
    const initAuth = async() => {
      try{
        const token = await getToken();
        updateApiToken(token);

        if(token){
          await checkAdminStatus();
          // init socket 
          if(userId){
            initSocket(userId);
          }
        }
      }catch(error){
        updateApiToken(null);
        console.log("Error in authProvider", error);
      }finally{
        setLoading(false);
      }
    }

    initAuth();

    // cleanup function to disconnect user(socket) when user logs out

    return () => disconnectSocket();

  }, [getToken, userId, checkAdminStatus, initSocket, disconnectSocket]);

  if(loading){
    return (

    <>
      <div className='h-screen w-full flex items-center justify-center'>
        <Loader className='animate-spin size-8 text-emerald-500'/>
      </div>
    
    </>
    )
  }

  return (
    
      <>
        {children}
      </>
  )
}

export default AuthProvider