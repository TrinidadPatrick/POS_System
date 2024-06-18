import React, { useState } from 'react'
import Modal from 'react-modal';
import AddProductModal from './AddProductModal';
import ManageCategoryModal from './ManageCategoryModal';

const InventoryHeader = () => {
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const modalStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          padding : '0%',
          border : '0px',
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
    };

  return (
    <div className='w-full flex items-center justify-between'>
        <h1 className='flex-1 hidden sm:flex font-medium text-sm md:text-2xl text-gray-700'>Product Inventory</h1>
        <div className='hidden sm:flex items-center space-x-2 p-2 pb-0'>
            <button onClick={()=>setIsCategoryModalOpen(true)} className='px-2 py-1 rounded-sm border-2 border-theme-medium text-gray-700 text-sm'>Manage categories</button>
            <button onClick={()=>setIsProductModalOpen(true)} className='px-2 py-1 rounded-sm border-2 border-theme-medium bg-theme-medium text-white text-sm'>Add product</button>
        </div>

        <Modal ariaHideApp={false} isOpen={isProductModalOpen} style={modalStyles}>
        <AddProductModal setIsProductModalOpen={setIsProductModalOpen} />
        </Modal>

        <Modal ariaHideApp={false} isOpen={isCategoryModalOpen} style={modalStyles}>
        <ManageCategoryModal setIsCategoryModalOpen={setIsCategoryModalOpen} />
        </Modal>
    </div>
  )
}

export default InventoryHeader