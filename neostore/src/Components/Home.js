import React, { useEffect, useState } from 'react';
import { Carousel, Col, Row } from 'react-bootstrap';
import { getCategories, getColors } from '../config/Myservice';
import { useNavigate } from 'react-router-dom';
const thumbnail = ['shoes.jpg', 'tshirt.jpg', 'iwatch.jpg', 'iphone.jpeg'];
export default function Home() {
    const [cat, setCat] = useState([]);
    const [color, setColor] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        getCategories().then(res => {
            setCat(res.data)
        })
        getColors().then(res => {
            setColor(res.data)
        })
    }, [])
    return (
        < >
            <Carousel>
                {thumbnail.map((img, i) =>
                    <Carousel.Item key={i}>
                        <img
                            className="d-block w-100"
                            src={`./images/${img}`}
                            height='550px'
                        />
                        <Carousel.Caption>
                            <button className="cta">
                                <span className={img == "shoes.jpg" ? 'text-dark' : ''}>Click Here To View The Offer</span>
                                <svg width="15px" height="10px" viewBox="0 0 13 10">
                                    <path d="M1,5 L11,5"></path>
                                    <polyline points="8 1 12 5 8 9"></polyline>
                                </svg>
                            </button>
                        </Carousel.Caption>
                    </Carousel.Item>
                )}
            </Carousel>
            <Row className='container my-4 mx-auto'>
                {cat.map((val, i) =>

                    <Col sm={12} md={3} lg={3} key={i}><div className='homecat'><img src={`./images/${val.category_image}`} width="80%" height='80%' style={{ cursor: 'pointer' }} onClick={() => { navigate(`products?&category_id=${val._id}`) }} />
                        <h6>{val.category_name}</h6>
                        {color.map((col, j) => {
                            return (<span key={j} style={{ backgroundColor: col.color_code }} onClick={() => navigate(`products?color_id=${col._id}&category_id=${val._id}`)}></span>)
                        })}
                    </div></Col>
                )}
            </Row>
        </>
    )
}
