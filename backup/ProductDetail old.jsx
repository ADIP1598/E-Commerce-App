import React from "react";
import Axios from 'axios';
import { API_URL } from '../constants/API'
import { useParams } from 'react-router-dom'

class ProductDetail extends React.Component {
    state = {
        productData: {},
        productNotFound: false,
    }

    fetchProductData = () => {
        // const ProductDetail = () => {
        //     const { productId }: { productId: number } = useParams();
        // }
        Axios.get(`${API_URL}/products`, {
            params: {
                // id: { productId }
                id: this.props.match.params.productId
            }
        })
            .then((result) => {
                if (result.data.length) {
                    this.setState({ productData: result.data[0] })
                } else {
                    this.setState({ productNotFound: true })
                }
            })
            .catch(() => {
                alert("Server Error!")
            })
    }

    componentDidMount() {
        this.fetchProductData()
    }

    render() {
        return (
            <div className="container">
                {
                    this.state.productNotFound ?
                        <div className="alert alert-warning mt-3"> Product with ID {this.props.match.params.productId} has not been found</div>
                        :
                        <div className="row mt-3">
                            <div className="col-6">
                                <img
                                    style={{ width: "100%" }}
                                    src={this.state.productData.productImage}
                                    alt=""
                                />
                            </div>
                            <div className="col-6 d-flex flex-column justify-content-center">
                                <h4>{this.state.productData.productName}</h4>
                                <h5>Rp{this.state.productData.price}</h5>
                                <p>
                                    {this.state.productData.description}
                                </p>
                                <div className="d-flex flex-row align-items-center">
                                    <button className="btn btn-primary mr-4">
                                        -
                                    </button>
                                    2
                                    <button className="btn btn-primary mx-4">
                                        +
                                    </button>
                                </div>
                                <button className="btn btn-success">
                                    Add to cart
                                </button>
                            </div>
                        </div>
                }
            </div>
        )
    }
}

export default ProductDetail;