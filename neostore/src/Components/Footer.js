import React from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
export default function Footer() {
    return (
        <div className='bg-dark container-fluid test'>
            <Row >
                <Col sm={12} md={4} className='footer' >
                    <h4>About Company</h4>
                    <p>NeoSoft Technologies Is Here At Your Quick And Easy Service For Shoping</p>
                    <p>Contact Information</p>
                    <p>Email : contanct@neoSofttech.com</p>
                    <p>Phone : +91 9876543210</p>
                    <p>Noida ,India</p>
                </Col>
                <Col sm={12} md={4} className='footer' >
                    <h4>Information</h4>
                    <p><a href='http://localhost:3000/tandc.pdf' target='_blank'>Terms & Conditions</a></p>
                    <p>Gurantee & Return Policy</p>
                    <p>Contact Us</p>
                    <p>Privacy Policy</p>
                    <p>Locate Us</p>
                </Col>
                <Col sm={12} md={4} className='footer' >
                    <h4>Newsletter</h4>
                    <p>Signup To Get Exclusive Offer From Our Favorite Brands & To Be Well Up In The News</p>
                    <Form>
                        <Form.Control className='finput' type="email" placeholder="Enter email...." />
                        <Button variant="outline-light" className='fbtn' type="submit">
                            Suscribe
                        </Button>
                    </Form>
                </Col>
                <Col className='footer'><p style={{ fontSize: "11px" }}>Copyright © 2022 NeoSoft Technologies All Right Reserved | Design By Paras Saxena</p></Col>
            </Row>
        </div>
    )
}
