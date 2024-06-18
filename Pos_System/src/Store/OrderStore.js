import {create} from 'zustand';

const orderStore = create((set) => ({
  orders : {
    customer_name : '',
    orderList : []
  },
  insertOrder: (value) => {
    set((state) => ({orders : value}))},
}));

export default orderStore;