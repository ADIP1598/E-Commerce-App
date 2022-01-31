import React from "react";
import ProductCard from "../components/ProductCard"
import Axios from 'axios'
import { API_URL } from "../constants/API"

class Home extends React.Component {
    state = {
        productList: [],
        filteredProductList: [],
        page: 1,
        maxPage: 0,
        itemPerPage: 6,
        searchProductName: "",
        searchCategory: "",
        sortBy: "",
    }

    fetchProducts = () => {
        Axios.get(`${API_URL}/products`)
            .then((result) => {
                this.setState({ productList: result.data, maxPage: Math.ceil(result.data.length / this.state.itemPerPage), filteredProductList: result.data })
            })
            .catch(() => {
                alert("Terjadi kesalahan di server")
            })
    }

    renderProducts = () => {
        const begininningIndex = (this.state.page - 1) * this.state.itemPerPage
        let rawData = [...this.state.filteredProductList]

        const compareString = (a, b) => {
            if (a.productName < b.productName) {
                return -1;
            }
            if (a.productName > b.productName) {
                return 1;
            }
            return 0;
        }

        switch (this.state.sortBy) {
            case "lowPrice":
                rawData.sort((a, b) => a.price - b.price)
                break;
            case "highPrice":
                rawData.sort((a, b) => b.price - a.price)
                break;
            case "az":
                rawData.sort(compareString)
                break;
            case "za":
                rawData.sort((a, b) => compareString(b, a))
                break;
            default:
                rawData = [...this.state.filteredProductList];
                break;
        }
        const currentData = rawData.slice(begininningIndex, begininningIndex + this.state.itemPerPage)
        return currentData.map((val) => {
            return <ProductCard productData={val} />
        })
    }

    nextPageHandler = () => {
        if (this.state.page < this.state.maxPage) {
            this.setState({ page: this.state.page + 1 })
        }
    }

    prevPageHandler = () => {
        if (this.state.page > 1) {
            this.setState({ page: this.state.page - 1 })
        }
    }

    inputHandler = (event) => {
        const name = event.target.name
        const value = event.target.value

        this.setState({ [name]: value })
    }

    searchBtnHandler = () => {
        console.log(this.state.searchProductName);
        const filteredProductList = this.state.productList.filter((val) => {
            return val.productName.toLowerCase().includes(this.state.searchProductName.toLowerCase()) && val.category.toLowerCase().includes(this.state.searchCategory.toLowerCase());
        })
        this.setState({ filteredProductList, maxPage: Math.ceil(filteredProductList.length / this.state.itemPerPage), page: 1 })
    }

    componentDidMount() {
        this.fetchProducts();
    }

    // searchLangsung = (event) => {
    //     this.setState({ searchProductName: event.target.value })
    //     console.log(this.state.searchProductName)
    // this.searchBtnHandler();
    // }

    render() {
        return (
            <div className="container mt-5">
                <div className="row">
                    <div className="col-3">
                        <div className="card">
                            <div className="card-header bg-warning">
                                <strong>Filter Products</strong>
                            </div>
                            <div className="card-body">
                                <label htmlFor="searchProductName">Product Name</label>
                                <input
                                    onChange={this.inputHandler}
                                    // onChange={this.searchLangsung}
                                    name="searchProductName"
                                    type="text"
                                    className="form-control mb-3"
                                />
                                {/* <label className="mb-3" htmlFor="searchCategory">Product Brand</label>
                                <select onChange={this.inputHandler} name="searchCategory" id="form-control">
                                    <option value="">All</option>
                                    <option value="intel">Intel</option>
                                    <option value="amd">AMD</option>
                                    <option value="asus">Asus</option>
                                    <option value="msi">MSI</option>
                                    <option value="corsair">Corsair</option>
                                    <option value="gskill">Gskill</option>
                                    <option value="samsung">Samsung</option>
                                    <option value="seagate">Seagate</option>
                                </select> */}
                                <label htmlFor="searchCategory">Product Category</label>
                                <br></br>
                                <select onChange={this.inputHandler} name="searchCategory" id="form-control">
                                    <option value="">All</option>
                                    <option value="cpu">CPU</option>
                                    <option value="motherboard">Motherboard</option>
                                    <option value="ram">RAM</option>
                                    <option value="ssd">SSD</option>
                                    <option value="vga">VGA</option>
                                    <option value="psu">PSU</option>
                                </select>
                                <br></br>
                                <button onClick={this.searchBtnHandler} className="btn btn-warning mt-3">
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className="card mt-4">
                            <div className="card-header bg-warning">
                                <strong>Sort Products</strong>
                            </div>
                            <div className="card-body">
                                <label htmlFor="sortBy">Sort by</label>
                                <br></br>
                                <select onChange={this.inputHandler} name="sortBy" id="form-control">
                                    <option value="">Default</option>
                                    <option value="lowPrice">Lowest Price</option>
                                    <option value="highPrice">Highest Price</option>
                                    <option value="az">A-Z</option>
                                    <option value="za">Z-A</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="d-flex flex-row justify-content-between align-items-center">
                                <button disabled={this.state.page === 1} onClick={this.prevPageHandler} className="btn btn-dark">
                                    {"<"}
                                </button>
                                <div className="text-center">Page {this.state.page} of {this.state.maxPage}</div>
                                <button disabled={this.state.page === this.state.maxPage} onClick={this.nextPageHandler} className="btn btn-dark">
                                    {">"}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-9">
                        <div className="d-flex flex-wrap flex-row">
                            {this.renderProducts()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;