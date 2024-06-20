import {create} from 'zustand';

const reportStore = create((set) => ({
  report : {
    ReportsForTheYear : [],
    expense : '',
    net_sales : '',
    product_sold : '',
    profit : '',
    orderItems : []
  },
  insertReport: (value) => {
    set((state) => ({report : value}))},
}));

export default reportStore;