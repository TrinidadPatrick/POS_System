import React from 'react'
import just_logo from '../MainUtilities/Logo/just_logo.png'
import { BsShop } from "react-icons/bs";
import { MdOutlineInventory2 } from "react-icons/md";
import { VscGraph } from "react-icons/vsc";
import { RiAccountBoxLine } from "react-icons/ri";
import { PiMoneyDuotone } from "react-icons/pi";
import { CiLogout } from "react-icons/ci";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import http from '../http';
import { useAuthContext } from '../Auth/AuthProvider';
import WindowSizeProvider from '../Hooks/WindowSizeProvider';

const Sidebar = () => {
    const {width, height} = WindowSizeProvider()
    const {setToken} = useAuthContext()
    const navigate = useNavigate()

  const logout = async () => {
    try {
        const result = await http.post('logout', {})
        localStorage.removeItem('ACCESS_TOKEN')
        setToken(null)
        window.location.href = '/login'
    } catch (error) {
        console.log(error)
    }
  }


  return (
    <aside style={{boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 0px 0px'}} className=' w-[65px] sm:w-[80px] h-screen bg-white flex flex-col space-y-10 px-1 sm:px-2 py-7'>
        {/* Logo */}
        <div className='w-full flex justify-center items-center'>
            <img src={just_logo} alt="" className='w-9 sm:w-12' />
        </div>
        {/* Navigations */}
        <div className='w-full h-full flex flex-col justify-start space-y-5'>
            <NavLink style={{textDecoration : 'none'}} to='/' className={({ isActive })=>`${isActive ? 'bg-theme-dark text-white ' : 'text-gray-500'} py-2 outline-none rounded-md w-full flex flex-col items-center justify-center space-y-1.5`}>
            {({ isActive }) => (
            <>
            <BsShop fontSize={width <= 450 ? 15 : 20} color={isActive ? 'white' : undefined} />
            <p className={`text-[0.7rem] sm:text-xs font-medium ${isActive ? 'text-white' : ''}`}>Home</p>
            </>
            )}
            </NavLink>
            <NavLink style={{textDecoration : 'none'}} to='products' className={({ isActive })=>`${isActive ? 'bg-theme-dark text-white ' : 'text-gray-500'} py-2 rounded-md w-full flex flex-col items-center justify-center space-y-1.5`}>
                {({ isActive }) => (
                <>
                <MdOutlineInventory2 fontSize={width <= 450 ? 15 : 20} color={isActive ? 'white' : undefined} />
                <p className={`text-[0.7rem] sm:text-xs font-medium ${isActive ? 'text-white' : ''}`}>Products</p>
                </>
                )}
            </NavLink>
            <NavLink style={{textDecoration : 'none'}} to='expense' className={({ isActive })=>`${isActive ? 'bg-theme-dark text-white ' : 'text-gray-500'} py-2 rounded-md w-full flex flex-col items-center justify-center space-y-1.5`}>
                {({ isActive }) => (
                <>
                <PiMoneyDuotone fontSize={width <= 450 ? 15 : 20} color={isActive ? 'white' : undefined} />
                <p className={`text-[0.7rem] sm:text-xs font-medium ${isActive ? 'text-white' : ''}`}>Expense</p>
                </>
                )}
            </NavLink>
            <NavLink style={{textDecoration : 'none'}} to='reports' className={({ isActive })=>`${isActive ? 'bg-theme-dark text-white ' : 'text-gray-500'} py-2 rounded-md w-full flex flex-col items-center justify-center space-y-1.5`}>
                {({ isActive }) => (
                <>
                <VscGraph fontSize={width <= 450 ? 15 : 20} color={isActive ? 'white' : undefined} />
                <p className={`text-[0.7rem] sm:text-xs font-medium ${isActive ? 'text-white' : ''}`}>Reports</p>
                </>
                )}
            </NavLink>
            <NavLink style={{textDecoration : 'none'}} to='account' className={({ isActive })=>`${isActive ? 'bg-theme-dark text-white ' : 'text-gray-500'} py-2 rounded-md w-full flex flex-col items-center justify-center space-y-1.5`}>
                {({ isActive }) => (
                <>
                <RiAccountBoxLine fontSize={width <= 450 ? 15 : 20} color={isActive ? 'white' : undefined} />
                <p className={`text-[0.7rem] sm:text-xs font-medium ${isActive ? 'text-white' : ''}`}>Account</p>
                </>
                )}
            </NavLink>
        </div>
        {/* Logout */}
        <div className='w-full flex justify-center'>
            <button onClick={()=>logout()} className='w-full flex flex-col font-medium justify-center items-center'>
                <CiLogout fontSize={width <= 450 ? 15 : 20} color='gray' />
                <p className='text-[0.7rem] sm:text-xs text-gray-500 font-medium'>Logout</p>
            </button>
        </div>
    </aside>
  )
}

export default Sidebar