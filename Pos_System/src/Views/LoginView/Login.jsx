import React, { useState } from 'react'
import loginImage from './Images/Login.svg'
import logo from '../../MainUtilities/Logo/Logo.png'
import { Link, useNavigate } from 'react-router-dom'
import http from '../../http'
import axios from 'axios'
import { useAuthContext } from '../../Auth/AuthProvider'

const Login = () => {
    const {setToken} = useAuthContext()
    const navigate = useNavigate()
    const [fields, setFields] = useState({
        email : '',
        password : '',

    })
    const [fieldError, setFieldError] = useState([])

    const handleChange = (key, value) => {
        setFields({...fields, [key] : value})
    }

    const submit = async () => {
        try {
            const result = await http.post('login', fields)
            if(result.status === 200)
            {
                const token = result.data.token
                setToken(token)
                localStorage.setItem("ACCESS_TOKEN", token)
                navigate('/products')
            }
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <main className='w-full h-full bg-theme-extraLight flex flex-col justify-center items-center'>
        {/* Main Container */}
        <div className='w-[90%] xl:w-[70%] h-[90%] bg-white shadow-lg rounded-2xl grid grid-cols-2 overflow-hidden'>
            <div className=' col-span-1 bg-white flex p-10 relative'>
                <img src={loginImage} alt="image" className='-top-[20] ' />
            </div>
            {/* Right Container */}
            <div className='bg-white w-full px-24 flex flex-col space-y-5 justify-center items-center'>
                <div id='Logo_container' className='w-full flex justify-center py-0'>
                    <img src={logo} alt="Logo" className='w-48' />
                </div>
                <div className='w-full  flex flex-col space-y-2 '>
                    {/* Email */}
                    <div className='w-full  flex flex-col items-start'>
                        <label className='text-gray-400 my-1'>Email</label>
                        <input value={fields.email} onChange={(e)=>{handleChange('email', e.target.value)}} type="text" className='p-2 w-full border-2 border-gray-100 rounded-md' />
                    </div>
                    {/* Password */}
                    <div className='w-full  flex flex-col items-start'>
                        <label className='text-gray-400 my-1'>Password</label>
                        <input value={fields.password} onChange={(e)=>{handleChange('password', e.target.value)}} type="password" className='p-2 w-full border-2 border-gray-100 rounded-md' />
                     {/* Already registered? */}
                        <div className='w-full flex justify-end'>
                        <Link to='/register' ><p className='text-sm text-theme-semiLight py-0.5'>Not registered?</p></Link>
                        </div>
                    </div>
                    {/* Login Button */}
                    <div className='w-full py-1'>
                        <button onClick={()=>submit()} className='w-full py-3 bg-theme-medium text-white rounded-md'>Sign in</button>
                    </div>
                   
                </div>
            </div>
        </div>
    </main>
  )
}

export default Login