import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { setCart } from '../redux/action';
import jwt_decode from 'jwt-decode'
import { pendingCart, pendingList } from '../config/Myservice';
export default function NavigationBar() {
    const count = useSelector((state) => state.cartReducer);
    const dispatch = useDispatch();
    const naviagte = useNavigate()
    useEffect(() => {
        let items;
        if (sessionStorage.getItem('_token') != undefined) {
            let token = sessionStorage.getItem("_token");
            let decode = jwt_decode(token);
            pendingCart(decode.email).then((res) => {
                if (res.data) {
                    items = [...res.data.items];
                    if (localStorage.getItem('cart') != undefined) {
                        let sub = JSON.parse(localStorage.getItem('cart'));
                        sub.map((x) => {
                            let check = 1;
                            items.map((y) => {
                                if (x.id == y.id) {
                                    y.quantity += x.quantity;
                                    check = 0;
                                }
                            })
                            if (check) {
                                items.push(x)
                            }
                        })
                    }
                    localStorage.setItem('cart', JSON.stringify(items));
                    dispatch(setCart(items.length));
                }
                else if (localStorage.getItem("cart") != undefined) {
                    dispatch(setCart(JSON.parse(localStorage.getItem("cart")).length));
                }
            })
        }
        else if (localStorage.getItem("cart") != undefined) {
            dispatch(setCart(JSON.parse(localStorage.getItem("cart")).length));
        }
    }, [])
    const logout = () => {
        if (localStorage.getItem('cart') != undefined) {
            let temp = JSON.parse(localStorage.getItem('cart'));
            let token = sessionStorage.getItem("_token");
            let decode = jwt_decode(token);
            pendingList(temp, decode.email).then(() => {
                localStorage.removeItem('cart')
                naviagte('/LoginSignup')
                dispatch(setCart())
            })
        }
        else {
            naviagte('/LoginSignup')
        }
    }
    return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand style={{ fontSize: '2rem', fontWeight: '900', color: "#00C2D1", fontFamily: "'Fjalla One', sans-serif" }}>Neo<span className='text-danger'>Store</span></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto text-light">
                            <Nav.Link as={Link} to="/" >Home</Nav.Link>
                            <Nav.Link as={Link} to="/products" >Products</Nav.Link>
                            <Nav.Link as={Link} to="/orders" disabled={sessionStorage.getItem('_token') != undefined ? false : true} >Order</Nav.Link>

                        </Nav>
                        <Nav>
                            <Form className="d-flex">
                                <FormControl
                                    type="search"
                                    placeholder="Search"
                                    className="me-2 "
                                    aria-label="Search"
                                    style={{ width: '20vw' }}

                                />
                                <Button variant="outline-light mt-2" style={{ height: '38px' }}><i className="bi bi-search" style={{ color: 'inherit' }}></i></Button>
                            </Form>
                            <Nav.Link as={Link} to="/cart" style={{ marginLeft: '0.5rem' }}><i className="bi bi-cart2 position-relative" style={{ fontSize: "26px" }}><span style={{ fontSize: "12px" }} className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{count}</span></i>
                            </Nav.Link>
                            <NavDropdown style={{ marginLeft: '0.5rem' }} className='text-light' title={<i className="bi bi-person-circle" style={{ fontSize: "26px" }}>&nbsp;</i>
                            } id="collasible-nav-dropdown">
                                {sessionStorage.getItem('_token') == undefined ? <>
                                    <NavDropdown.Item as={Link} to="/LoginSignup">Login&nbsp; &nbsp; <i className="bi bi-arrow-right-circle ms-4 text-dark"></i></NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/LoginSignup/?register=true" >Register<i className="bi bi-person-plus ms-4 text-dark"></i></NavDropdown.Item>
                                </> : <>
                                    <NavDropdown.Item as={Link} to="/profile/update" >Profile &nbsp;&nbsp;<i className="bi bi-person ms-4 text-dark"></i></NavDropdown.Item>
                                    <NavDropdown.Item onClick={logout} >Log Out <i className="bi bi-box-arrow-right  ms-4 text-dark" ></i></NavDropdown.Item>
                                </>}
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div >
    )
}
// useEffect(() => {
//     let items;
//     if (sessionStorage.getItem('_token') != undefined) {
//         let token = sessionStorage.getItem("_token");
//         let decode = jwt_decode(token);
//         pendingCart(decode.email).then((res) => {
//             if (res.data) {
//                 items = [...res.data.items];
//                 if (localStorage.getItem('cart') != undefined) {
//                     items = [...items, ...JSON.parse(localStorage.getItem('cart'))];
//                 }
//                 localStorage.setItem('cart', JSON.stringify(items));
//                 dispatch(setCart(items.length));
//             }
//             else {
//                 dispatch(setCart(JSON.parse(localStorage.getItem("cart")).length));
//             }
//         })
//     }
//     else {
//         dispatch(setCart(JSON.parse(localStorage.getItem("cart")).length));
//     }
// }, [])