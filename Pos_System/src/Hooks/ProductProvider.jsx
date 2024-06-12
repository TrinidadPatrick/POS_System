import React from 'react'
import { useEffect } from 'react'
import http from '../http'
import productStore from '../Store/ProductStore'

const ProductProvider = () => {

    const getProducts = async () => {
        try {
          const {data} = await http.get('product')
          return data.data
        } catch (error) {
          console.log(error)
        }
      }
      
  return {
    getProducts
  }
}

export default ProductProvider