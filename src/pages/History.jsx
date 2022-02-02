import React from "react";
import Axios from 'axios';
import { API_URL } from "../constants/API";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";

const History = () => {
    const userGlobal = useSelector((state) => state.user)
    const [transactions, setTransactions] = useState([])
    const [seeDetailsBtnHandler, setSeeDetailsBtnHandler] = useState(false)

    const fetchTransaction = () => {
        Axios.get(`${API_URL}/transactions`, {
            params: {
                userId: userGlobal.id
            }
        })
            .then((result) => {
                setTransactions(result.data)
            })
            .catch(() => {
                alert("Server Error (History.jsx)")
            })
    }

    const detailsBtnHandler = () => {
        setSeeDetailsBtnHandler(true)
    }

    const renderTransactions = () => {
        return transactions.map((transaction) => {
            // console.log(transaction.transactionItems)
            return (
                <tr>
                    <td>{transaction.transactionDate}</td>
                    <td>{transaction.transactionItems.length} Item(s)</td>
                    <td>Rp{transaction.totalPrice.toLocaleString("id-ID")}</td>
                    <td>
                        <button onClick={() => detailsBtnHandler(transaction.transactionItems)} className="btn btn-warning">See details</button>
                    </td>
                </tr>
            )
        })
    }

    // const renderTransactionsDetail = () => {
    //     console.log(transactions)
    //     transactions.map((transaction) => {
    //         console.log(transaction.transactionItems)
    //         transaction.transactionItems.map((transactionDetail) => {
    //             console.log(transactionDetail.productName)
    //             return (
    //                 <div className="d-flex my-2 flex-row justify-content-between align-items-center">
    //                     <span className="font-weight-bold">{transactionDetail.productName} {transactionDetail.quantity}</span>
    //                     <span>Rp{transactionDetail.price * transactionDetail.quantity}</span>
    //                 </div>
    //             )
    //         })
    //     })
    // }
    const renderTransactionsDetail = () => {
        console.log(transactions[0].transactionItems)
        transactions.map((transaction) => {
            console.log(transaction.transactionItems)
            return (
                <div className="d-flex my-2 flex-row justify-content-between align-items-center">
                    <span className="font-weight-bold">{transaction.productName} {transaction.quantity}</span>
                    <span>Rp{transaction.price * transaction.quantity}</span>
                </div>
            )
        })
    }

    useEffect(() => {
        fetchTransaction()
    }, [])

    return (
        <div className="p-5">
            <h1>Transaction History</h1>
            <div className="row mt-5">
                <div className="col-8">
                    <table className="table">
                        <thead className="thead-light">
                            <tr>
                                <th>Transaction Date</th>
                                <th>Total Items</th>
                                <th>Total Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderTransactions()}
                        </tbody>
                    </table>
                </div>
                <div className="col-4">
                    {
                        seeDetailsBtnHandler ?
                            <div className="card">
                                <div className="card-header">
                                    <strong>Transaction Details</strong>
                                </div>
                                <div className="card-body">
                                    {renderTransactionsDetail()}
                                </div>
                            </div>
                            : null
                    }
                </div>
            </div>
        </div>
    )
};

export default History;
