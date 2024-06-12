import React, { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '../Auth/AuthProvider'
import http from '../http'
import Sidebar from './Sidebar'

const UserLayout = () => {
  const navigate = useNavigate()
  const {user, token, setUser } = useAuthContext()

  const getUser = async () => {
    try {
      const result = await http.get('user')
      if(result.status === 200)
      {
        setUser(result.data)
      }
    } catch (error) {
      if(error.response.status === 401)
      {
        localStorage.removeItem("ACCESS_TOKEN");
        navigate('/login');
      }
    }
  }

  // console.log(token)

  useEffect(()=>{
    getUser()
  },[])

  if(!token){
    navigate('/login')
  }

  return (
    <div className=' w-full h-screen relative flex'>
      <Sidebar />
      <Outlet />
    </div>
  )
}

export default UserLayout