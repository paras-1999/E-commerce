import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';

export default function Orders() {
    const [items, setItems] = useState([]);
    useEffect(() => {
        if (localStorage.getItem('cart') != undefined) {
            let list = JSON.parse(localStorage.getItem('cart'));
            setItems(list);
        }
    }, [])
    return (
        <>
            <Row>
                <Col sx={12} md={8} lg={8}>
                    {items.map((val, i) =>
                        <div className='cartitem w-100 '>

                        </div>
                    )}
                </Col>
                <Col sx={12} md={8} lg={8}></Col>
            </Row>


        </>
    )
}
