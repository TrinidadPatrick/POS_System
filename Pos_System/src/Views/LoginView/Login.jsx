import React, { useState } from 'react'
import loginImage from './Images/Login.svg'
import logo from '../../MainUtilities/Logo/Logo.png'
import { Link, useNavigate } from 'react-router-dom'
import http from '../../http'
import axios from 'axios'
import { useAuthContext } from '../../Auth/AuthProvider'
import LoadingProcess from '../../MainUtilities/Loader/LoadingProcess'

const Login = () => {
    const {setToken} = useAuthContext()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [fields, setFields] = useState({
        email : '',
        password : '',

    })
    const [text, settext] = useState('')

    const handleChange = (key, value) => {
        setFields({...fields, [key] : value})
    }

    const submit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const result = await http.post('login', fields)
            if(result.status === 200)
            {
                const token = result.data.token
                setToken(token)
                localStorage.setItem("ACCESS_TOKEN", token)
                navigate('/')
            }
        } catch (error) {
            settext(String(error.response.data.message))
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
  return (
    <main className='w-full h-full bg-theme-extraLight flex flex-col justify-center items-center'>
        {/* Main Container */}
        <div className='w-full h-full semiSm:w-[90%] xl:w-[70%] semiSm:h-[90%] bg-gray-100 shadow-lg semiSm:rounded-2xl grid grid-cols-1 sm:grid-cols-2 overflow-hidden'>
            <div className='hidden sm:flex  flex-col items-center justify-center bg-white p-10 relative'>
                <img src={loginImage} alt="image" className='-top-[20] w-64 miniMd:w-72 lg:w-96 ' />
            </div>
            {/* Right Container */}
            <div className='bg-white w-full px-5 lg:px-24 flex flex-col space-y-5 justify-center items-center'>
                <div id='Logo_container' className='w-full flex justify-center py-0'>
                    <img src={logo} alt="Logo" className='w-48' />
                </div>
                <p className='text-red-500'>{text}</p>
                <form onSubmit={submit} className='w-full  flex flex-col space-y-2 '>
                    {/* Email */}
                    <div className='w-full  flex flex-col items-start'>
                        <label className='text-gray-400 my-1'>Email</label>
                        <input required value={fields.email} onChange={(e)=>{handleChange('email', e.target.value, e)}} type="text" className='p-2 w-full border-2 border-gray-100 rounded-md' />
                    </div>
                    {/* Password */}
                    <div className='w-full  flex flex-col items-start'>
                        <label className='text-gray-400 my-1'>Password</label>
                        <input required value={fields.password} onChange={(e)=>{handleChange('password', e.target.value, e)}} type="password" className='p-2 w-full border-2 border-gray-100 rounded-md' />
                     {/* Already registered? */}
                        <div className='w-full flex justify-end'>
                        <Link to='/register' ><p className='text-sm text-theme-semiLight py-0.5'>Not registered?</p></Link>
                        </div>
                    </div>
                    {/* Login Button */}
                    <div className='w-full py-1'>
                        <button type='submit' className='w-full flex justify-center items-center h-10 hover:bg-theme-light bg-theme-medium text-white rounded-md'>
                            {loading ? <LoadingProcess /> : "Sign in"}
                        </button>
                    </div>
                   
                </form>
            </div>
        </div>
    </main>
  )
}

export default Login