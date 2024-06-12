import React from 'react'
import http from '../../http'
import { useState, useEffect } from 'react'
import emptyImage from '../../MainUtilities/EmptyImage/empty-image.png'
import EditProductModal from './EditProductModal'
import productStore from '../../Store/ProductStore'
import Modal from 'react-modal';
import ProductProvider from '../../Hooks/ProductProvider'
import { LiaSearchSolid } from "react-icons/lia";
import { MdClear } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import 'rsuite/dist/rsuite.min.css';
import { Dropdown } from 'rsuite';
import categoryStore from '../../Store/CategoryStore'


const ProductTable = () => {
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const {categoryList} = categoryStore()
  const {productList, insertProduct} = productStore()
  const [productToEdit, setProductToEdit] = useState(null)
  const [searchValue, setSearchValue] = useState('')
  const [activeSearch, setActiveSearch] = useState(false)
  const [products, setProducts] = useState([])
  const [sortOptions, setSortOption] = useState({
    field : '',
    option : ''
  })
  const [filterOptions, setFilterOptions] = useState({
    category : '',
    stock : '',
    status : ''
  })

  useEffect(()=>{
    setProducts(productList)
  },[productList])

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

  const handleEdit = (product) => {
    if(product)
    {   
        setProductToEdit(product)
        setIsEditProductModalOpen(true)
    }
  }

  const handleSearch = () => {
    const result = productList.filter((product) => product.product_name.toLowerCase().includes(searchValue.toLowerCase()))
    setProducts(result)
    setActiveSearch(true)
  }

  const clearSearch = () => {
    setActiveSearch(false)
    setSearchValue('')
    setProducts(productList)
  }

  const handleSort = (field, option) => {
    setSortOption({
        field, option
    })

    switch (field) {
        case 'product':
            const sortedProduct = option === "asc" ? products.sort((a,b)=> a.product_name.localeCompare(b.product_name)) : products.sort((a,b)=> b.product_name.localeCompare(a.product_name))
            setProducts(sortedProduct)
            break;
        case 'category':
            const sortedCategory = option === "asc" ? products.sort((a,b)=> a.category.category_name.localeCompare(b.category.category_name)) : products.sort((a,b)=> b.category.category_name.localeCompare(a.category.category_name))
            setProducts(sortedCategory)
            break;
        case 'price':
            const final_product = products.map((product)=>{
                if(product.product_price)
                {
                    return {...product, final_price : Number(product.product_price)}
                }
                else if(product.product_price === null && product.variations.length !== 0)
                {
                    return {...product, final_price : Number(product.variations[product.variations.length - 1].variation_price)}
                }
            })
            const sortedPrice = option === "asc" ? 
            final_product.sort((a,b) => a.final_price - b.final_price) :
            final_product.sort((a,b) => b.final_price - a.final_price) 
            setProducts(sortedPrice)
            break;

        case 'stock':
            const final_product2 = products.map((product)=>{
                if(product.product_stock)
                {
                    return {...product, final_stock : Number(product.product_stock)}
                }
                else if(product.product_stock === null && product.variations.length !== 0)
                {
                    return {...product, final_stock : Number(product.variations[product.variations.length - 1].variation_stock)}
                }
            })
            const sortedStock = option === "asc" ? 
            final_product2.sort((a,b) => a.final_stock - b.final_stock) :
            final_product2.sort((a,b) => b.final_stock - a.final_stock) 
            setProducts(sortedStock)
            break;
    
        default:
            break;
    }
  }

  const handleFilter = (field, option) => {
        // Initiate a search first to be the base array of filtering
        const initialProduct = productList.filter((product) => product.product_name.toLowerCase().includes(searchValue.toLowerCase()))
        const newOption = {...filterOptions, [field] : option}
        setFilterOptions(newOption)
        const filteredByCategory = newOption.category !== '' ? initialProduct.filter((product) => product.category.category_name === newOption.category) : initialProduct
        const filteredByStock = newOption.stock !== '' ? filteredByCategory.filter((product) => {
            const productStock = product.product_stock ? product.product_stock : product.variations[product.variations.length - 1].variation_stock
            if(newOption.stock === "On Stock")
            {
                return productStock > 10
            }
            else if(newOption.stock === "Low on Stock")
            {
                return productStock <= 10
            }
            else
            {
                return productStock <= 0
            }
        }) : filteredByCategory
        const filteredByStatus = newOption.status !== '' ? filteredByStock.filter((product)=> {
            if(newOption.status === "Active")
            {
                return product.is_active === 1
            }
            else
            {
                return product.is_active === 0
            }
        }) : filteredByStock
        setProducts(filteredByStatus)
  }


  return (
    <div className="relative overflow-x-auto shadow-sm sm:rounded-lg mt-3 p-1 flex flex-col gap-2  h-full">
        {/* Navigation */}
        <div className='w-full flex items-center gap-3 '>
            {/* Search */}
            <div className='w-56 relative'>
                <input value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} onKeyDown={(e)=>{if(e.key === "Enter"){handleSearch()}}} placeholder='Search product...' className='text-sm p-2 border outline-none rounded w-full focus:border-theme-semiLight' type="text" />
                {
                    !activeSearch ? 
                    <button onClick={()=>handleSearch()} className='absolute right-2 top-2'>
                    <LiaSearchSolid size={20} color='gray' />
                    </button>
                    :
                    <button onClick={()=>clearSearch()} className='absolute right-2 top-2'>
                    <MdClear size={20} color='gray' />
                    </button>  
                }
            </div>
            <div className=' gap-2 h-full  flex'>
                    <Dropdown title="Filter"
                    renderToggle={(props, ref) => (
                    <button {...props} ref={ref} className="bg-theme-medium text-white px-3 h-full rounded">
                        <FaFilter size={15} />
                    </button>
                    )}
                    >
                    <Dropdown.Menu title="Category" >
                    {
                        categoryList?.map((category)=>(
                                <Dropdown.Item active={filterOptions.category === category.category_name} key={category.id} onClick={()=>handleFilter('category', category.category_name)}><p>{category.category_name}</p></Dropdown.Item>
                        ))
                    }
                    </Dropdown.Menu>
                    <Dropdown.Menu title="Stock">
                        <Dropdown.Item active={filterOptions.stock === 'On Stock'} onClick={()=>handleFilter('stock', 'On Stock')}>On Stock</Dropdown.Item>
                        <Dropdown.Item active={filterOptions.stock === 'Low on Stock'} onClick={()=>handleFilter('stock', 'Low on Stock')}>Low on Stock</Dropdown.Item>
                        <Dropdown.Item active={filterOptions.stock === 'Out of Stock'} onClick={()=>handleFilter('stock', 'Out of Stock')}>Out of Stock</Dropdown.Item>
                    </Dropdown.Menu>
                    <Dropdown.Menu title="Status">
                        <Dropdown.Item active={filterOptions.status === 'Active'} onClick={()=>handleFilter('status', 'Active')}>Active</Dropdown.Item>
                        <Dropdown.Item active={filterOptions.status === 'Disabled'} onClick={()=>handleFilter('status', 'Disabled')}>Disabled</Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>
            </div>
        </div>
    <table className="w-full table-auto text-sm text-left rtl:text-right  text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase  bg-gray-100 ">
            <tr>
                <th scope="col" className="px-6 py-3">
                    Image
                </th>
                <th scope="col" className="px-6 py-3 ">
                    <div className='flex gap-2 items-center'>
                   <p>
                    Product name
                    </p>
                    <div className='flex flex-col'>
                        <button onClick={()=>handleSort('product', 'asc')} className=' ' >
                        <svg className={`hover:text-gray-400 ${sortOptions.field === 'product' && sortOptions.option === 'asc' && 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" width="0.77em" height="0.9em" viewBox="0 0 1024 300"><path fill="currentColor" d="M1024 512q0 26-19 45t-45 19H64q-26 0-45-19T0 512t19-45L467 19q19-19 45-19t45 19l448 448q19 19 19 45"></path></svg>
                        </button>
                        <button onClick={()=>handleSort('product', 'desc')} className=' rotate-180' >
                        <svg className={`hover:text-gray-400 ${sortOptions.field === 'product' && sortOptions.option === 'desc' && 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" width="0.77em" height="0.9em" viewBox="0 0 1024 300"><path fill="currentColor" d="M1024 512q0 26-19 45t-45 19H64q-26 0-45-19T0 512t19-45L467 19q19-19 45-19t45 19l448 448q19 19 19 45"></path></svg>
                        </button>
                    </div>
                   </div>
                </th>
                <th scope="col" className="px-6 py-3 ">
                   <div className='flex gap-2 items-center'>
                   <p>
                    Category
                    </p>
                    <div className='flex flex-col'>
                        <button onClick={()=>handleSort('category', 'asc')} className=' ' >
                        <svg className={`hover:text-gray-400 ${sortOptions.field === 'category' && sortOptions.option === 'asc' && 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" width="0.77em" height="0.9em" viewBox="0 0 1024 300"><path fill="currentColor" d="M1024 512q0 26-19 45t-45 19H64q-26 0-45-19T0 512t19-45L467 19q19-19 45-19t45 19l448 448q19 19 19 45"></path></svg>
                        </button>
                        <button onClick={()=>handleSort('category', 'desc')} className=' rotate-180' >
                        <svg className={`hover:text-gray-400 ${sortOptions.field === 'category' && sortOptions.option === 'desc' && 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" width="0.77em" height="0.9em" viewBox="0 0 1024 300"><path fill="currentColor" d="M1024 512q0 26-19 45t-45 19H64q-26 0-45-19T0 512t19-45L467 19q19-19 45-19t45 19l448 448q19 19 19 45"></path></svg>
                        </button>
                    </div>
                   </div>
                </th>
                <th scope="col" className="px-6 py-3">
                    <div className='flex gap-2 items-center'>
                    <p>
                        price
                        </p>
                        <div className='flex flex-col'>
                            <button onClick={()=>handleSort('price', 'asc')} className=' ' >
                            <svg className={`hover:text-gray-400 ${sortOptions.field === 'price' && sortOptions.option === 'asc' && 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" width="0.77em" height="0.9em" viewBox="0 0 1024 300"><path fill="currentColor" d="M1024 512q0 26-19 45t-45 19H64q-26 0-45-19T0 512t19-45L467 19q19-19 45-19t45 19l448 448q19 19 19 45"></path></svg>
                            </button>
                            <button onClick={()=>handleSort('price', 'desc')} className=' rotate-180' >
                            <svg className={`hover:text-gray-400 ${sortOptions.field === 'price' && sortOptions.option === 'desc' && 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" width="0.77em" height="0.9em" viewBox="0 0 1024 300"><path fill="currentColor" d="M1024 512q0 26-19 45t-45 19H64q-26 0-45-19T0 512t19-45L467 19q19-19 45-19t45 19l448 448q19 19 19 45"></path></svg>
                            </button>
                        </div>
                    </div>
                </th>
                <th scope="col" className="px-6 py-3">
                    <div className='flex gap-2 items-center'>
                    <p>
                        Stock
                        </p>
                        <div className='flex flex-col'>
                            <button onClick={()=>handleSort('stock', 'asc')} className=' ' >
                            <svg className={`hover:text-gray-400 ${sortOptions.field === 'stock' && sortOptions.option === 'asc' && 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" width="0.77em" height="0.9em" viewBox="0 0 1024 300"><path fill="currentColor" d="M1024 512q0 26-19 45t-45 19H64q-26 0-45-19T0 512t19-45L467 19q19-19 45-19t45 19l448 448q19 19 19 45"></path></svg>
                            </button>
                            <button onClick={()=>handleSort('stock', 'desc')} className=' rotate-180' >
                            <svg className={`hover:text-gray-400 ${sortOptions.field === 'stock' && sortOptions.option === 'desc' && 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" width="0.77em" height="0.9em" viewBox="0 0 1024 300"><path fill="currentColor" d="M1024 512q0 26-19 45t-45 19H64q-26 0-45-19T0 512t19-45L467 19q19-19 45-19t45 19l448 448q19 19 19 45"></path></svg>
                            </button>
                        </div>
                    </div>
                </th>
                <th scope="col" className="px-6 py-3">
                    Stock Status
                </th>
                <th scope="col" className="px-6 py-3">
                    Status
                </th>
            </tr>
        </thead>
        <tbody>
        {
        products?.map((product)=>{
            let stock_status = '';
            if(product.variations.length !== 0)
            {
                let total_stock = product.variations.reduce((acc, variant) => acc + variant.variation_stock, 0)
                stock_status = total_stock > 10 ? 'On Stock' : total_stock <= 10 ? 'Low on Stock' : 'Out of Stock'

            }
            else
            {
                let total_stock = product.product_stock
                stock_status = total_stock > 10 ? 'On Stock' : total_stock <= 10 ? 'Low on Stock' : 'Out of Stock'
            }
            const product_price = product.variations.length === 0 ? product.product_price : '₱'+product.variations[0].variation_price +' - ' + '₱'+product.variations[product.variations.length - 1].variation_price
            const product_stock = product.variations.length === 0 ? product.product_stock : product.variations[0].variation_stock +' - ' +product.variations[product.variations.length - 1].variation_stock
            return (
                <tr onClick={()=>handleEdit(product)} key={product.id} className="odd:bg-white  even:bg-gray-50 cursor-pointer hover:bg-gray-100 border-b ">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                <div className='w-10 aspect-square object-cover rounded overflow-hidden'>
                                    <img className='w-full h-full object-cover' src={product.product_image ? product.product_image : emptyImage} alt="image" />
                                </div>
                            </th>
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                <p>{product.product_name}</p>
                            </th>
                            <td className="px-6 py-4">
                                <p>{product.category.category_name}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <p>{product_price}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <p>{product_stock}</p>
                            </td>
                            <td className={` ${stock_status === 'On Stock' ? 'text-green-400' : stock_status === 'Low on Stock' ? 'text-blue-500' : 'text-red-500'} px-6 py-4 whitespace-nowrap`}>
                                <p>{stock_status}</p>
                            </td>
                            <td className={` ${ product.is_active === 1 ? 'text-green-500' : 'text-red-500'} px-6 py-4`}>
                                <p>{product.is_active === 1 ? 'Active' : 'Disabled'}</p>
                            </td>
                </tr>
            )
        })
        }
        </tbody>
    </table>

    <Modal ariaHideApp={false} isOpen={isEditProductModalOpen} style={modalStyles}>
        <EditProductModal productToEdit={productToEdit} setIsEditProductModalOpen={setIsEditProductModalOpen}  />
    </Modal>
</div>
  )
}

export default ProductTable