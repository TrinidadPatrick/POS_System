import React from 'react'
import http from '../http'

const OrderItemsProvider = () => {

    const getOrders = async () => {
        try {
            const result = await http.get('order')
            return(result.data.data)
        } catch (error) {
            console.log(error)
        }
    }

  return {
    getOrders
  }
}

export default OrderItemsProvider