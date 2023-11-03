import '../css/productList.css'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAllProducts, setBrands,setCategory } from './store/productSlice'
import Navbar from './Navbar'
import tmpImg from '../images/shopping_logo.jpg'
import axios from 'axios'
import { json, useNavigate } from 'react-router-dom'

function ProductList() {
    
    let navigate=useNavigate()
    let loginStatus=useSelector((state)=>state.products.login)
    if(!loginStatus)
    {
        navigate('/login')
    }
    let dummyData = useSelector((state) => state.products.products)
    let dummyBrand=useSelector((state)=>state.products.brands)
    let dummyCategory=useSelector((state)=>state.products.category)
    // console.log('d',dummyBrand)
    let dispatch = useDispatch()

    let [filter,setFilter]=useState({})  

    useEffect(() => {
        async function getProductData() {
            await fetch('https://dummyjson.com/products?limit=100')
                // fetch('https://dummyjson.com/products/category/smartphones')
                .then((res) => res.json())
                .then((data) => {
                    // console.log(JSON.stringify(data.products));
                    // console.log([...new Set([...data.products.map((a) => a.category)]).keys()]);
                    // dispatch(setAllProducts(data.products))
                    dispatch(setBrands([...new Set([...data.products.map((a) => a.brand)]).keys()]))
                    dispatch(setCategory([...new Set([...data.products.map((a) => a.category)]).keys()]))
                })
                .catch((error) => console.log(error))
        }
        getProductData()
    }, [])

    // ! variable to set query..........
    
    let [query,setQuery]=useState('')

    function handleFilter(e, filterType, filterValue) {
        if(e.target.checked)
        {
            // console.log(e.target.checked,filterType,filterValue);
            setQuery(query+`${filterType}=${filterValue}&`)
        }
        if(!e.target.checked)
        {
            // console.log(e.target.checked,filterType,filterValue);
            // console.log(query.search(`${filterType}=${filterValue}&`));
            setQuery(query.replace(`${filterType}=${filterValue}&`,''))
        }
    }

    //! fetching filtered data.......................

    useEffect(()=>{
        async function getAllProducts()
        {
            await fetch(`http://localhost:8000/product/get_products?${query}`)
            .then((res)=>res.json())
            .then((data)=>{
                dispatch(setAllProducts(data))
                console.log('back',data);
            })
            console.log(query);

        }
        getAllProducts()
    },[query])


    return <>
        <Navbar></Navbar>
        {/* <h4 className="site_name">E-Commerce</h4> */}
        <div className="product_container">
            <div className="product_box1">
                <h3>All Products</h3>
                <div className="product_sub1">
                    <select name="sort" id="sort">
                        <option value="sort" id='option_1'>Sort</option>
                        <option value="price">Best Rating</option>
                        <option value="price">Price: Low to High</option>
                        <option value="price">Price: High to Low</option>
                    </select>
                    <i className="bi bi-grid-fill"></i>
                </div>
            </div>
            <hr />
            <div className="product_box2">
                <div className="product_box3">
                    <div className="accordion accordion-flush" id="accordionFlushExample">
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                    Brands
                                </button>
                            </h2>
                            <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                <div className="accordion-body">
                                    {dummyBrand.map((data) =>
                                        <div>
                                            <input type="checkbox" id='brand' onChange={(e) => handleFilter(e, 'brand', data)} />
                                            <label htmlFor="brand">{data}</label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                                    Category
                                </button>
                            </h2>
                            <div id="flush-collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                <div className="accordion-body">
                                    {dummyCategory.map((data) =>
                                        <div>
                                            <input type="checkbox" id='category' onChange={(e) => handleFilter(e, 'category', data)} />
                                            <label htmlFor="category">{data}</label>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="product_box4">
                    {(!dummyData) ?
                        <div className="product_loader" style={{ marginLeft: '300px' }}>
                            <div className="spinner-border text-primary" role="status" style={{ width: '30px', height: '30px', }}>
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <span>Loading.....</span>
                        </div>
                        :
                        dummyData.map((data) => <>
                            <div className="product_sub2" onClick={()=>navigate('/product_detail')}>
                                <div className="item_img">
                                    <img src={data.thumbnail} alt="" /> 
                                </div>
                                <div className="product_sub3">
                                    <p id="product_item_name">{data.title}</p>
                                    <div style={{ lineHeight: '5px', marginTop: '5px' }}>
                                        <p id="product_price">${data.price}</p>
                                        <p style={{ color: 'gray' }}><del>${data.price}</del></p>
                                    </div>
                                </div>
                                <i className="bi bi-star-fill" ></i>
                                <p className="iem_clr" style={{ display: 'inline' }}>{data.rating}</p>
                            </div>
                        </>)
                    }
                </div>
            </div>
            <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-end">
                    <li className="page-item disabled">
                        <a className="page-link">Previous</a>
                    </li>
                    <li className="page-item"><a className="page-link" href="#">1</a></li>
                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                    <li className="page-item">
                        <a className="page-link" href="#">Next</a>
                    </li>
                </ul>
            </nav>
        </div>
    </>
}

export default ProductList