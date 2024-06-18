import React, { useState } from 'react'
import { IoAdd } from "react-icons/io5";
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import AddExpenseModal from './AddExpenseModal';

const Expense = () => {
  const [expenseData, setExpenseData] = useState({
    item_name : '',
    item_price : '',
  })
  const [open, setOpen] = useState(false);

  // value={expenseData.item_name} onChange={(e)=>setExpenseData({...expenseData, item_name : e.target.value})}
  return (
    <div className='flex-1 flex flex-col p-5'>
      <h4>Expense Manager</h4>
      {/* Header */}
      <nav className='flex flex-col gap-3 mt-5'>
        <button onClick={()=>setOpen(true)} className='px-3 py-2 w-fit bg-theme-medium text-white rounded-sm flex gap-1 items-center'>
          <IoAdd size={20} />
          Add expense
        </button>
        <div className='flex gap-5 h-full items-end'>
          {/* Item */}
          <div className='flex flex-col'>
            <label className='font-extrabold text-gray-800'>Item name</label>
            <input type='text' placeholder='Search expense' className='p-2 outline-none border border-gray-200 shadow-sm rounded' />
          </div>
          {/* Date from */}
          <div className='flex flex-col'>
            <label className='font-extrabold text-gray-800'>Date From</label>
            <input type='date' className='p-2 outline-none border border-gray-200 shadow-sm rounded' />
          </div>
          {/* Date To */}
          <div className='flex flex-col'>
            <label className='font-extrabold text-gray-800'>Date To</label>
            <input type='date' className='p-2 outline-none border border-gray-200 shadow-sm rounded' />
          </div>
          {/* Submit */}
          <button className='px-5 text-white py-[0.59rem] rounded-sm h-fit bg-theme-medium'>Search</button>
        </div>

      </nav>

      <Modal open={open} styles={{modal : {borderRadius : 5}}} onClose={()=>setOpen(false)} center>
        <AddExpenseModal />
      </Modal>
    </div>
  )
}

export default Expense