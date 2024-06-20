import React, { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '../Auth/AuthProvider'
import http from '../http'
import Sidebar from './Sidebar'
import productStore from '../Store/ProductStore'
import categoryStore from '../Store/CategoryStore'
import orderListStore from '../Store/OrderListStore'

const UserLayout = () => {
  const navigate = useNavigate()
  const {user, token, setUser } = useAuthContext()
  const {productList, insertProduct} = productStore()
  const {categoryList, insertCategory} = categoryStore()
  const {orderItems, insertOrders} = orderListStore()

  const getUser = async () => {
    try {
      const result = await http.get('user')
      if(result.status === 201)
      {
        setUser(result.data.user)
        insertProduct(result.data.products)
        insertCategory(result.data.categories)
        insertOrders(result.data.orders)
      }
    } catch (error) {
      if(error.response.status === 401)
      {
        localStorage.removeItem("ACCESS_TOKEN");
        navigate('/login');
      }
    }
  }

  useEffect(()=>{
    getUser()
  },[])

  if(!token){
    navigate('/login')
  }

  return (
    <div className=' w-full h-screen relative flex gap-1'>
      <Sidebar />
      <Outlet />
    </div>
  )
}

export default UserLayout