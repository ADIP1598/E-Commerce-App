import React from 'react'
import { Navbar, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, NavbarText, NavbarBrand, DropdownMenu, DropdownItem } from 'reactstrap'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser } from '../redux/actions/user';

class MyNavbar extends React.Component {
    render() {
        return (
            <div>
                <Navbar color="light" light>
                    <Container>
                        <Nav>
                            <Link to="/" style={{ textDecoration: "none" }}>
                                <NavbarBrand>Trash Can</NavbarBrand>
                            </Link>
                        </Nav>
                        <Nav>
                            {
                                this.props.userGlobal.userName ?
                                    <>
                                        <NavItem>
                                            <NavLink>Hello, {this.props.userGlobal.userName}!</NavLink>
                                        </NavItem>
                                        <UncontrolledDropdown nav inNavbar>
                                            <DropdownToggle nav caret>
                                                Pages
                                            </DropdownToggle>
                                            <DropdownMenu end>
                                                <DropdownItem>
                                                    <Link to="/cart">Cart</Link>
                                                </DropdownItem>
                                                <DropdownItem>
                                                    <Link to="/history">History</Link>
                                                </DropdownItem>
                                                {
                                                    this.props.userGlobal.role === "admin" ?
                                                        <DropdownItem>
                                                            <Link to="/admin">Admin</Link>
                                                        </DropdownItem>
                                                        : null
                                                }
                                                <DropdownItem />
                                                <DropdownItem onClick={this.props.logoutUser}>
                                                    Logout
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </>
                                    :
                                    <NavItem>
                                        <NavbarText>
                                            <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
                                        </NavbarText>
                                    </NavItem>
                            }
                        </Nav>
                    </Container>
                </Navbar>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userGlobal: state.user
    }
}

const mapDispatchToProps = {
    logoutUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(MyNavbar);