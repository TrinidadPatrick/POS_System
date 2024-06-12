import React, { useState } from 'react'
import categoryStore from '../../Store/CategoryStore'
import { IoIosRemoveCircle } from "react-icons/io";
import CategoryProvider from '../../Hooks/CategoryProvider';
import http from '../../http';
import LoadingProcess from '../../MainUtilities/Loader/LoadingProcess';

const ManageCategoryModal = ({setIsCategoryModalOpen}) => {
    const {categoryList, insertCategory} = categoryStore()
    const [loading, setLoading] = useState(false)
    const [categoryToEdit, setCategoryToEdit] = useState(null)
    const [category, setCategory] = useState('')

    const handleAddCategory = async () => {
        // For performance
        setLoading(true)
        const newCategory = [...categoryList]

        try {
            const result = await http.post('category', {category_name : category} )
            newCategory.push(result.data.category)
            insertCategory(newCategory)
            setCategory('')
            setLoading(false)
        } catch (error) {
            console.log(error)
        }

       
    }

    const deleteCategory = async (id) => {
        let text = "Note that deleting a category will also delete your products associated with that category. ";
        if (confirm(text) == true) {
            try {
                const result = await http.delete(`category/${id}`)
                console.log(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        
    }

    const handleEdit = (categ) => {
        setCategoryToEdit(categ)
        setCategory(categ.category_name)
    }

    const handleUpdate = async () => {
        if(category)
        {
            setLoading(true)
            try {
                const result = await http.patch(`category/${categoryToEdit.id}`, {category_name : category})
                const updatedCategory = result.data.category
                const newCategory = [...categoryList]
                const index = newCategory.findIndex((category) => category.id === categoryToEdit.id)
                newCategory.splice(index, 1, updatedCategory)
                insertCategory(newCategory)
                setCategoryToEdit(null)
                setCategory('')
            } catch (error) {
                console.log(error)
            }
            setLoading(false)
        }
    }

  return (
    <div className='bg-white w-[350px] h-[450px] flex flex-col gap-4 rounded-lg shadow-lg p-6 max-w-md'>
        <h1 className='text-xl text-gray-800'>Manage categories</h1>
        <div className='w-full flex items-center gap-2'>
            <input value={category} onChange={(e)=>setCategory(e.target.value)} type="text" placeholder='Enter category' className='border rounded w-full p-2 text-sm focus:border-theme-medium outline-none' />
            {
                categoryToEdit === null ?
                <button disabled={loading} onClick={()=>handleAddCategory()} className=' bg-theme-medium hover:bg-theme-light rounded px-3 text-white h-full'>
                {
                    loading ? <LoadingProcess /> : "Add"
                }
                 </button>
                 :
                 <button disabled={loading} onClick={()=>handleUpdate()} className=' bg-theme-medium hover:bg-theme-light rounded px-3 text-white h-full'>
                {
                    loading ? <LoadingProcess /> : "Update"
                }
                </button>
            }
        </div>
        <div className='flex-1 flex flex-col gap-2 items-start overflow-y-auto'>
        {
            categoryList?.sort((a,b)=> new Date(b.created_at) - new Date(a.created_at)).map((category)=>{
                return (
                    <div key={category.id} className='border-b w-full text-start flex items-center justify-between'>
                        <button onClick={()=>handleEdit(category)} className='text-gray-600 w-full hover:bg-gray-50 text-start font-medium text-sm p-2'>{category.category_name}</button>
                        {
                            categoryToEdit?.id === category.id ? 
                            <button onClick={()=>{setCategoryToEdit(null);setCategory('')}} className='text-sm text-gray-700'>
                                Cancel
                            </button>
                            :
                            <button onClick={()=>deleteCategory(category.id)}>
                                <IoIosRemoveCircle size={20} color='red' />
                            </button>
                        }
                    </div>
                )
            })
        }
        </div>
        <div className='w-full'>
            <button onClick={()=>setIsCategoryModalOpen(false)} className='px-3 py-1 rounded bg-gray-100 text-sm text-gray-800'>Back</button>
        </div>
    </div>
  )
}

export default ManageCategoryModal