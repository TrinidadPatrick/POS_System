import React from 'react'
import just_logo from '../MainUtilities/Logo/just_logo.png'
import { BsShop } from "react-icons/bs";
import { MdOutlineInventory2 } from "react-icons/md";
import { VscGraph } from "react-icons/vsc";
import { RiAccountBoxLine } from "react-icons/ri";
import { CiLogout } from "react-icons/ci";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import http from '../http';
import { useAuthContext } from '../Auth/AuthProvider';

const Sidebar = () => {
    const {setToken} = useAuthContext()
    const navigate = useNavigate()

  const logout = async () => {
    try {
        const result = await http.post('logout', {})
        localStorage.removeItem('ACCESS_TOKEN')
        setToken(null)
        navigate('/login')
    } catch (error) {
        console.log(error)
    }
  }


  return (
    <aside className='w-[80px] h-screen bg-white flex flex-col space-y-10 px-2 py-7'>
        {/* Logo */}
        <div className='w-full flex justify-center items-center'>
            <img src={just_logo} alt="" className='w-12' />
        </div>
        {/* Navigations */}
        <div className='w-full h-full flex flex-col justify-start space-y-5'>
            <NavLink to='/' className={({ isActive })=>`${isActive ? 'bg-theme-dark text-white ' : 'text-gray-500'} py-2 rounded-md w-full flex flex-col items-center justify-center space-y-1.5`}>
                <BsShop fontSize={20} />
                <p className='text-xs font-medium'>Home</p>
            </NavLink>
            <NavLink to='products' className={({ isActive })=>`${isActive ? 'bg-theme-dark text-white ' : 'text-gray-500'} py-2 rounded-md w-full flex flex-col items-center justify-center space-y-1.5`}>
                <MdOutlineInventory2 fontSize={20}  />
                <p className='text-xs  font-medium'>Products</p>
            </NavLink>
            <NavLink to='reports' className={({ isActive })=>`${isActive ? 'bg-theme-dark text-white ' : 'text-gray-500'} py-2 rounded-md w-full flex flex-col items-center justify-center space-y-1.5`}>
                <VscGraph fontSize={20}  />
                <p className='text-xs  font-medium'>Reports</p>
            </NavLink>
            <NavLink to='account' className={({ isActive })=>`${isActive ? 'bg-theme-dark text-white ' : 'text-gray-500'} py-2 rounded-md w-full flex flex-col items-center justify-center space-y-1.5`}>
                <RiAccountBoxLine fontSize={20}  />
                <p className='text-xs font-medium'>Account</p>
            </NavLink>
        </div>
        {/* Logout */}
        <div className='w-full flex justify-center'>
            <button onClick={()=>logout()} className='w-full flex flex-col font-medium justify-center items-center'>
                <CiLogout fontSize={20} color='gray' />
                <p className='text-xs text-gray-500 font-medium'>Logout</p>
            </button>
        </div>
    </aside>
  )
}

export default Sidebar