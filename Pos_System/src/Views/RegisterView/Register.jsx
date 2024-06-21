import React from 'react'
import signupImage from './Images/Signup_Image.svg'
import logo from '../../MainUtilities/Logo/Logo.png'
import { Link, Navigate } from 'react-router-dom'
import http from '../../http'
import { useState } from 'react'
import LoadingProcess from '../../MainUtilities/Loader/LoadingProcess'
import { useAuthContext } from '../../Auth/AuthProvider'
import { FaEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";

const Register = () => {
    const {setToken} = useAuthContext()
    const [fields, setFields] = useState({
    name : '',
    email : '',
    store_name : '',
    password : '',
    password_confirmation : ''

    })
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [text, settext] = useState('')

    const handleChange = (key, value) => {
    setFields({...fields, [key] : value})
    }

    const submit = async (e) => {
    e.preventDefault()
    try {
        setLoading(true)
        const result = await http.post('register', fields)
        const token = result.data.token
        setToken(token)
        localStorage.setItem("ACCESS_TOKEN", token)
        Navigate('/')
    } catch (error) {
        settext(String(Object.values(error.response.data.errors)[0]))
    } finally {
        setLoading(false)
    }
    }
return (
<main className='w-full h-full bg-theme-extraLight flex flex-col justify-center items-center'>
    {/* Main Container */}
    <div className='w-full h-full semiSm:w-[90%] xl:w-[70%] semiSm:h-[90%] bg-gray-100 shadow-lg semiSm:rounded-2xl grid grid-cols-1 sm:grid-cols-2 overflow-hidden'>
        <div className='hidden sm:flex  flex-col items-center justify-center bg-white p-10 relative'>
            <img src={signupImage} alt="image" className='-top-[20] w-64 miniMd:w-72 lg:w-96 ' />
        </div>
        {/* Right Container */}
        <div className='bg-white w-full px-5 lg:px-24 flex flex-col space-y-5 justify-center items-center'>
            <div id='Logo_container' className='w-full flex justify-center py-0'>
                <img src={logo} alt="Logo" className='w-48' />
            </div>
            <p className='text-red-500'>{text}</p>
            <form onSubmit={submit} className='w-full  flex flex-col space-y-2 '>
                {/* Name */}
                <div className='w-full flex items-center gap-2'>
                <div className='w-full  flex flex-col items-start'>
                    <label className='text-gray-400 my-1'>Name</label>
                    <input required value={fields.name} onChange={(e)=>{handleChange('name', e.target.value)}} type="text" className='p-2 w-full border-2 border-gray-100 rounded-md' />
                </div>
                {/* Email */}
                <div className='w-full  flex flex-col items-start'>
                    <label className='text-gray-400 my-1'>Email</label>
                    <input required value={fields.email} onChange={(e)=>{handleChange('email', e.target.value)}} type="text" className='p-2 w-full border-2 border-gray-100 rounded-md' />
                </div>
                </div>
                {/* Shop name */}
                <div className='w-full  flex flex-col items-start'>
                    <label className='text-gray-400 my-1'>Store name</label>
                    <input required value={fields.store_name} onChange={(e)=>{handleChange('store_name', e.target.value)}} type="text" className='p-2 w-full border-2 border-gray-100 rounded-md' />
                </div>
                {/* Password */}
                <div className='w-full relative flex flex-col items-start'>
                    <label className='text-gray-400 my-1'>Password</label>
                    <input required value={fields.password} onChange={(e)=>{handleChange('password', e.target.value)}} type={showPassword ? 'text' : 'password'} className='p-2 w-full border-2 border-gray-100 rounded-md' />
                    {
                        showPassword ?
                        <button onClick={(e)=>{e.preventDefault();setShowPassword(false)}} className='absolute top-10 right-3'><FaRegEye size={17} /></button>
                        :
                        <button onClick={(e)=>{e.preventDefault();setShowPassword(true)}} className='absolute top-10 right-3'><FaEyeSlash size={17} /></button>
                    }
                </div>
                {/* Password */}
                <div className='w-full relative flex flex-col items-start'>
                    <label className='text-gray-400 my-1'>Confirm Password</label>
                    <input required value={fields.password_confirmation} onChange={(e)=>{handleChange('password_confirmation', e.target.value)}} type={showPassword ? 'text' : 'password'} className='p-2 w-full border-2 border-gray-100 rounded-md' />
                    {
                        showPassword ?
                        <button onClick={(e)=>{e.preventDefault();setShowPassword(false)}} className='absolute top-10 right-3'><FaRegEye size={17} /></button>
                        :
                        <button onClick={(e)=>{e.preventDefault();setShowPassword(true)}} className='absolute top-10 right-3'><FaEyeSlash size={17} /></button>
                    }
                 {/* Already registered? */}
                    <div className='w-full flex justify-end'>
                    <Link to='/login' ><p className='text-sm text-theme-semiLight py-0.5'>Already registered?</p></Link>
                    </div>
                </div>
                {/* Register Button */}
                <div className='w-full py-1'>
                <button type='submit' className='w-full flex justify-center items-center h-10 hover:bg-theme-light bg-theme-medium text-white rounded-md'>
                            {loading ? <LoadingProcess /> : "Sign up"}
                        </button>
                </div>
               
            </form>
        </div>
    </div>
</main>
)
}

export default Register