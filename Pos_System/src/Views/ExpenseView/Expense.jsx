import React, { useEffect, useState } from 'react'
import { IoAdd } from "react-icons/io5";
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import AddExpenseModal from './AddExpenseModal';
import ExpenseProvider from '../../Hooks/ExpenseProvider';
import expenseStore from '../../Store/ExpenseStore';
import ExpenseTable from './ExpenseTable';
import http from '../../http';

const Expense = () => {
  const {insertExpense, expenseList} = expenseStore()
  const [open, setOpen] = useState(false);
  const {getExpenses} = ExpenseProvider()
  const [filterValue, setFilterValue] = useState({
    item_name : '',
    start_date : '',
    end_date : ''
  })
  const [expenses, setExpenses] = useState([])

  const fetchExpense = async () => {
    const expenses = await getExpenses()
    insertExpense(expenses)
  }
  
  useEffect(()=>{
    setExpenses(expenseList)
  },[expenseList])

  useEffect(()=>{
    fetchExpense()
  },[])

  const submitFilter = async () => {
    try {
      const result = await http.get(`filterExpense?start_date=${filterValue.start_date}&end_date=${filterValue.end_date}&search=${filterValue.item_name}`)
      setExpenses(result.data.expenses)
  } catch (error) {
      console.log(error)
  }
  }

  return (
    <div className='flex-1 flex flex-col p-5 bg-gray-50'>
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
            <input value={filterValue.item_name} onChange={(e)=>setFilterValue({...filterValue, item_name : e.target.value})} type='text' placeholder='Search expense' className='p-2 outline-none border border-gray-200 shadow-sm rounded' />
          </div>
          {/* Date from */}
          <div className='flex flex-col'>
            <label className='font-extrabold text-gray-800'>Date From</label>
            <input value={filterValue.start_date} onChange={(e)=>setFilterValue({...filterValue, start_date : e.target.value})} type='date' className='p-2 outline-none border border-gray-200 shadow-sm rounded' />
          </div>
          {/* Date To */}
          <div className='flex flex-col'>
            <label className='font-extrabold text-gray-800'>Date To</label>
            <input value={filterValue.end_date} onChange={(e)=>setFilterValue({...filterValue, end_date : e.target.value})}  type='date' className='p-2 outline-none border border-gray-200 shadow-sm rounded' />
          </div>
          {/* Submit */}
          <button onClick={()=>submitFilter()} className='px-5 hover:bg-theme-semiLight text-white py-[0.59rem] rounded-sm h-fit bg-theme-medium'>Search</button>
        </div>

      </nav>

      {/* Expense Table */}
      <div className='flex-1 flex flex-col mt-5'>
        <ExpenseTable expenses={expenses} setExpenses={setExpenses} />
      </div>

      <Modal open={open} styles={{modal : {borderRadius : 5}}} onClose={()=>setOpen(false)} center>
        <AddExpenseModal setOpen={setOpen} />
      </Modal>
    </div>
  )
}

export default Expense