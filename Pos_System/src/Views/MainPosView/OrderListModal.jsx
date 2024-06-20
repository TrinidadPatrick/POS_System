import React, { useEffect, useState } from 'react'
import orderListStore from '../../Store/OrderListStore'
import http from '../../http'
import WindowSizeProvider from '../../Hooks/WindowSizeProvider'

const OrderListModal = ({setIsOrderModalOpen}) => {
    const {width, height} = WindowSizeProvider()
    const {orderItems, insertOrders} = orderListStore()

    const handleFinish = async (order_number) => {
        const newOrderItems = [...orderItems]
        const index = newOrderItems.findIndex((item)=> item.order_number === order_number)
        newOrderItems[index].order_status = "COMPLETE"
        insertOrders(newOrderItems)

        try {
            const result = await http.patch(`order/${newOrderItems[index].id}`, JSON.stringify({order_status : 'COMPLETE'}))
        } catch (error) {
            console.log(error)
        }
    }

    const handleCancel = async (order_number) => {
        const newOrderItems = [...orderItems]
        const index = newOrderItems.findIndex((item)=> item.order_number === order_number)
        newOrderItems[index].order_status = "CANCELLED"
        insertOrders(newOrderItems)

        try {
            const result = await http.patch(`order/${newOrderItems[index].id}`, JSON.stringify({order_status : 'CANCELLED'}))
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className={`w-full flex flex-col p-0  bg-white  `}>
        {/* TOP */}
        <nav className='flex py-1'>
            <h4>List of orders</h4>
        </nav>

        {/* Order list */}
        <div className='w-full scrollBar overflow-auto px-2'>
            <table className='w-full overflow-auto '>
                <thead className=''>
                    <tr>
                        {/* <td className='text-start'>Order No</td> */}
                        <td className='text-start font-bold whitespace-nowrap text-xs sm:text-sm min-w-[90px] sm:min-w-[120px] w-[120px]'>Customer</td>
                        <td className='text-center font-bold whitespace-nowrap text-xs sm:text-sm min-w-[90px] sm:min-w-[150px] w-[150px]'>Items</td>
                        <td className='text-center font-bold whitespace-nowrap text-xs sm:text-sm min-w-[90px] sm:min-w-[150px] w-[150px]'>Category</td>
                        <td className='text-center font-bold whitespace-nowrap text-xs sm:text-sm min-w-[90px] sm:min-w-[150px] w-[150px]'>Variant</td>
                        <td className='text-center font-bold whitespace-nowrap text-xs sm:text-sm min-w-[90px] sm:min-w-[50px] w-[50px]'>Qty</td>
                        <td className='text-start font-bold whitespace-nowrap '>Total Price</td>
                    </tr>
                </thead>
                {
                    orderItems?.filter((orderItem)=>orderItem.order_status === "PENDING")?.sort((a,b) => new Date(a.created_at) - new Date(b.created_at)).map((order)=>{
                        const total = order.order_items.reduce((acc, value)=> acc + Number(value.order_product_price), 0)
                        return (
                            <tbody key={order.order_number} className='py-3'>
                                <tr>
                                    <td colSpan="6" className="py-2">
                                        <div className=' border-[1px] border-dashed'></div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="6" className="py-0 font-extrabold text-xs">#{order.order_number}</td>
                                </tr>
                                {
                                    order.order_items.map((item, index)=>{
                                        return (
                                            <tr key={index}>
                                            <td className='text-xs sm:text-sm min-w-[90px] sm:min-w-[120px] text-start py-2'>
                                                <p className=''>{order.customer_name || 'Unknown'}</p>
                                            </td>
                                            <td className='text-center overflow-hidden whitespace-nowrap text-ellipsis text-xs sm:text-sm min-w-[90px] sm:min-w-[150px] max-w-[150px]'>
                                                <p>{item.order_product_name}</p>
                                            </td>
                                            <td className='text-center overflow-hidden max-w-[150px] text-xs sm:text-sm min-w-[90px] sm:min-w-[150px] whitespace-nowrap text-ellipsis'>
                                                <p>{item.order_product_category_name}</p>
                                            </td>
                                            <td className='text-center overflow-hidden max-w-[150px] text-xs sm:text-sm min-w-[90px] sm:min-w-[150px] whitespace-nowrap text-ellipsis'>
                                                <p>{item.order_product_variant || 'None'}</p>
                                            </td>
                                            <td className='text-center text-xs sm:text-sm '>
                                                <p>{item.order_qty}x</p>
                                            </td>
                                            <td className={`text-start text-xs sm:text-sm min-w-[90px] sm:min-w-[50px] ${index === order.order_items.length - 1 && 'border-b border-dashed border-gray-400'}`}>
                                                <p>₱{item.order_product_price}</p>
                                            </td>
                                            </tr>
                                        )
                                    })
                                }
                                <tr>
                                    <td colSpan={2} className='text-start py-1'>
                                        <button onClick={()=>handleFinish(order.order_number)} className='text-[0.7rem] hover:bg-theme-light me-1 rounded-sm bg-theme-semiLight text-white px-2 py-1'>Finish</button>
                                        <button onClick={()=>handleCancel(order.order_number)} className='text-[0.7rem] hover:bg-gray-200 rounded-sm bg-gray-100 text-gray-700 px-2 py-1'>Cancel</button>
                                    </td>
                                    <td colSpan={1} className='text-start py-1 '></td>
                                    <td colSpan={1} className='text-start py-1 '></td>
                                    <td colSpan={1} className='text-center text-xs sm:text-sm min-w-[90px] sm:min-w-[150px] py-1 font-bold text-gray-800'>Total:</td>
                                    <td colSpan={1} className='text-start py-1 '>
                                        <div className='w-full flex justify-start'>
                                            <p className='font-bold text-gray-800 text-xs sm:text-sm min-w-[90px] sm:min-w-[70px]'>₱{order.total_price}</p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        )
                    })
                }
            </table>
        </div>
    </div>
  )
}

export default OrderListModal