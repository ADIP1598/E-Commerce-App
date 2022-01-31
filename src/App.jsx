import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css"

import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Admin from './pages/Admin';
import Cart from './pages/Cart';
import History from './pages/History';
import ProductDetail from './pages/ProductDetail';
import MyNavbar from './components/MyNavbar';

import { connect } from 'react-redux'
import { userKeepLogin, checkStorage } from './redux/actions/user'
import { getCartData } from './redux/actions/cart'

class App extends React.Component {

  componentDidMount() {
    const userLocalStorage = localStorage.getItem("userDataEmmerce")

    if (userLocalStorage) {
      const userData = JSON.parse(userLocalStorage);
      this.props.userKeepLogin(userData);
      this.props.getCartData(userData.id);
    } else {
      this.props.checkStorage();
    }
  }

  render() {
    if (this.props.userGlobal.storageIsChecked) {
      return (
        <BrowserRouter>
          <MyNavbar />
          <Routes>
            <Route element={<Login />} path="/login/*" />
            <Route element={<Register />} path="/register" />
            <Route element={<Admin />} path="/admin" />
            <Route element={<Cart />} path="/cart" />
            <Route element={<History />} path="/history" />
            <Route element={<ProductDetail />} path="/product-detail/:productId" />
            <Route element={<Home />} path="/" />
          </Routes>
        </BrowserRouter>
      )
    }
    return (
      <div>
        Loading...
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userGlobal: state.user,
  }
}

const mapDispatchToProps = {
  userKeepLogin,
  checkStorage,
  getCartData,
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

// Function Asyncronus
// Axios
// jsx
// react
