import React, { useEffect, useState } from 'react'
import { getCategories, getColors, getproducts } from '../config/Myservice';
import ReactPaginate from 'react-paginate';
import { Card, Button, Col, Row, Form, NavDropdown, Modal, Nav } from 'react-bootstrap';
import Rating from './Rating';
import { useLocation } from 'react-router-dom';
// import { ShareSocial } from 'react-share-social';
import { FacebookShareButton, TwitterShareButton, EmailShareButton, WhatsappShareButton, PinterestShareButton } from "react-share";
import { FacebookIcon, TwitterIcon, EmailIcon, PinterestIcon, WhatsappIcon } from "react-share";
export default function Products() {
    const [products, setProducts] = useState([]);
    const [colors, setColors] = useState([]);
    const [category, setCategory] = useState([]);
    const [show, setShow] = useState(false);
    const [details, setDetails] = useState(null);
    const [index, setIndex] = useState(0)
    const location = useLocation();
    useEffect(() => {
        getproducts(location.search).then((res) => {
            setProducts(res.data)
        })
        getColors().then((res) => {
            setColors(res.data)
        })
        getCategories().then((res) => {
            setCategory(res.data)
        })
    }, [])
    function Items({ currentItems }) {
        return (
            <Row className='g-4 container-fluid my-1 pagi'>
                {currentItems &&
                    currentItems.map((item, i) => (
                        <Col sm={12} md={4} key={i}>
                            <Card style={{ width: '100%' }} className='shadow'>
                                <Card.Img variant="top" src={`./images/${item.product_image}`} height={350} style={{ cursor: "pointer" }} onClick={() => { setShow(true); setDetails(item) }} />
                                <Card.Body>
                                    <Card.Title style={{ cursor: "pointer" }} onClick={() => { setShow(true); setDetails(item) }}>{item.product_name}</Card.Title>
                                    <Rating count={item.product_rating} />
                                    <Button variant="danger">Add To Cart</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
            </Row>
        );
    }
    function PaginatedItems({ itemsPerPage }) {
        const [currentItems, setCurrentItems] = useState(null);
        const [pageCount, setPageCount] = useState(0);
        const [itemOffset, setItemOffset] = useState(0);
        useEffect(() => {
            const endOffset = itemOffset + itemsPerPage;
            setCurrentItems(products.slice(itemOffset, endOffset));
            setPageCount(Math.ceil(products.length / itemsPerPage));
        }, [itemOffset, itemsPerPage]);
        const handlePageClick = (event) => {
            const newOffset = (event.selected * itemsPerPage) % products.length;
            setItemOffset(newOffset);
            //scroll back to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };
        return (
            <>
                <Items currentItems={currentItems} />
                <ReactPaginate
                    breakLabel="..."
                    nextLabel={`Next`}
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    pageCount={pageCount}
                    previousLabel=" Previous "
                    renderOnZeroPageCount={null}
                />
            </>
        );
    }
    return (
        <div className='ppage'>
            <div>
                <Form className='text-center'>
                    <Button type='reset' variant='danger my-3' >All Products</Button>
                    <NavDropdown.Divider className='mx-auto' style={{ width: '80%' }} />
                    {colors.map((val, i) => {
                        return (<Form.Check
                            key={i}
                            inline
                            className='w-100'
                            label={val.color_name}
                            name="color"
                            type='radio'
                            value={val._id}
                            id={val.color_code}
                        />)
                    }
                    )}
                    <NavDropdown.Divider className='mx-auto' style={{ width: '80%' }} />
                    {category.map((val, i) => {
                        return (<Form.Check
                            key={i}
                            inline
                            className='w-100'
                            label={val.category_name}
                            name="category"
                            type='radio'
                            value={val._id}
                            id={val.category_image}
                        />)
                    }
                    )}
                    <NavDropdown.Divider className='mx-auto' style={{ width: '80%' }} />
                    <Button type='submit' variant='danger my-3' >Apply Filter</Button>
                </Form>
            </div>
            <div>
                <PaginatedItems itemsPerPage={9} />
            </div>
            {details && <Modal show={show} fullscreen onHide={() => { setShow(false); setIndex(0); setDetails(null); }}>
                <Modal.Header closeButton>
                    <Modal.Title>{`${details.category_id.category_name} (${details.color_id.color_name})`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sx={12} md={5} lg={5}>
                            <img src={`./images/${details.product_subimages[index]}`} height={350} style={{ cursor: '' }} className='d-block mx-auto mb-3 shadow' />
                            <div style={{ display: "flex", justifyContent: 'space-evenly' }}>
                                {details.product_subimages.map((val, i) =>
                                    <img key={val} src={`./images/${details.product_subimages[i]}`} className='subimages' onClick={() => setIndex(i)} />
                                )}
                            </div>
                        </Col>
                        <Col sx={12} md={7} lg={7}>
                            <h1>{details.product_name}</h1>
                            <Rating count={details.product_rating} />
                            <hr />
                            <h5>Price : ₹<span className='text-success'>{details.product_cost}</span></h5>
                            <h5>Color : <span style={{ display: "inline-block", height: '20px', width: "50px", borderRadius: "10px", background: details.color_id.color_code }} ></span></h5>
                            {/* <ShareSocial
                                url="https://github.com/paras-1999"
                                socialTypes={['facebook', 'twitter', 'reddit', 'linkedin']}
                            /> */}
                            <h5 style={{ display: "inline-block" }}>Share </h5> <i class="bi bi-share-fill text-dark" style={{ fontSize: "30px", display: "inline-block" }}></i>
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
                                    // url={"https://github.com/paras-1999"}
                                    url={`http://localhost:3000/images/${details.product_subimages[0]}`}
                                >
                                    <PinterestIcon size={50} round />
                                </PinterestShareButton>
                            </div>
                            <Button variant='danger'>Add To Cart <i className="bi bi-cart2" ></i></Button>
                            <Button variant='dark' className='m-2 text-info'>Rate Product <i className="bi bi-star-fill text-info"></i></Button>
                            <h5>Description : </h5>
                            <ul>
                                <li>Category : {details.category_id.category_name}</li>
                                <li>Color : {details.color_id.color_name}</li>
                            </ul>
                            <p >{details.product_desc}</p>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>}

        </div >
    )
}
