import React from 'react'

const SummaryBoxes = () => {
  return (
    <div className='h-full grid grid-cols-2 gap-2'>
        <div className='bg-gray-100'>Sales</div>
        <div className='bg-gray-100'>Product Sold</div>
        <div className='bg-gray-100'>Customer</div>
        <div className='bg-gray-100'></div>
    </div>
  )
}

export default SummaryBoxes