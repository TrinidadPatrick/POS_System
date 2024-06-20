import React from 'react'
import http from '../http'

const ExpenseProvider = () => {

    const getExpenses = async () => {
        try {
            const result = await http.get('expense')
            return Promise.resolve(result.data.expenses)
        } catch (error) {
            console.log(error)
        }
    }


  return {
    getExpenses
  }
}

export default ExpenseProvider