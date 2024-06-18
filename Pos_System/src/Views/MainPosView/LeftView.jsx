import React, { useEffect, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import categoryStore from '../../Store/CategoryStore'
import CategoryProvider from '../../Hooks/CategoryProvider';
import ProductList from './ProductList';
import { useAuthContext } from '../../Auth/AuthProvider';
import WindowSizeProvider from '../../Hooks/WindowSizeProvider';
import { BsReverseLayoutTextSidebarReverse } from "react-icons/bs";

const LeftView = ({toggleRightView}) => {
    const {width} = WindowSizeProvider()
    const {categoryList, insertCategory} = categoryStore()
    const {getCategories} = CategoryProvider()
    const {user} = useAuthContext()
    const [categories, setCategories] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [selectedCategory, setSelectedCategory] = useState(null)
    const date = new Date().toLocaleDateString('EN-US', {
        month : 'long',
        day : 'numeric',
        year : 'numeric'
    })

    useEffect(()=>{
        const newCategories = [...categoryList]
        newCategories.unshift({id: null, category_name : 'All'})
        setCategories(newCategories)
    },[categoryList])


  return (
    <div className='flex-1 overflow-auto p-5 flex flex-col space-y-5 h-full relative'>
        {/* Top Part */}
        <div className='w-full flex flex-row items-center justify-between'>
            {/* Search Input */}
            <div className=' w-52 semiSm:w-64 lg:w-96 relative h-full '>
                <input value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} type="text" placeholder='Search product' className='ps-2 py-2 text-xs border-2 border-gray-100 outline-none w-full h-full rounded pe-10 lg:text-sm lg:ps-5'  />
                <button className='absolute right-2 lg:right-3 top-1.5 lg:top-2'>
                    <CiSearch size={width <= 1023 ? 20 : 23} color='gray'  />
                </button>
            </div>

            <div className='hidden lg:flex items-start h-full gap-3 '>
                <div className=''>
                    <h6 className='font-extrabold text-sm lg:text-base m-0 '>{user?.name}</h6>
                    <p className='text-[0.7rem] lg:text-xs'>{date}</p>
                </div>
                <div className='h-full'>
                    <div className='h-full aspect-square flex items-center justify-center ps-0.5 pt-0.5 rounded-full bg-blue-500'>
                        <p className='text-white text-2xl'>{user?.name?.charAt(0)}</p>
                    </div>
                </div>
            </div>

            <button onClick={()=>toggleRightView()} className='md:hidden  px-2 bg-theme-medium py-2 rounded'>
                <BsReverseLayoutTextSidebarReverse color='white' />
            </button>
            
        </div>

        {/* Category List */}
        <div className=''>
        <h6 className='text-gray-800 font-extrabold' >Categories</h6>
        <div className='noScrollBar whitespace-nowrap flex-nowrap justify-start overflow-x-scroll flex items-center gap-5 lg:gap-10 py-2'>
            {
                categories?.sort((a,b)=> new Date(b.created_at) - new Date(a.created_at)).map((category, index)=>{
                    return (
                        <button key={category.id} onClick={()=>{setSelectedCategory(category.id)}} className={`${selectedCategory === category.id ? 'bg-theme-medium text-white' : 'bg-white'} text-xs lg:text-sm whitespace-nowrap px-3 py-2 rounded shadow-sm font-medium`}>
                            {category.category_name}
                        </button>
                    )
                })
            }
        </div>
        </div>

        {/* Product List */}
        <section className='scrollBar flex-1  overflow-y-auto'>
        <h6 className='text-gray-800 font-extrabold mb-2' >Select menu</h6>
            <ProductList searchValue={searchValue} selectedCategory={selectedCategory} />
        </section>
    </div>
  )
}

export default LeftView