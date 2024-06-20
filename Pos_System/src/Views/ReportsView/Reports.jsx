import React, { useEffect, useState } from 'react'
import http from '../../http'
import CustomerChart from './CustomerChart'
import SalesChart from './SalesChart'
import SummaryBoxes from './SummaryBoxes'
import reportStore from '../../Store/ReportsStore'
import TransactionHistoryTable from './TransactionHistoryTable'

const Reports = () => {
  const {insertReport} = reportStore()
  const [reports, setReports] = useState({
    yearReport : [],
    expense : '',
    net_sales : '',
    product_sold : '',
    profit : ''

  })

  const fetchReports = async () => {
    try {
      const result = await http.get('getReports')
      insertReport(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const filterReport = async (dateFilter) => {
    try {
      const result = await http.get(`filterReports?date=${dateFilter}`)
      insertReport(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    fetchReports()
  },[])

  return (
    <div className='flex-1 flex flex-col overflow-y-scroll h-full bg-[#f9f9f9] gap-3 p-5'>
      <div className='w-full flex justify-between'>
        <h5 className='text-gray-800 font-extrabold'>Sales Report</h5>
        <div className='flex gap-2 items-center'>
          <label className='font-mediumo'>Filter by:</label>
        <input type='date' onChange={(e)=>filterReport(e.target.value)} className='border py-1 px-2 rounded-sm shadow-sm' />
        </div>
      </div>
      <div className='flex max-h-[200px] h-[200px] flex-col semiMd:flex-row space-x-2 justify-evenly'>
        {/* Summary Box */}
      <div className='w-[500px] h-full'>
        <SummaryBoxes />
      </div>
      <div className='flex-1 p-2 shadow rounded bg-white '>
        <SalesChart />
      </div>
      </div>

      <div className='w-full p-2 shadow rounded bg-white'>
        <CustomerChart />
      </div>

      {/* History table */}
      <div className='w-full flex bg-white rounded shadow'>
        <TransactionHistoryTable />
      </div>

    </div>
  )
}

export default Reports