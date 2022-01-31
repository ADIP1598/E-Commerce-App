import Axios from 'axios'
import { API_URL } from '../../constants/API'

export const getCartData = (userData) => {
    return (dispatch) => {
        // ambil dari db lalu lempar ke global state
        Axios.get(`${API_URL}/carts`, {
            params: {
                userId: userData,
            }
        })
            .then((result) => {
                // Ubah Global State
                dispatch({
                    type: "FILL_CART",
                    payload: result.data,
                })
            })
            .catch(() => {
                alert("Server Error! (redux/actions/cart.js)")
            })
    }
}

