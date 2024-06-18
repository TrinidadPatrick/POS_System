import React, { useEffect, useState } from 'react'
import http from '../../http'
import CustomerChart from './CustomerChart'
import SalesChart from './SalesChart'
import SummaryBoxes from './SummaryBoxes'

const Reports = () => {
  const [customers, setCustomers] = useState([])

  const fetchCustomerReport = async () => {
    try {
      const result = await http.get('getCustomerReport')
      setCustomers(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    fetchCustomerReport()
  },[])

  return (
    <div className='flex-1 flex flex-col h-full bg-gray-50 gap-3 p-5'>
      
      <div className='flex flex-col semiMd:flex-row space-x-2 justify-evenly'>
        {/* Summary Box */}
      <div className='w-[500px] h-full'>
        <SummaryBoxes />
      </div>
      <div className='flex-1 p-2 shadow rounded '>
        <SalesChart customers={customers} />
      </div>
      </div>

      <div className='w-full p-2 shadow rounded'>
        <CustomerChart customers={customers} />
      </div>

    </div>
  )
}

export default Reports