import React, { useEffect, useState } from 'react'
import orderListStore from '../../Store/OrderListStore'
import http from '../../http'
import WindowSizeProvider from '../../Hooks/WindowSizeProvider'
import { FaNoteSticky } from "react-icons/fa6";

const OrderListModal = ({setIsOrderModalOpen}) => {
    const {width, height} = WindowSizeProvider()
    const {orderItems, insertOrders} = orderListStore()
    const [noteBoxOpen, setNoteBoxOpen] = useState(false)
    const [note, setNote] = useState({
        product : '',
        note : ''
    })

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
        {/* Note box */}
        {
            noteBoxOpen &&
            <div onClick={()=>{setNoteBoxOpen(false);setNote({ product : '',note : ''})}} style={{backgroundColor : 'rgba(0,0,0,0.6)'}} className='absolute cursor-pointer w-full h-full z-20 flex items-center justify-center'>
                <div className='w-[90%] md:w-[50%] h-[70%] bg-theme-medium rounded border shadow flex flex-col p-3 gap-3'>
                    <h5 className='text-white'>Order note for {note.product}</h5>

                    <div className='flex-1 border rounded bg-[#f9f9f9] p-2 overflow-auto'>
                        {note.note}
                    </div>
                </div>
            </div>
        }
        {/* TOP */}
        <nav className='flex py-1 px-2 bg-white mb-2'>
            <h4 className='text-gray-700'>List of orders</h4>
        </nav>

        {/* Order list */}
        <div className='w-full scrollBar overflow-auto px-2 m-2'>
        {
            orderItems.length === 0 ?
            <div className='w-full flex flex-col h-[200px] justify-center items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" width="5em" height="5em" viewBox="0 0 24 24"><path fill="#a6a6a6" fill-opacity="0" d="M17 14V17a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V14z"><animate fill="freeze" attributeName="fill-opacity" begin="0.8s" dur="0.15s" values="0;0.3"/></path><g fill="none" stroke="#a6a6a6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="48" stroke-dashoffset="48" d="M17 9v9a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V9z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="48;0"/></path><path stroke-dasharray="14" stroke-dashoffset="14" d="M17 14H20C20.55 14 21 13.55 21 13V10C21 9.45 20.55 9 20 9H17"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="14;28"/></path></g><mask id="lineMdCoffeeHalfEmptyTwotoneLoop0"><path fill="none" stroke="#fff" stroke-width="2" d="M8 0c0 2-2 2-2 4s2 2 2 4-2 2-2 4 2 2 2 4M12 0c0 2-2 2-2 4s2 2 2 4-2 2-2 4 2 2 2 4M16 0c0 2-2 2-2 4s2 2 2 4-2 2-2 4 2 2 2 4"><animateMotion calcMode="linear" dur="3s" path="M0 0v-8" repeatCount="indefinite"/></path></mask><rect width="24" height="0" y="7" fill="#a6a6a6" mask="url(#lineMdCoffeeHalfEmptyTwotoneLoop0)"><animate fill="freeze" attributeName="y" begin="0.8s" dur="0.6s" values="7;2"/><animate fill="freeze" attributeName="height" begin="0.8s" dur="0.6s" values="0;5"/></rect></svg>
                <h3 className='text-gray-500 font-normal'>There are current no orders.</h3>
            </div>
            :
            <table className='w-full overflow-auto relative '>
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
                                            <td className='text-xs flex gap-2 sm:text-sm min-w-[90px] sm:min-w-[120px] text-start py-2'>
                                                <p className=''>{order.customer_name || 'Unknown'}</p>
                                                {
                                                    item.order_product_note && <button onClick={()=>{setNoteBoxOpen(true);setNote({note : item.order_product_note, product : item.order_product_name})}}><FaNoteSticky color='#00FF00' /></button>
                                                }
                                            </td>
                                            <td className='text-center relative   whitespace-nowrap text-ellipsis text-xs sm:text-sm min-w-[90px] sm:min-w-[150px] max-w-[150px]'>
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
        }
        </div>
    </div>
  )
}

export default OrderListModal