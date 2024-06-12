import React from 'react'
import signupImage from './Images/Signup_Image.svg'
import logo from '../../MainUtilities/Logo/Logo.png'
import { Link } from 'react-router-dom'
import http from '../../http'
import { useState } from 'react'

const Register = () => {
  const [fields, setFields] = useState({
    name : '',
    email : '',
    password : '',
    password_confirmation : ''

})
const [fieldError, setFieldError] = useState([])

const handleChange = (key, value) => {
    setFields({...fields, [key] : value})
}

const submit = async () => {
    try {
        const result = await http.post('register', fields)
        console.log(result.data)
    } catch (error) {
        console.log(error)
    }
}
return (
<main className='w-full h-full bg-theme-extraLight flex flex-col justify-center items-center'>
    {/* Main Container */}
    <div className='w-[90%] xl:w-[70%] h-[90%] bg-white shadow-lg rounded-2xl grid grid-cols-2 overflow-hidden'>
        <div className=' col-span-1 bg-white flex p-10 relative'>
            <img src={signupImage} alt="image" className='-top-[20] ' />
        </div>
        {/* Right Container */}
        <div className='bg-white w-full px-24 flex flex-col space-y-5 justify-center items-center'>
            <div id='Logo_container' className='w-full flex justify-center py-0'>
                <img src={logo} alt="Logo" className='w-48' />
            </div>
            <div className='w-full  flex flex-col space-y-2 '>
                {/* Name */}
                <div className='w-full  flex flex-col items-start'>
                    <label className='text-gray-400 my-1'>Name</label>
                    <input value={fields.name} onChange={(e)=>{handleChange('name', e.target.value)}} type="text" className='p-2 w-full border-2 border-gray-100 rounded-md' />
                </div>
                {/* Email */}
                <div className='w-full  flex flex-col items-start'>
                    <label className='text-gray-400 my-1'>Email</label>
                    <input value={fields.email} onChange={(e)=>{handleChange('email', e.target.value)}} type="text" className='p-2 w-full border-2 border-gray-100 rounded-md' />
                </div>
                {/* Password */}
                <div className='w-full  flex flex-col items-start'>
                    <label className='text-gray-400 my-1'>Password</label>
                    <input value={fields.password} onChange={(e)=>{handleChange('password', e.target.value)}} type="password" className='p-2 w-full border-2 border-gray-100 rounded-md' />
                </div>
                {/* Password */}
                <div className='w-full  flex flex-col items-start'>
                    <label className='text-gray-400 my-1'>Confirm Password</label>
                    <input value={fields.password_confirmation} onChange={(e)=>{handleChange('password_confirmation', e.target.value)}} type="password" className='p-2 w-full border-2 border-gray-100 rounded-md' />
                 {/* Already registered? */}
                    <div className='w-full flex justify-end'>
                    <Link to='/login' ><p className='text-sm text-theme-semiLight py-0.5'>Already registered?</p></Link>
                    </div>
                </div>
                {/* Login Button */}
                <div className='w-full py-1'>
                    <button onClick={()=>submit()} className='w-full py-3 bg-theme-medium text-white rounded-md'>Sign up</button>
                </div>
               
            </div>
        </div>
    </div>
</main>
)
}

export default Register