import React, { useState } from 'react'
import expenseStore from '../../Store/ExpenseStore'
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import LoadingProcess from '../../MainUtilities/Loader/LoadingProcess';
import http from '../../http';

const ExpenseTable = ({expenses, setExpenses}) => {
    const [loading, setLoading] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState(null)

    const submitUpdate = async () => {
        if(itemToEdit.item_name && itemToEdit.item_price)
        {   
            const newExpenses = [...expenses]
            const index = expenses.findIndex((expense) => expense.id === itemToEdit.id)
            newExpenses.splice(index, 1, itemToEdit)
            setExpenses(newExpenses)
            setEditModalOpen(false)
            setItemToEdit(null)
            try {
                const result = await http.patch(`expense/${itemToEdit.id}`, itemToEdit)
            } catch (error) {
                console.log(error)
            }
        }
    }

    const deleteItem = async (id) => {
        const newExpenses = [...expenses]
        const index = newExpenses.findIndex((expense)=> expense.id === id)
        newExpenses.splice(index, 1)
        setExpenses(newExpenses)

        try {
            const result = await http.delete(`expense/${id}`)
        } catch (error) {
            console.log(error)
        }
        
    }


  return (
    <div className='w-fit h-full overflow-auto rounded shadow scrollBar bg-white py-5 '>
        <table className=''>
            <thead>
                <tr>
                    <td className='w-[150px] text-center font-bold text-gray-800 pb-5 '>Expense Number</td>
                    <td className='text-center w-[250px] font-bold text-gray-800'>Item name</td>
                    <td className='text-center w-[150px] font-bold text-gray-800'>Item price</td>
                    <td className='text-center w-[200px] font-bold text-gray-800'>Date</td>
                    <td className='text-center w-[200px] font-bold text-gray-800'>Action</td>
                </tr>
            </thead>
            <tbody>
                {
                    expenses?.map((expense, index)=>{
                        const dateCreated = new Date(expense.created_at).toLocaleDateString('EN-US', {
                            month : 'long',
                            day : '2-digit',
                            year : 'numeric'
                        })
                        return (
                            <tr key={index} className='border-b'>
                                <td className='text-center py-5'>
                                    <p className=''>{expense.id}</p>
                                </td>
                                <td className='text-center'>
                                    <p>{expense.item_name}</p>
                                </td>
                                <td className='text-center'>
                                    <p>{Number(expense.item_price)}</p>
                                </td>
                                <td className='text-center'>
                                    <p>{dateCreated}</p>
                                </td>
                                <td className='text-center'>
                                    <div className='flex justify-center gap-2'>
                                    <button onClick={()=>{setEditModalOpen(true);setItemToEdit(expense)}} className='px-2 py-1 bg-theme-semiLight text-white rounded-sm'>Edit</button>
                                    <button onClick={()=>deleteItem(expense.id)} className='px-2 py-1 bg-gray-100 text-red-500 rounded-sm'>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>

        <Modal open={editModalOpen} styles={{modal : {borderRadius : 5}}} onClose={()=>{setEditModalOpen(false);setItemToEdit(null)}} center>
        <div className='w-[200px] h-[200px] flex flex-col'>
            <div>
                <h5>Add expense</h5>
            </div>
            <div className='flex-1 flex flex-col gap-3 py-2'>
                <div className='flex flex-col'>
                    <label className='font-extrabold text-gray-800'>Item name</label>
                    <input maxLength={150} value={itemToEdit?.item_name || ''} onChange={(e)=>setItemToEdit({...itemToEdit, item_name : e.target.value})} type='text' className='p-2 outline-none border border-gray-200 shadow-sm rounded' />
                </div>
                <div className='flex flex-col'>
                    <label className='font-extrabold text-gray-800'>Item price</label>
                    <input maxLength={7} value={itemToEdit?.item_price || ''} onChange={(e)=>setItemToEdit({...itemToEdit, item_price : e.target.value.replace(/[^0-9]/g, '')})} type='text' className='p-2 outline-none border border-gray-200 shadow-sm rounded' />
                </div>
                <button onClick={()=>submitUpdate()} className='px-5 text-white h-[35px] flex justify-center items-center rounded-sm bg-theme-medium'>
                    {loading ? <LoadingProcess /> : "Submit"}
                </button>
            </div>
        </div>
        </Modal>
    </div>
  )
}

export default ExpenseTable