import React from "react";
import "../assets/styles/product_card.css";
import { Link } from 'react-router-dom'
import Axios from 'axios';
import { API_URL } from "../constants/API";
import { useSelector, useDispatch } from "react-redux";
import { getCartData } from "../redux/actions/cart";

const ProductCard = (props) => {
    const userGlobal = useSelector((state) => state.user)
    // const cartGlobal = useSelector((state) => state.cart)
    // console.log(cartGlobal.cartList[1].price)
    const dispatch = useDispatch()


    const addToCartHandlerCard = () => {
        console.log(userGlobal.id)
        console.log(props.productData.id)
        Axios.get(`${API_URL}/carts`, {
            params: {
                userId: userGlobal.id,
                productId: props.productData.id,
            }
        })
            .then((result) => {
                if (result.data.length) {
                    console.log("Barang ada!")
                    console.log(result.data[0].id)
                    Axios.patch(`${API_URL}/carts/${result.data[0].id}`, {
                        quantity: result.data[0].quantity + 1
                    })
                        .then(() => {
                            alert("Item added successfully!")

                        })
                        .catch(() => {
                            alert("Server Error! (ProductCard.jsx/addToCartHandlerCard()/.then/if)")
                        })
                } else {
                    console.log("barang belom ada!")
                    Axios.post(`${API_URL}/carts`, {
                        userId: userGlobal.id,
                        productId: props.productData.id,
                        price: props.productData.price,
                        productName: props.productData.productName,
                        productImage: props.productData.productImage,
                        quantity: 1
                    })
                        .then(() => {
                            dispatch(getCartData(userGlobal.id))
                            alert("Item added successfully!")
                        })
                        .catch(() => {
                            alert("Server Error! (ProductDetail.jsx/addToCartHandlerHome().then/else)")
                        })
                }
            })
    }

    return <>
        <div className="card product-card">
            <img src={props.productData.productImage} alt="" />
            <div className="mt-2">
                <div>
                    <Link to={`/product-detail/${props.productData.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <h6>{props.productData.productName}</h6>
                    </Link>
                    <span className="text-muted">Rp{props.productData.price.toLocaleString("id-ID")}</span>
                </div>
                <div className="d-flex flex-row justify-content-end">
                    <button onClick={addToCartHandlerCard} className="btn btn-warning mt-2">Add to cart</button>
                </div>
            </div>
        </div>
    </>
};

export default ProductCard;
