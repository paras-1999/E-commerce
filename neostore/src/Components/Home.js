import React from 'react'
import { Carousel } from 'react-bootstrap'
const thumbnail = ['shoes.jpg', 'tshirt.jpg', 'iwatch.jpg', 'iphone.jpeg']
export default function Home() {
    return (
        <>
            <Carousel>
                {thumbnail.map((img) =>
                    <Carousel.Item>
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
        </>
    )
}
