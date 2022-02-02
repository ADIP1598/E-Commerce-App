import React, { useState } from "react";
import { useSelector, useDispatch, useEfffect } from 'react-redux'
import Axios from 'axios'
import { API_URL } from "../constants/API"
import { getCartData } from '../redux/actions/cart'

const Cart = (props) => {
    const userGlobal = useSelector((state) => state.user)
    const cartGlobal = useSelector((state) => state.cart)
    console.log(useSelector((state) => state.cart))
    // console.log(cartGlobal.cartList[1].price)
    const [isCheckoutMode, setIsCheckoutMode] = useState(false)
    const [recipientName, setRecipientName] = useState('')
    const [address, setAddress] = useState('')
    const [payment, setPayment] = useState(0)
    // const [renderCart, setRenderCart] = useState('')
    const dispatch = useDispatch()

    const deleteCartHandler = (cartId) => {
        Axios.delete(`${API_URL}/carts/${cartId}`)
            .then(() => {
                dispatch(getCartData(userGlobal.id))
                // alert("Successfully deleted item from cart")
            })
            .catch(() => {
                alert("Server Error! (pages/cart.jsx)")
            })
    }
    const renderCart = () => {
        return cartGlobal.cartList.map((val) => {
            return (
                <>
                    <tr>
                        <td className="align-middle">
                            {val.productName}
                        </td>
                        <td className="align-middle">
                            Rp{val.price.toLocaleString("id-ID")}
                        </td>
                        <td className="align-middle">
                            <img src={val.productImage} alt="" style={{ height: "125px" }} />
                        </td>
                        <td className="align-middle">
                            {val.quantity}
                        </td>
                        <td className="align-middle">
                            Rp{(val.price * val.quantity).toLocaleString("id-ID")}
                        </td>
                        <td className="align-middle">
                            <button onClick={deleteCartHandler} className="btn btn-danger">
                                Delete
                            </button>
                        </td>
                    </tr>
                </>
            )
        })
    }

    const renderSubtotalPrice = () => {
        let subtotal = 0;
        for (let i = 0; i < cartGlobal.cartList.length; i++) {
            subtotal += cartGlobal.cartList[i].price * cartGlobal.cartList[i].quantity
        }
        return subtotal;
    }

    const renderTaxFee = () => {
        return renderSubtotalPrice() * 0.10;
    }

    const renderTotalPrice = () => {
        return renderSubtotalPrice() + renderTaxFee();
    }

    const checkoutModeToggle = () => {
        setIsCheckoutMode(true)
    }

    // const inputHandler = (event) => {
    //     const { name, value } = event.target

    //     this.setState({ [name]: value })
    // }

    const payBtnHandler = () => {
        if (payment < renderTotalPrice()) {
            alert(`You need ${renderTotalPrice() - payment} to finish this Payment!`)
            return;
        }

        if (payment > renderTotalPrice()) {
            alert(`Payment success! Chance: ${payment - renderTotalPrice()}`)
        } else if (payment === renderTotalPrice()) {
            alert(`Payment success!`)
        }

        const d = new Date();
        Axios.post(`${API_URL}/transactions`, {
            userId: userGlobal.id,
            address: address,
            recipientName: recipientName,
            totalPrice: parseInt(renderTotalPrice()),
            totalPayment: parseInt(payment),
            transactionDate: `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`,
            transactionItems: cartGlobal.cartList,
        })
            .then((result) => {
                alert("Payment Successfull!")
                result.data.transactionItems.forEach((val) => {
                    deleteCartHandler(val.id)
                })
            })
            .catch(() => {
                alert("Server Error Cart Axios Post")
            })
    }

    return <>
        {/* <div>
            <h1>{userGlobal.id}</h1>
            <h1>{cartGlobal.cartList[1].price}</h1>
        </div> */}
        <div className="p-5 text-center">
            <h1>Cart</h1>
            <div className="row mt-5">
                <div className="col-9 text-center">
                    <table className="table">
                        <thead className="thead-light">
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Image</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderCart()}
                        </tbody>
                        <tfoot className="bg-light">
                            <tr>
                                <td colSpan="6">
                                    <button onClick={checkoutModeToggle} className="btn btn-success">
                                        Checkout
                                    </button>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                {
                    isCheckoutMode ?
                        <div className="col-3">
                            <div className="card text-left">
                                <div className="card-header">
                                    <strong>Order Summary</strong>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex my-2 flex-row justify-content-between align-items-center">
                                        <span className="font-weight-bold">Subtotal</span>
                                        <span>Rp{renderSubtotalPrice().toLocaleString("id-ID")}</span>
                                    </div>
                                    <div className="d-flex my-2 flex-row justify-content-between align-items-center">
                                        <span className="font-weight-bold">Tax (10%)</span>
                                        <span>Rp{renderTaxFee().toLocaleString("id-ID")}</span>
                                    </div>
                                    <div className="d-flex my-2 flex-row justify-content-between align-items-center">
                                        <span className="font-weight-bold">Total</span>
                                        <span>Rp{renderTotalPrice().toLocaleString("id-ID")}</span>
                                    </div>
                                </div>
                                <div className="card-body border-top">
                                    <label htmlFor="recipientName">Recipient Name</label>
                                    <input onChange={(event) => setRecipientName(event.target.value)} type="text" className="form-control mb-3" name="recipientName" />
                                    <label htmlFor="address">Address</label>
                                    <input onChange={(event) => setAddress(event.target.value)} type="text" className="form-control" name="address" />
                                </div>
                                <div className="card-footer">
                                    <div className="d-flex flex-row justify-content-between align-items-center">
                                        <input onChange={(event) => setPayment(event.target.value)} name="payment" className="form-control mx-1" placeholder="Insert Money here..." type="number" />
                                        <button onClick={payBtnHandler} className="btn btn-success mx-1">Pay</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : null
                }
            </div>
        </div>
        )
    </>
};


export default Cart;