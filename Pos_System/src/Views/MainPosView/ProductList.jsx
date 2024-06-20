import React, { useEffect, useState } from 'react'
import ProductProvider from '../../Hooks/ProductProvider'
import productStore from '../../Store/ProductStore'
import emptyImage from '../../MainUtilities/EmptyImage/empty-image.png'
import orderStore from '../../Store/OrderStore'
import OrderItemsProvider from '../../Hooks/OrderItemsProvider'
import orderListStore from '../../Store/OrderListStore'
import { FaCircleMinus } from "react-icons/fa6";
import { FaCirclePlus } from "react-icons/fa6";

const ProductList = (props) => {
    const {selectedCategory, searchValue} = props
    const {orders, insertOrder} = orderStore() //Single Order in the billing
    const {orderItems, insertOrders} = orderListStore() //All order lists
    const {getProducts} = ProductProvider()
    const {getOrders} = OrderItemsProvider()
    const {productList, insertProduct} = productStore()
    const [staticProducts, setStaticProducts] = useState([])
    const [products, setProducts] = useState([])

    const handleSearch = (value) => {
        const newProducts = [...staticProducts]
        const result = newProducts.filter((product)=> product.product_name.toLowerCase().includes(value.toLowerCase()))
        return result
    }

    useEffect(()=>{
        const updatedProducts = productList?.map((product)=>{
            return {...product, activePrice : product.product_price ? product.product_price : product.variations[0].variation_price,
                selectedVariant : product.variations.length !== 0 ? product.variations[0].variation_name : ''
            }
        })
        setProducts(updatedProducts)
        setStaticProducts(updatedProducts)
    },[productList])

    useEffect(()=>{
            const searchResult = handleSearch(searchValue)
            const filtered = selectedCategory ? searchResult.filter((product)=> product.category.id == selectedCategory) : searchResult
            setProducts(filtered)
    },[selectedCategory, staticProducts, searchValue])

    const addToBilling = (product) => {
            const newOrder = [...orders.orderList]
            const duplicateIndex = newOrder.findIndex((order)=> order.order_product_id === product.id && order.order_product_variant === product.selectedVariant)

            if(duplicateIndex !== -1)
            {
                const data = {
                    order_id_number : newOrder[duplicateIndex].order_id_number, 
                    order_product_id : product.id,
                    order_product_name : product.product_name,
                    order_product_category_name : product.category.category_name,
                    order_product_variant : product.selectedVariant,
                    order_product_original_price : product.activePrice,
                    order_product_note : '',
                    order_product_price : Number(product.activePrice) + Number(newOrder[duplicateIndex].order_product_price),
                    order_qty: Number(newOrder[duplicateIndex].order_qty) + 1,
    
                }
                newOrder.splice(duplicateIndex, 1, data)
                insertOrder({...orders, orderList : newOrder})
                return
            }
            else
            {
                const data = {
                    order_id_number : Math.floor(Math.random() * (9999999 - 1000000) + 1000000),
                    order_product_id : product.id,
                    order_product_name : product.product_name,
                    order_product_category_name : product.category.category_name,
                    order_product_variant : product.selectedVariant,
                    order_product_original_price : product.activePrice,
                    order_product_note : '',
                    order_product_price : product.activePrice,
                    order_qty: 1,
    
                }
                insertOrder({...orders, orderList : [...orders.orderList, data]})
                return
            }


    }

    const incrementQty = (productId, selectedVariant) => {
        const newOrders = [...orders.orderList]
        const index = newOrders.findIndex((order)=> order.order_product_id === productId && order.order_product_variant === selectedVariant)
        newOrders[index].order_qty = Number(newOrders[index].order_qty) + 1
        newOrders[index].order_product_price = Number(newOrders[index].order_product_price) + Number(newOrders[index].order_product_original_price)
        insertOrder({...orders, orderList : newOrders})
    }

    const decrementQty = (productId, selectedVariant) => {
        const newOrders = [...orders.orderList]
        const index = newOrders.findIndex((order)=> order.order_product_id === productId && order.order_product_variant === selectedVariant)
        if(newOrders[index].order_qty === 1)
        {
            newOrders.splice(index, 1)
            insertOrder({...orders, orderList : newOrders})
            return
        }
        newOrders[index].order_qty = Number(newOrders[index].order_qty) - 1
        newOrders[index].order_product_price = Number(newOrders[index].order_product_price) - Number(newOrders[index].order_product_original_price)
        insertOrder({...orders, orderList : newOrders})
    }

    // console.log(orders.orderList)

  return (
    <div className=' w-full gap-3 semiSm:grid-cols-2 grid lg:grid-cols-3 xl:grid-cols-4'>
    {
        products?.map((product, index)=>{

            const selectVariant = (price,name, productIndex) => {
                const newProduct = [...products]
                newProduct[productIndex].activePrice = price
                newProduct[productIndex].selectedVariant = name
                setProducts(newProduct)
            }
            const isSelected = orders.orderList.some((order)=> order.order_product_id === product.id && order.order_product_variant === product.selectedVariant)
            const amount = orders.orderList.find((order)=> order.order_product_id === product.id && order.order_product_variant === product.selectedVariant)?.order_qty

            return (
                <div key={product.id} className='w-full border border-gray-100 h-[240px] semiSm:h-[200px] lg:h-[237px] bg-white flex flex-col p-2 rounded shadow-sm'>
                    {/* Top Part */}
                    <div className='flex gap-2'>
                        {/* Image Container */}
                        <div className='w-24 h-24 semiSm:w-16 semiSm:h-16 lg:w-24 lg:h-24 flex-none rounded overflow-hidden object-cover '>
                            <img className='w-full h-full object-cover' src={product.product_image ? product.product_image : emptyImage} alt={product.product_name} />
                        </div>
                        {/* Product Details */}
                        <div className='flex-1 flex flex-col overflow-hidden justify-between'>
                            <div>
                            <h1 className='text-black font-extrabold text-sm semiSm:text-xs lg:text-sm line-clamp-2 overflow-hidden text-ellipsis '>{product.product_name}</h1>
                            <h1 className='text-gray-700 whitespace-nowrap font-medium text-xs lg:text-xs line-clamp-2 overflow-hidden text-ellipsis '>({product.category.category_name})</h1>
                            </div>
                            {/* Price */}
                            <div>
                            <h1 className='text-black font-extrabold text-xs lg:text-sm line-clamp-2 overflow-hidden text-ellipsis '>₱{product.activePrice}</h1>
                            </div>

                        </div>
                    </div>
                    {/* Bottom Part */}
                    <div className='w-full flex flex-col justify-between pt-3 h-full'>
                        {/* Variations */}
                        <div>
                        <p className={`text-gray-700 ${product.variations.length === 0 && 'hidden'} font-extrabold text-xs`}>Variants</p>
                        <div className={`noScrollBar w-full overflow-auto flex gap-3 justify-start pt-1`}>
                        {
                        product.variations?.map((variation)=>{
                            return (
                                <button className={`px-2 lg:px-3 text-xs semiSm:text-[0.65rem] lg:text-xs ${product.selectedVariant === variation.variation_name ? 'bg-[#f4e8e148] text-theme-medium border-[1.5px] border-theme-medium font-bold' : 'bg-gray-100'} py-1 rounded`} onClick={()=>{selectVariant(variation.variation_price,variation.variation_name, index)}} key={variation.id}>
                                    {variation.variation_name}
                                </button>
                            )
                        })
                        }
                        </div>
                        </div>
                        {/* Add to bill button */}
                        <div className='w-full flex'>
                            {
                                isSelected ?
                                <div className='w-full'>
                                {/* <h6 className='text-xs mb-1 text-gray-800'>Amount</h6> */}
                                <div className='w-full bg-theme-extraLight py-1.5 px-2 rounded-full flex items-center justify-between'>
                                    <button onClick={()=>decrementQty(product.id, product.selectedVariant)}><FaCircleMinus size={25} color='#A67B5B' /></button>
                                    <h6 className='text-sm'>{amount}</h6>
                                    <button onClick={()=>incrementQty(product.id, product.selectedVariant)}><FaCirclePlus size={25} color='#A67B5B' /></button>
                                </div>
                                </div>
                                :
                                <button onClick={()=>addToBilling(product)} className='text-xs lg:text-sm text-center w-full bg-theme-medium py-2 rounded text-white'>Add to Billing</button>
                            }
                        </div>
                    </div>
                </div>
            )
        })
    }
    </div>
  )
}

export default ProductList