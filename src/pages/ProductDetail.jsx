import React, { useState } from 'react';
import { useDispatch } from 'react-redux'
import Axios from 'axios';
import { API_URL } from '../constants/API'
import { connect } from 'react-redux'
import { useEffect } from 'react';
import { useParams } from "react-router-dom"
import { getCartData } from '../redux/actions/cart';

function ProductDetail() {
    const params = useParams();
    const [productData, setProductData] = useState({})
    const [userData, setUserData] = useState({})
    const [productNotFound, setProductNotFound] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const dispatch = useDispatch()


    const incrementQuantity = () => setQuantity(quantity + 1)
    let decrementQuantity = () => setQuantity(quantity - 1)

    if (quantity <= 1) {
        decrementQuantity = () => setQuantity(1);
    }

    const fetchProductData = () => {
        Axios.get(`${API_URL}/products`, {
            params: {
                id: params.productId
            }
        })
            .then((result) => {
                if (result.data.length) {
                    setProductData(result.data[0])
                } else {
                    setProductNotFound(true)
                }
            })
            .catch(() => {
                alert("Server Error! (ProductDetail.jsx/fetchProductData())")
            })
    }

    const fetchUserData = () => {
        Axios.get(`${API_URL}/users`, {
            params: {
                id: params.userId
            }
        })
            .then((result) => {
                if (result.data.length) {
                    setUserData(result.data[0])
                }
            })
            .catch(() => {
                alert("Server Error! (ProductDetail.jsx/fetchUserData())")
            })
    }

    const addToCartHandler = () => {
        Axios.get(`${API_URL}/carts`, {
            params: {
                userId: userData.id,
                productId: params.productId,
            }
        })
            .then((result) => {
                if (result.data.length) {
                    Axios.patch(`${API_URL}/carts/${result.data[0].id}`, {
                        quantity: result.data[0].quantity + quantity
                    })
                        .then(() => {
                            alert("Item added successfully!")
                            dispatch(getCartData(userData.id))
                            // getCartData(userData.id)
                        })
                        .catch(() => {
                            alert("Server Error! (ProductDetail.jsx/addToCartHandler()/.then/if)")
                        })
                } else {
                    Axios.post(`${API_URL}/carts`, {
                        userId: userData.id,
                        productId: params.productId,
                        price: productData.price,
                        productName: productData.productName,
                        productImage: productData.productImage,
                        quantity: quantity
                    })
                        .then(() => {
                            alert("Item added successfully!")
                            dispatch(getCartData(userData.id))
                            // getCartData(userData.id)
                        })
                        .catch(() => {
                            alert("Server Error! (ProductDetail.jsx/addToCartHandler().then/else)")
                        })
                }
            })
    }

    useEffect(() => {
        fetchProductData()
        fetchUserData()
    }, [])

    return (
        <div className="container">
            {
                productNotFound ?
                    <div className="alert alert-warning mt-3"> Product with ID {params.productId} has not been found</div>
                    :
                    <div className="row mt-3">
                        <div className="col-6">
                            <img
                                style={{ width: "100%" }}
                                src={productData.productImage}
                                alt=""
                            />
                        </div>
                        <div className="col-6 d-flex flex-column justify-content-center">
                            <h4>{productData.productName}</h4>
                            <h5>Rp{productData.price}</h5>
                            <p>
                                {productData.description}
                            </p>
                            <div className="my-2 d-flex flex-row justify-content-start align-items-center">
                                <button onClick={decrementQuantity} className="btn btn-primary mr-4">
                                    -
                                </button>
                                <div className='ms-3 text-center'>
                                    {quantity}
                                </div>
                                <button onClick={incrementQuantity} className="btn btn-primary mx-4">
                                    +
                                </button>
                            </div>
                            <button onClick={addToCartHandler} className="btn btn-success w-25">
                                Add to cart
                            </button>
                        </div>
                    </div>
            }
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        userGlobal: state.user,
    }
}

const mapDispatchToProps = {
    getCartData,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);