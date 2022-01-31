import React from 'react'
import { Nav, Navbar, NavDropdown, Container, Dropdown, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser } from '../redux/actions/user';
import "../assets/styles/navbar.css"

class MyNavbar extends React.Component {
    render() {
        return (
            <Navbar bg="warning" variant="light">
                <Container>
                    <Navbar.Brand>
                        <Link to="/" style={{ textDecoration: "none", color: "inherit", fontWeight: 700, fontSize: 20 }}>Trash Can</Link>
                    </Navbar.Brand>
                    <Nav>
                        {
                            this.props.userGlobal.userName ?
                                <>
                                    <Navbar.Text>
                                        Hello, {this.props.userGlobal.userName}!
                                    </Navbar.Text>
                                    <Dropdown className="me-auto">
                                        <Dropdown.Toggle variant="warning" >Pages</Dropdown.Toggle>
                                        <Dropdown.Menu id="dropdown-menu">
                                            <Dropdown.Item href="/cart">Cart ({this.props.cartGlobal.cartList.length})</Dropdown.Item>
                                            <Dropdown.Item href="/history">History</Dropdown.Item>
                                            {
                                                this.props.userGlobal.role === "admin" ?
                                                    <NavDropdown.Item href="/admin">Admin</NavDropdown.Item>
                                                    : null
                                            }
                                            <Dropdown.Divider />
                                            <Dropdown.Item onClick={this.props.logoutUser}>Logout</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </>
                                :
                                <Navbar.Text>
                                    <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
                                </Navbar.Text>
                        }
                    </Nav>
                </Container>
            </Navbar >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userGlobal: state.user,
        cartGlobal: state.cart,
    }
}

const mapDispatchToProps = {
    logoutUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(MyNavbar);