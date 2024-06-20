import React from 'react'
import reportStore from '../../Store/ReportsStore'
import { MdOutlineShoppingCart } from "react-icons/md";
import { CiReceipt } from "react-icons/ci";

const SummaryBoxes = () => {
  const {report} = reportStore()

  return (
    <div className='h-full grid grid-cols-2 gap-2'>
        <div className='bg-white shadow-sm rounded flex'>
          <div className='h-full flex flex-col justify-center  ps-5 pe-3'>
            <MdOutlineShoppingCart size={35} />
          </div>
          <div className='flex-1 flex flex-col justify-center items-start'>
            <h6 className="font-medium text-gray-800">Net Sales</h6>
            <p className='text-lg font-extrabold'>{report.net_sales}</p>
          </div>
        </div>
        <div className='bg-white shadow-sm rounded flex'>
          <div className='h-full flex flex-col justify-center ps-5 pe-3'>
            <CiReceipt size={35} />
          </div>
          <div className='flex-1 flex flex-col justify-center items-start'>
            <h6 className="font-medium text-gray-800">Expense</h6>
            <p className='text-lg font-extrabold'>{Number(report.expense)}</p>
          </div>
        </div>
        <div className='bg-white  shadow-sm rounded flex'>
          <div className='h-full flex flex-col justify-center ps-5 pe-3'>
            <svg xmlns="http://www.w3.org/2000/svg" width="2.2em" height="2.2em" viewBox="0 0 2048 2048"><path fill="rgba(31, 41, 53, 0.8)" d="m960 120l832 416v1040l-832 415l-832-415V536zm625 456L960 264L719 384l621 314zM960 888l238-118l-622-314l-241 120zM256 680v816l640 320v-816zm768 1136l640-320V680l-640 320z"/></svg>
          </div>
          <div className='flex-1 flex flex-col justify-center items-start'>
            <h6 className="font-medium text-gray-800">Product Sold</h6>
            <p className='text-lg font-extrabold'>{report.product_sold}</p>
          </div>
        </div>
        <div className='bg-white shadow-sm rounded flex'>
          <div className='h-full flex flex-col justify-center ps-5 pe-3'>
          <svg xmlns="http://www.w3.org/2000/svg" width="2.2em" height="2.2em" viewBox="0 0 24 24"><path fill="none" stroke="rgba(31, 41, 53, 0.8)" strokeWidth="2" d="M16 16c0-1.105-3.134-2-7-2s-7 .895-7 2s3.134 2 7 2s7-.895 7-2ZM2 16v4.937C2 22.077 5.134 23 9 23s7-.924 7-2.063V16M9 5c-4.418 0-8 .895-8 2s3.582 2 8 2M1 7v5c0 1.013 3.582 2 8 2M23 4c0-1.105-3.1-2-6.923-2s-6.923.895-6.923 2s3.1 2 6.923 2S23 5.105 23 4Zm-7 12c3.824 0 7-.987 7-2V4M9.154 4v10.166M9 9c0 1.013 3.253 2 7.077 2S23 10.013 23 9"/></svg>
          </div>
          <div className='flex-1 flex flex-col justify-center items-start'>
            <h6 className="font-medium text-gray-800">Profit</h6>
            <p className='text-lg font-extrabold'>{report.profit}</p>
          </div>
        </div>
    </div>
  )
}

export default SummaryBoxes