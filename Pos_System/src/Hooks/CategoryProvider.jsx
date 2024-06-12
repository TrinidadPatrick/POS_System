import React from 'react'
import http from '../http'
import categoryStore from '../Store/CategoryStore'
import { useEffect } from 'react'

const CategoryProvider = () => {

    const getCategories = async () => {
        try {
          const result = await http.get('category')
          const categories = result.data.data
          if(categories.length !== 0)
          {
            return categories
          }
        } catch (error) {
          console.log(error)
        }
    }

  return {
    getCategories
  }
}

export default CategoryProvider