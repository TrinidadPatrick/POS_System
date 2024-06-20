import React, { useState } from 'react'
import http from '../../http'
import expenseStore from '../../Store/ExpenseStore'
import LoadingProcess from '../../MainUtilities/Loader/LoadingProcess'

const AddExpenseModal = ({setOpen}) => {
    const {expenseList, insertExpense} = expenseStore()
    const [expenseData, setExpenseData] = useState({
        item_name : '',
        item_price : '',
        created_at : new Date()
    })
    const [loading, setLoading] = useState(false)

    const submit = async () => {
        if(expenseData.item_name && expenseData.item_price)
        {
            setLoading(true)
            try {
                const result = await http.post('expense', expenseData)
                insertExpense([...expenseList, result.data.expense])
                setOpen(false)
                setLoading(false)
            } catch (error) {
                console.log(error)
            }
        }
    }

  return (
    <div className='w-[200px] h-[200px] flex flex-col'>
        <div>
            <h5>Add expense</h5>
        </div>
        <div className='flex-1 flex flex-col gap-3 py-2'>
            <div className='flex flex-col'>
                <label className='font-extrabold text-gray-800'>Item name</label>
                <input maxLength={150} value={expenseData.item_name} onChange={(e)=>setExpenseData({...expenseData, item_name : e.target.value})} type='text' className='p-2 outline-none border border-gray-200 shadow-sm rounded' />
            </div>
            <div className='flex flex-col'>
                <label className='font-extrabold text-gray-800'>Item price</label>
                <input maxLength={7} value={expenseData.item_price} onChange={(e)=>setExpenseData({...expenseData, item_price : e.target.value.replace(/[^0-9]/g, '')})} type='text' className='p-2 outline-none border border-gray-200 shadow-sm rounded' />
            </div>
            <button onClick={()=>submit()} className='px-5 text-white h-[35px] flex justify-center items-center rounded-sm bg-theme-medium'>
                {loading ? <LoadingProcess /> : "Submit"}
            </button>
        </div>
    </div>
  )
}

export default AddExpenseModal