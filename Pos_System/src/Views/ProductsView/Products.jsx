import React, { useEffect, useState } from 'react'
import http from '../../http'
import InventoryHeader from './InventoryHeader'
import { ToastContainer, toast } from 'react-toastify';
import ProductTable from './ProductTable';
import categoryStore from '../../Store/CategoryStore';
import CategoryProvider from '../../Hooks/CategoryProvider';
import productStore from '../../Store/ProductStore';
import ProductProvider from '../../Hooks/ProductProvider';

const Products = () => {
  const {getCategories} = CategoryProvider()
  const {getProducts} = ProductProvider()
  const {productList, insertProduct} = productStore()
  const {categoryList, insertCategory} = categoryStore()

  const fetchCategories = async () => {
    const categories = await getCategories()
    insertCategory(categories)
  }

  const fetchProducts = async () => {
    try {
      const data = await getProducts()
      insertProduct(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    const fetchData = async () => {
      await fetchProducts()
      await fetchCategories()
    }
    fetchData()
  },[])

  return (
    <div className='flex-1 flex flex-col h-full bg-slate-50 p-2 overflow-x-auto'>
    <InventoryHeader />
    <ProductTable />
    <ToastContainer />
  </div>
  )
}

export default Products