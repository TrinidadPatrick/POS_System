import React, { useState, useEffect } from 'react'
import Modal from 'react-modal';
import { IoAddCircle } from "react-icons/io5";
import http from '../../http';
import { ToastContainer, toast } from 'react-toastify';
import { Cloudinary } from 'cloudinary-core';
import 'react-toastify/dist/ReactToastify.css';
import emptyImage from '../../MainUtilities/EmptyImage/empty-image.png'
import productStore from '../../Store/ProductStore';
import ProductProvider from '../../Hooks/ProductProvider';
import LoadingProcess from '../../MainUtilities/Loader/LoadingProcess';
import categoryStore from '../../Store/CategoryStore';
import { IoIosRemoveCircle } from "react-icons/io";

const EditProductModal = ({productToEdit, setIsEditProductModalOpen}) => {
    const cloudinary = new Cloudinary({ cloud_name: import.meta.env.VITE_CLOUD_NAME });
    const {categoryList} = categoryStore()
    const [productDetails, setProductDetails] = useState({
        product_name: productToEdit.product_name,
        product_category : productToEdit.product_category,
        product_price : productToEdit.product_price,
        product_stock : productToEdit.product_stock,
        product_image : productToEdit.product_image,
        is_active : productToEdit.is_active
    })
    const {productList, insertProduct} = productStore()
    const {getProducts} = ProductProvider()
    const [variants, setVariants] = useState(productToEdit.variations)
    const [loading, setLoading] = useState(false)

    const notify = (message, status) => {
      if(status === "success")
      {
        toast.success(message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          // theme: theme,
          });
      }
      else
      {
        toast.error(message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          // theme: theme,
          });
      }
    }

    const addVariant = () => {
        if(variants.length === 0)
        {
          return setVariants((prevVariant)=> [
            ...prevVariant, {
                variation_name : '',
                variation_price : '',
                variation_stock : ''
            }
          ])
        }
        const lastVariant = variants[variants.length - 1]
        if(lastVariant && lastVariant.variation_name && lastVariant.variation_price && lastVariant.variation_stock !== '')
        {
          return setVariants((prevVariant)=> [
            ...prevVariant, {
                variation_name : '',
                variation_price : '',
                variation_stock : ''
            }
          ])
        }
        
    }

    const resizeImage = (file, maxWidth, maxHeight, callback) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
    
            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }
    
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(callback, 'image/jpeg', 0.7); // Adjust quality if needed
          };
        };
      };
  
    const addImage = async (e) => {
        const file = e.target.files[0];
        if(file)
        {
          resizeImage(file, 300, 300, async (blob) => { // Adjust maxWidth and maxHeight as needed
            const formData = new FormData();
            formData.append('file', blob);
            formData.append('upload_preset', 'POS_Product_Image'); // Set up upload presets in Cloudinary dashboard
      
            const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, {
              method: 'POST',
              body: formData,
            });
      
            const data = await response.json();
            setProductDetails({...productDetails, product_image : data.secure_url});
          });
        }
    }

    const removeVariant = (id) => {
        const newVariant = [...variants]
        const index = newVariant.findIndex((variant) => variant.id === id)
        newVariant.splice(index, 1)
        setVariants(newVariant)
    }

    const handleDisableProduct = () => {
      const newProduct = [...productList]
      const index = newProduct.findIndex((product) => product.id === productToEdit.id)
      if(index !== -1)
      {
        setProductDetails({...productDetails, is_active : productDetails.is_active === 1 ? 0 : 1})
      }
    }

    const submitProduct = async (e) => {
        e.preventDefault()
        setLoading(true)
        const variant_list = variants.filter((variant)=> variant.variation_name && variant.variation_price && variant.variation_stock)
          const data = {
            productDetails,
            variants : variant_list
          }
        try {
          const result = await http.patch(`product/${productToEdit.id}`, 
            data
          )
          notify('Added succesfully', 'success')
          const products = await getProducts()
          insertProduct(products)

        } catch (error) {
          notify('Failed to add product, please try again.', 'fail')
          console.log(error)
        }
        setLoading(false)
        setIsEditProductModalOpen(false)
        
    }
    


  return (
    <div className="bg-white w-[400px] rounded-lg shadow-lg p-6 max-w-md">
    <div className='w-full flex justify-between items-center mb-4'>
    <h2 className="text-lg text-gray-700 font-semibold 4">Edit Product</h2>
    <label className="inline-flex items-center cursor-pointer">
      <input onChange={()=>handleDisableProduct()} checked={productDetails.is_active === 1} type="checkbox" value="" className="sr-only peer" />
        <div className="relative w-[2.24rem] h-[1.24rem] bg-gray-200 peer-focus:outline-none rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        {
          productDetails.is_active === 1 ? <span className="ms-3 text-sm font-medium text-green-400 ">Active</span>
          :
          <span className="ms-3 text-sm font-medium text-red-400 ">Disabled</span>
        }
    </label>
    </div>
    <form onSubmit={(e)=>submitProduct(e)} >
      {/* Name */}
      <div className="mb-4">
        <input
        value={productDetails.product_name}
        onChange={(e)=>{setProductDetails({...productDetails, product_name : e.target.value})}}
        type="text"
        name="productName"
        placeholder='Product name'
        className="text-sm appearance-none border rounded w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
        />
      </div>
      {/* Category */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Product Category
        </label>
        <select onChange={(e)=>{setProductDetails({...productDetails, product_category : Number(e.target.value)})}} className='border px-3 py-2.5 text-sm rounded w-full'>
            {
                categoryList?.map((category)=>{
                    return (
                        <option key={category.id} value={category.id}>{category.category_name}</option>
                    )
                })
            }
        </select>
      </div>
      {/* Price */}
      <div className="mb-4">
        <input
        disabled={variants.length !== 0 ? true : false}
        value={variants.length !== 0 ? '' : productDetails.product_price}
        onChange={(e)=>{setProductDetails({...productDetails, product_price : e.target.value === '' ? '' : Number(e.target.value.replace(/[^0-9]/g, ''))})}}
        type="text"
        name="price"
        placeholder='Price'
        className="text-sm appearance-none border rounded w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required={variants.length === 0 ? true : false}
        />
      </div>
      {/* Stock */}
      <div className="mb-4">
        <input
        disabled={variants.length !== 0 ? true : false}
        value={variants.length !== 0 ? '' : productDetails.product_stock}
        onChange={(e)=>{setProductDetails({...productDetails, product_stock : Number(e.target.value.replace(/[^0-9]/g, ''))})}}
        placeholder='Stock'
        type="number"
        name="productStock"
        className="text-sm appearance-none border rounded w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required={variants.length === 0 ? true : false}
        />
      </div>
      {/* Add variation button */}
      {
        variants.length === 0 &&
        <div className={`w-full`}>
        <button onClick={()=>{addVariant()}} className='text-sm py-2 w-full border rounded text-theme-dark border-theme-semiLight border-dashed'>Add variation</button>
        </div>
      }
      {/* Variants Slot */}
      <div className='w-full flex flex-col gap-3 mt-3'>
        {
            variants?.map((variant, index)=>{
                return (
                <div key={index} className='w-full flex items-center gap-2'>
                    {/* Type */}
                    <input
                    required
                    maxLength={30}
                    value={variant?.variation_name}
                    onChange={(e)=>{
                        const newArray = [...variants]
                        newArray[index].variation_name = e.target.value
                        setVariants(newArray)
                    }}
                    className='border rounded-sm p-1 font-light text-[0.75rem] w-full'
                    type='text'
                    placeholder='Type'
                    />
                    {/* Price */}
                    <input
                    required
                    value={variant?.variation_price}
                    onChange={(e)=>{
                        const newArray = [...variants]
                        newArray[index].variation_price = e.target.value
                        setVariants(newArray)
                    }}
                    maxLength={30}
                    className='border rounded-sm p-1 font-light text-[0.75rem] w-full'
                    type='text'
                    placeholder='Price'
                    />
                    {/* Stock */}
                    <input
                    required
                    value={variant?.variation_stock}
                    onChange={(e)=>{
                        const newArray = [...variants]
                        newArray[index].variation_stock = e.target.value
                        setVariants(newArray)
                    }}
                    maxLength={30}
                    className='border rounded-sm p-1 font-light text-[0.75rem] w-full'
                    type='text'
                    placeholder='Qty'
                    />
                    <button onClick={()=>removeVariant(variant.id)}>
                    <IoIosRemoveCircle size={25} color='red' />
                    </button>
                </div>
                )
            })
        }
      </div>
      {/* Add more variant button */}
      <div className={`w-full ${variants.length === 0 ? 'hidden' : 'flex'} mt-1 justify-center `}>
        <button onClick={()=>addVariant()}>
            <IoAddCircle fontSize={25} className='text-theme-medium' />
        </button>
      </div>
      <div>
        {/* Product Image */}
        <label className="block text-gray-700 text-xs font-bold mb-2">
            Product Image
          </label>
          <label className="block">
            <span className="sr-only">Choose profile photo</span>
            <input onChange={(e)=>addImage(e)} placeholder='S' type="file" className="block w-full text-sm text-gray-500
              file:me-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700
              file:disabled:opacity-50 file:disabled:pointer-events-none
              dark:text-neutral-500
              dark:file:bg-blue-500
              dark:hover:file:bg-blue-400
            "/>
        </label>
        <div className='w-16 aspect-square rounded mt-2 overflow-hidden'>
          <img className=' object-cover w-full h-full' src={productDetails.product_image ? productDetails.product_image : emptyImage} alt='Image' />
        </div>
      </div>
      {/* Submit button */}
      <div className="flex items-center justify-end gap-2 mt-3">
        <button
        onClick={()=>setIsEditProductModalOpen(false)}
          type="button"
          className="border border-gray-200 text-gray-800 font-medium text-sm py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
        </button>
        
        <button type="submit" className=" bg-theme-dark text-white font-medium text-sm w-24 h-9 flex justify-center items-center rounded focus:outline-none focus:shadow-outline">
          {
            loading ?  <LoadingProcess /> : 'Update'
          }
        </button>
      </div>
    </form>
  </div>
  )
}

export default EditProductModal