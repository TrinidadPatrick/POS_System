import {create} from 'zustand';

const expenseStore = create((set) => ({
  expenseList : [],
  insertExpense: (value) => {
    set((state) => ({expenseList : value}))},
}));

export default expenseStore;