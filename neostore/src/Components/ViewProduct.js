import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Button, Col, Row, Alert } from 'react-bootstrap';
import { rater, viewProduct } from '../config/Myservice';
import { FacebookShareButton, TwitterShareButton, EmailShareButton, WhatsappShareButton, PinterestShareButton } from "react-share";
import { FacebookIcon, TwitterIcon, EmailIcon, PinterestIcon, WhatsappIcon } from "react-share";
import { useDispatch } from 'react-redux'
import { addToCart } from '../redux/action'
import Magnifier from "react-magnifier";
import { Rating } from 'react-simple-star-rating'
export default function ViewProduct() {
    const [details, setDetails] = useState(null);
    const [err, setErr] = useState({ msg: "", show: false });
    const [index, setIndex] = useState(0);
    const dispatch = useDispatch();
    const location = useLocation();
    const [rating, setRating] = useState(0)
    const [done, setDone] = useState(false)
    const handleRating = (rate) => {
        let newRating = Math.ceil((details.product_rating + (rate / 20)) / 2)
        setDetails(preVal => { return { ...preVal, product_rating: newRating, product_rating_count: preVal.product_rating_count + 1 } })
        let up = { product_rating: newRating, product_rating_count: details.product_rating_count + 1 };
        rater(up, details._id).then(res => {
            alert(res.data)
        })
        setRating(rate)
        setDone(true)
    }
    useEffect(() => {
        viewProduct(location.search).then((res => {
            setDetails(res.data)
        }))
    }, [])
    const cartCheck = (item) => {
        let list = [];
        const x = { id: item._id, pname: item.product_name, pimg: item.product_image, price: item.product_cost, quantity: 1 };
        if (localStorage.getItem('cart') != undefined) {
            list = JSON.parse(localStorage.getItem('cart'));
            let result = list.find(({ id }) => id === item._id);
            if (result !== undefined) {
                setErr({ msg: `${item.product_name} Is In Cart Already`, show: true });
            }
            else {
                list.push(x);
                localStorage.setItem('cart', JSON.stringify(list));
                dispatch(addToCart());
            }
        }
        else {
            list.push(x)
            localStorage.setItem('cart', JSON.stringify(list));
            dispatch(addToCart());
        }
    }
    return (
        <>{
            details ? <>{err.show && <Alert variant="danger" className='mx-auto w-75 my-3' onClose={() => setErr({ msg: "", show: false })} dismissible>
                <Alert.Heading>{err.msg}</Alert.Heading>
            </Alert>}
                <Row className="container-fluid mt-3">
                    <Col sx={12} md={5} lg={5}>
                        <Magnifier src={`./images/${details.product_subimages[index]}`} height={350} className='d-block mx-auto mb-3 shadow' />
                        {/* <img src={`./images/${details.product_subimages[index]}`} height={350} style={{ cursor: '' }} className='d-block mx-auto mb-3 shadow' /> */}
                        <div style={{ display: "flex", justifyContent: 'space-evenly' }}>
                            {details.product_subimages.map((val, i) =>
                                <img key={val} src={`./images/${details.product_subimages[i]}`} className='subimages' onClick={() => setIndex(i)} />
                            )}
                        </div>
                    </Col>
                    <Col sx={12} md={7} lg={7}>
                        <h1>{details.product_name}</h1>
                        <Rating ratingValue={details.product_rating * 20} fillColor='#14BDEB' readonly={true} />
                        <hr />
                        <h5>Price : ???<span className='text-success'>{details.product_cost}</span></h5>
                        <h5>Color : <span style={{ display: "inline-block", height: '20px', width: "50px", borderRadius: "10px", background: details.color_id.color_code }} ></span></h5>
                        <h5 style={{ display: "inline-block" }}>Share </h5> <i className="bi bi-share-fill text-dark" style={{ fontSize: "30px", display: "inline-block" }}></i>
                        <div style={{ display: "flex", width: "40%", justifyContent: "space-between", marginBottom: "20px" }}>
                            <FacebookShareButton
                                url={"https://github.com/paras-1999"}
                            >
                                <FacebookIcon size={50} round />
                            </FacebookShareButton>

                            <TwitterShareButton
                                url={"https://github.com/paras-1999"}
                            >
                                <TwitterIcon size={50} round />
                            </TwitterShareButton>

                            <EmailShareButton
                                url={"https://github.com/paras-1999"}
                            >
                                <EmailIcon size={50} round />
                            </EmailShareButton>

                            <WhatsappShareButton
                                url={"https://github.com/paras-1999"}
                            >
                                <WhatsappIcon size={50} round />
                            </WhatsappShareButton>

                            <PinterestShareButton
                                url={`http://localhost:3000/images/${details.product_subimages[0]}`}
                            >
                                <PinterestIcon size={50} round />
                            </PinterestShareButton>
                        </div>
                        <Button variant='danger' className='me-3' size='lg' onClick={() => cartCheck(details)}>Add To Cart <i className="bi bi-cart2" ></i></Button>
                        <Button variant='dark' className='m-2 text-info'>Rate Product <Rating onClick={handleRating} ratingValue={rating} fillColor='#14BDEB' size={34} transition={true} readonly={done} /></Button>

                        <h5>Description : </h5>
                        <ul>
                            <li>Category : {details.category_id.category_name}</li>
                            <li>Color : {details.color_id.color_name}</li>
                        </ul>
                        <p >{details.product_desc}</p>
                    </Col>
                </Row></> : <div ><img src='./images/404.gif' height={'350px'} className='d-block mx-auto' /><h1 id='notfound'>Page Not Found</h1></div>
        }

        </>
    )
}
