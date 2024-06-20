import React from 'react'
import reportStore from '../../Store/ReportsStore'

const TransactionHistoryTable = () => {
    const {report} = reportStore()
    const {orderItems} = report

  return (
    <div className='w-full min-h-[400px] max-h-[400px] rounded overflow-auto scrollBar '>
        <table className='w-full'>
            <thead className='bg-theme-medium rounded text-white'>
                <tr className='rounded'>
                    <td><h6 className='font-medium text-center'>Order no.</h6></td>
                    <td><h6 className='font-medium text-center'>Product</h6></td>
                    <td><h6 className='font-medium '>Category</h6></td>
                    <td><h6 className='font-medium '>Variant</h6></td>
                    <td><h6 className='font-medium '>Price</h6></td>
                    <td><h6 className='font-medium text-center py-3'>Quantity</h6></td>
                    <td><h6 className='font-medium text-center'>Total Price</h6></td>
                    <td><h6 className='font-medium text-center'>Status</h6></td>
                    <td><h6 className='font-medium text-center'>Time</h6></td>
                </tr>
            </thead>
            <tbody>
                {
                    orderItems?.map((order, index)=>{
                        const date = new Date(order.created_at).toLocaleTimeString('EN-US', {
                            hour12 : true,
                           hour : '2-digit',
                           minute : '2-digit'
                        })
                        return (
                            <tr key={index} className='border-b'>
                                <td className='max-w-[50px] min-w-[100px] overflow-hidden text-center py-4 '>
                                    <p className='py-2'>{order.order_number}</p>
                                </td>
                                <td className='max-w-[150px] min-w-[150px] overflow-hidden text-center '>
                                    <p className='py-2'>{order.product_name}</p>
                                </td>
                                <td className='max-w-[150px] min-w-[150px] overflow-hidden '>
                                    <p className='py-2'>{order.product_category}</p>
                                </td>
                                <td className='max-w-[150px] min-w-[150px] overflow-hidden '>
                                    <p className='py-2'>{order.product_variant}</p>
                                </td>
                                <td className='max-w-[150px] min-w-[150px] overflow-hidden '>
                                    <p className='py-2'>₱{order.price}</p>
                                </td>
                                <td className='max-w-[150px] min-w-[150px] overflow-hidden text-center'>
                                    <p className='py-2'>{order.order_qty}x</p>
                                </td>
                                <td className='max-w-[150px] min-w-[150px] overflow-hidden text-center'>
                                    <p className='py-2'>₱{order.total_price}</p>
                                </td>
                                <td className={`max-w-[150px] min-w-[150px] ${order.order_status === "CANCELLED" && 'text-red-500'} overflow-hidden text-center`}>
                                    <p className='py-2'>{order.order_status.slice(0,1)+order.order_status.slice(1).toLowerCase()}</p>
                                </td>
                                <td className='max-w-[150px] min-w-[150px] overflow-hidden text-center'>
                                    <p className='py-2'>{date}</p>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    </div>
  )
}

export default TransactionHistoryTable