import React, { useState } from 'react'
import orderStore from '../../Store/OrderStore'
import { SlArrowRight } from "react-icons/sl";

const OrderList = () => {
    const {orders, insertOrder} = orderStore()
    const [expandedOrders, setExpandedOrders] = useState([])

    const handleNoteChange = (value, index) => {
        const newOrder = [...orders.orderList]
        newOrder[index].order_product_note = value
        insertOrder({...orders, orderList : newOrder})


    }

    const handleQtyChange = (value, index) => {
        if(Number(value) <= 0)
        {
            const newOrder = [...orders.orderList]
            newOrder[index].order_qty = 1
            newOrder[index].order_product_price = Number(1) * Number(newOrder[index].order_product_original_price)
            insertOrder({...orders, orderList : newOrder})
            return
        }
        else if(Number(value > 999))
        {
            const newValue = value.pop()
            const newOrder = [...orders.orderList]
            newOrder[index].order_qty = newValue
            newOrder[index].order_product_price = Number(newValue) * Number(newOrder[index].order_product_original_price)
            insertOrder({...orders, orderList : newOrder})
            return
        }
        const newOrder = [...orders.orderList]
        newOrder[index].order_qty = value
        newOrder[index].order_product_price = Number(value) * Number(newOrder[index].order_product_original_price)
        insertOrder({...orders, orderList : newOrder})
    }

    const expand = (id) => {
        const newData = [...expandedOrders]
        const index = newData.findIndex((data)=> data === id)
        if(index !== -1)
        {
            newData.splice(index, 1)
            setExpandedOrders(newData)
            return
        }
        setExpandedOrders([...expandedOrders, id])
    }



  return (
    <div className=' scrollBar flex-1 h-full overflow-auto flex flex-col gap-2 py-3 pe-3 '>
    {
        orders?.orderList?.map((order, index)=>{
            return (
                <div key={index} className={`flex flex-col ${expandedOrders.includes(orders.order_id_number) && 'bg-gray-100'} p-1.5 rounded`}>
                    <div className='flex items-center justify-between'>
                        <div className='flex gap-2 w-full'>
                            <button className={`${expandedOrders.includes(order.order_id_number) ? 'rotate-90' : ''} flex flex-col justify-start transition`} onClick={()=>expand(order.order_id_number)} >
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="none" stroke="#a6a6a6" strokeWidth="2" d="m9 6l6 6l-6 6"/></svg>
                            </button>
                            <div className='flex items-start gap-2 max-w-[240px] pe-5'>
                                <h6 className='text-sm font'>{order.order_qty}x</h6>
                                <div>
                                <h6 className='text-sm whitespace-nowrap overflow-hidden text-ellipsis'>{order.order_product_name}</h6>
                                {order.order_product_variant && <h6 className='text-xs font-normal whitespace-nowrap overflow-hidden text-ellipsis'>({order.order_product_variant})</h6>}
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className='font-extrabold text-[0.72rem]'>₱{order.order_product_price}</p>
                        </div>
                    </div>
                    {/* Dropdown */}
                    {
                        expandedOrders.includes(order.order_id_number) &&
                        <div className='w-full  flex items-center transition ps-7 mt-3 gap-1'>
                            <div className='w-[40%] flex flex-col  '>
                                <h5 className='text-xs'>Qty</h5>
                                <input max="1000" min="0" type='number' onChange={(e)=>handleQtyChange(e.target.value, index)} className='w-full outline-none border border-gray-200 p-1 rounded mt-1' value={order.order_qty} />
                            </div>
                            <div className='w-full  flex flex-col '>
                                <h5 className='text-xs'>Note</h5>
                                <input maxLength={300} onChange={(e)=>handleNoteChange(e.target.value, index)} className='w-full outline-none border border-gray-200 p-1 rounded mt-1' value={order.order_product_note} />
                            </div>
                        </div>
                    }
                </div>
            )
        })
    }
    </div>
  )
}

export default OrderList