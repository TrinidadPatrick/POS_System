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

  return (
    
    <div className='flex-1 flex flex-col h-full bg-[#fafafa] p-2 overflow-x-auto'>
    <InventoryHeader />
    <ProductTable />
    <ToastContainer />
  </div>
  )
}

export default Products