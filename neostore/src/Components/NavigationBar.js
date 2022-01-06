import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap'
export default function NavigationBar() {
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
                            <Nav.Link as={Link} to="/orders" >Order</Nav.Link>

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
                            <Nav.Link as={Link} to="/cart" style={{ marginLeft: '0.5rem' }}><i className="bi bi-cart2" style={{ fontSize: "26px" }}></i>
                            </Nav.Link>
                            <NavDropdown style={{ marginLeft: '0.5rem' }} className='text-light' title={<i className="bi bi-person-circle" style={{ fontSize: "26px" }}>&nbsp;</i>
                            } id="collasible-nav-dropdown">
                                {sessionStorage.getItem('_token') == undefined ? <>
                                    <NavDropdown.Item as={Link} to="/LoginSignup">Login&nbsp; &nbsp; <i className="bi bi-arrow-right-circle ms-4 text-dark"></i></NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/LoginSignup/?register=true" >Register<i className="bi bi-person-plus ms-4 text-dark"></i></NavDropdown.Item>
                                </> : <>
                                    <NavDropdown.Item as={Link} to="/profile/update" >Profile &nbsp;&nbsp;<i className="bi bi-person ms-4 text-dark"></i></NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/LoginSignup" >Log Out <i className="bi bi-box-arrow-right  ms-4 text-dark" ></i></NavDropdown.Item>
                                </>}
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div >
    )
}