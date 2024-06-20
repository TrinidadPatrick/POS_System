import React, { useEffect, useState } from 'react'
import { FaClipboardList } from "react-icons/fa";
import orderStore from '../../Store/OrderStore'
import OrderList from './OrderList'
import http from '../../http'
import OrderListModal from './OrderListModal';
import 'react-responsive-modal/styles.css';
import Modal from 'react-modal';
import WindowSizeProvider from '../../Hooks/WindowSizeProvider';
import orderListStore from '../../Store/OrderListStore';


const RightView = () => {
    const {width} = WindowSizeProvider()
    const {orders, insertOrder} = orderStore()
    const {orderItems, insertOrders} = orderListStore()
    const [amount, setAmount] = useState(0)
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
    const total = orders?.orderList?.reduce((acc, value) => acc + Number(value.order_product_price), 0)
    const change = Number(amount) - Number(total)

    const modalStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: `${width <= 900 ? width - 100+'px' : '860px'}`, // Adjust the width
            // maxWidth: '1000px', // Max width for larger screens
            height: 'auto', // Adjust the height
            overflow : 'hidden',
            padding : 0
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
    };

    const submitOrder = async () => {
        if(orders.orderList.length !== 0)
        {
            const data = {
                customer_name : orders.customer_name,
                order_number : Math.floor(Math.random() * (9999999 - 1000000) + 1000000),
                order_items : orders.orderList,
                total_price : orders.orderList.reduce((acc, value) => acc + Number(value.order_product_price), 0).toFixed(2),
                amount_paid : Number(amount),
                order_status : "PENDING",
                created_at: new Date()
            }
            insertOrder({customer_name : '', orderList : []})
            setAmount(0)

            try {
                const result = await http.post('order', data)
                insertOrders([...orderItems, result.data.order])
            } catch (error) {
                console.log(error)
            }
        }
    }



  return (
    <div className='w-[250px] md:w-[260px] xl:w-[330px] px-3 overflow-hidden rounded shadow pt-5 pb-3 flex flex-col h-full bg-white'>
        {/* Top Part */}
        <div className='w-full flex items-center justify-between'>
            <h5 className='text-gray-800'>Order Details</h5>
            <button onClick={()=>setIsOrderModalOpen(true)} className='p-1.5 bg-theme-medium rounded relative'>
                {orderItems?.filter((item)=> item.order_status === "PENDING").length !== 0 && <span className='-left-1 -top-1 absolute w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-xs text-white'>{orderItems?.filter((item)=> item.order_status === "PENDING").length}</span>}
                <FaClipboardList size={20} color='white' />
            </button>
        </div>
        {/* Customer Name */}
        <div className='flex flex-col mt-5 gap-2'>
            <h6 className='text-gray-800 text-sm font-extrabold'>Customer Name</h6>
            <input value={orders.customer_name} onChange={(e)=>{insertOrder({...orders, customer_name : e.target.value})}} type="text" placeholder='Customer Name' className='p-2 w-full border outline-none focus:border-theme-medium border-gray-200 rounded' />
        </div>

        {/* Orders */}
        <div className=' overflow-auto flex-1 flex border-t border-gray-200 mt-5 '>
            <OrderList />
        </div>

        {/* Total and SubTotal */}
        <div className='flex flex-col gap-3 pt-3 border-t-2 border-dashed'>
            {/* Total */}
            <div>
            <div className='flex items-center justify-between'>
                <p className='font-extrabold'>Total</p>
                <p className='font-extrabold'>₱{total}</p>
            </div>
            {/* Change */}
            <div className='flex items-center justify-between'>
                <p className='font-extrabold'>Change</p>
                <p className='font-extrabold'>₱{change}</p>
            </div>
            </div>
            {/* Amount Input */}
            <div className='w-full'>
                <input onKeyDown={(e)=>{if(e.key === "Enter" && change >= 0 && orders.orderList.length !== 0){submitOrder()}}} value={amount === 0 ? '' : amount} onChange={(e)=>{setAmount(e.target.value.replace(/[^0-9]/g, ''))}} type="text" className='p-2 border border-gray-200 rounded outline-none w-full' placeholder='Amount' />
            </div>
            {/* Button */}
            <div className='w-full'>
                <button onClick={()=>submitOrder()} disabled={change < 0 || orders.orderList.length === 0} className='w-full hover:bg-theme-semiLight py-1.5 bg-theme-medium text-white rounded'>
                    Submit
                </button>
            </div>
        </div>

        <Modal ariaHideApp={false} style={modalStyles} isOpen={isOrderModalOpen} >
            <div className='p-3 flex flex-col items-end bg-white'>
            <OrderListModal setIsOrderModalOpen={setIsOrderModalOpen} />
            <button onClick={()=>setIsOrderModalOpen(false)} className='px-2 py-1 bg-gray-100 text-gray-700 mt-2'>
                Cancel
            </button>
            </div>
        </Modal>
    </div>
  )
}

export default RightView