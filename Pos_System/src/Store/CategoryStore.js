import {create} from 'zustand';

const categoryStore = create((set) => ({
  categoryList : [],
  insertCategory: (value) => {
    set((state) => ({categoryList : value}))},
}));

export default categoryStore;