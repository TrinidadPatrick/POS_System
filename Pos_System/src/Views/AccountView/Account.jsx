import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../Auth/AuthProvider'
import noProfile from '../../MainUtilities/EmptyImage/no-profile.png'
import http from '../../http'
import LoadingProcess from '../../MainUtilities/Loader/LoadingProcess'
import { ToastContainer, toast } from 'react-toastify';
import WindowSizeProvider from '../../Hooks/WindowSizeProvider'

const Account = () => {
  const {user, setUser} = useAuthContext()
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    store_name: '',
    password: '',
    currentPassword: '',
    profile_picture : ''
  });
  const {width} = WindowSizeProvider()

  const [isChangingPassword, setIsChangingPassword] = useState(false)

  useEffect(()=>{
    if(user?.name)
    {
      setForm({
        name: user?.name,
        email: user?.email,
        store_name: user?.store_name,
        password: '',
        currentPassword: '',
        profile_picture : user?.profile_picture
      })
    }
    
  },[user])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const resizeImage = (file, maxWidth, maxHeight, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(callback, 'image/jpeg', 0.7); // Adjust quality if needed
      };
    };
  };

  const addImage = async (e) => {
    const file = e.target.files[0];
    if(file)
    {
        setUploading(true)
        resizeImage(file, 800, 800, async (blob) => { // Adjust maxWidth and maxHeight as needed
        const formData = new FormData();
        formData.append('file', blob);
        formData.append('upload_preset', 'POS_User_Profile'); // Set up upload presets in Cloudinary dashboard
  
        const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
        });
  
        const data = await response.json();
        setUploading(false)
        setForm({...form, profile_picture : data.secure_url});
      });
    }
  }

  const notify = (message, status) => {
    if(status === "success")
    {
      toast.success(message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        // theme: theme,
        });
    }
    else
    {
      toast.error(message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        // theme: theme,
        });
    }
  }

  const handleSubmit =async () => {
        try {
          const result = await http.patch(`updateUser/${user.id}`, form)
          const newUser = result.data.user
          Object.entries(newUser).map(([key, value])=>{
            setUser((prevUser) => ({...prevUser, [key] : value}))
          })
          notify('User information updated', 'success')
        } catch (error) {
          console.log(error)
          notify('Failed to update user', 'fail')
        }
  };

  return (
    <main className='flex-1 relative flex justify-center items-center bg-white'>
    <div className='w-full h-[300px] top-0 bg-gray-100 absolute'></div>
    <div style={{width : `${width <= 500 ? '100%' : width <= 768 ? width - 100+'px' : '700px'}`}} className={` flex flex-col h-full sm:h-fit p-0 sm:p-6 relative z-20 `}>
      <h2 className="hidden md:flex text-2xl font-extrabold text-gray-900">Account Settings</h2>
      <p className='hidden md:flex mb-3 text-xs'>Edit your personal information</p>
      
      <div className='flex flex-col-reverse md:flex-row gap-10 w-full h-full bg-white sm:rounded-lg shadow px-5 py-5 sm:px-14 sm:py-10'>
      {/* Left Side */}
      <div className='w-full h-full'>
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={(e)=>handleChange(e)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:border-theme-medium sm:text-sm"
            required
          />
        </div>
        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={(e)=>handleChange(e)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:border-theme-medium sm:text-sm"
            required
          />
        </div>
        {/* Shopname */}
        <div className="mb-4">
          <label htmlFor="store_name" className="block text-sm font-medium text-gray-700">
            Shop Name
          </label>
          <input
            type="text"
            id="store_name"
            name="store_name"
            value={form.store_name || ''}
            onChange={(e)=>handleChange(e)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:border-theme-medium sm:text-sm"
            required
          />
        </div>
        {/* Password */}
        {
          isChangingPassword &&
          <div className=''>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
          </div>
        }
        {/* Password button */}
        {
          !isChangingPassword &&
          <div className=' mb-4'>
          <input disabled type='password' value='YouGotPranked' className='mt-1 block w-full px-3 py-2 border bg-gray-100 border-gray-300 rounded-md shadow-sm' />
          <p onClick={()=>setIsChangingPassword(true)} className=' cursor-pointer text-xs text-right text-blue-500 mt-1'>Change password</p>
          </div>
        }

        <button
        onClick={()=>handleSubmit()}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-theme-medium hover:bg-theme-semiLight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Changes
        </button>
      </div>
      {/* Right Side */}
      <div className='w-full md:w-[200px] flex flex-col gap-3  '>
        {/* Image container */}
        <div className='w-[100px] mx-auto aspect-square bg-black overflow-hidden rounded-full'>
          <img src={form.profile_picture || noProfile} alt="profile" />
        </div>

        <label htmlFor="fileInput" className={` bg-theme-medium text-[0.85rem] relative justify-center w-[100px] mx-auto h-8 flex items-center hover:bg-theme-semiLight text-white text-center rounded cursor-pointer`}>
        {uploading ? <LoadingProcess /> : 'Edit Profile'}
        <input onChange={(e)=>addImage(e)} type="file" id="fileInput" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
        </label>
      </div>
      </div>
    </div>
    <ToastContainer/>
    </main>
   
  )
}

export default Account