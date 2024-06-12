import {create} from 'zustand';

const productStore = create((set) => ({
  productList : [],
  insertProduct: (value) => {
    set((state) => ({productList : value}))},
}));

export default productStore;