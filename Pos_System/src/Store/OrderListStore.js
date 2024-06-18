import {create} from 'zustand';

const orderListStore = create((set) => ({
  orderItems : [],
  insertOrders: (value) => {
    set((state) => ({orderItems : value}))},
}));

export default orderListStore;