import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '../Auth/AuthProvider'

const GuestLayout = () => {
  const {token} = useAuthContext()

  if(token){
    return <Navigate to="/" />
  }

  return (
    <div className='w-full h-screen  flex flex-col'>
      <Outlet />
    </div>
    
  )
}

export default GuestLayout