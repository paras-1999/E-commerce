import React, { useEffect, useState } from 'react'
import { getCategories, getColors, getproducts } from '../config/Myservice';
import ReactPaginate from 'react-paginate';
import { Card, Button, Col, Row, Form, NavDropdown, Alert } from 'react-bootstrap';
import Rating from './Rating';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { addToCart } from '../redux/action'
export default function Products() {
    const [products, setProducts] = useState([]);
    const [colors, setColors] = useState([]);
    const [category, setCategory] = useState([]);
    const [err, setErr] = useState({ msg: "", show: false });
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    //fetch products categories and colors
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
    const sortByRating = () => {
        let temp = [...products];
        let sortData = temp.sort((a, b) => {
            return b.product_rating - a.product_rating;
        })
        setProducts(sortData)
    }
    const sortByPriceUP = () => {
        let temp = [...products];
        let sortData = temp.sort((a, b) => {
            return b.product_cost - a.product_cost;
        })
        setProducts(sortData)
    }
    const sortByPriceDown = () => {
        let temp = [...products];
        let sortData = temp.sort((a, b) => {
            return a.product_cost - b.product_cost;
        })
        setProducts(sortData)
    }
    //add items in cart
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
    //display product with pagination
    function Items({ currentItems }) {
        return (
            <Row className='g-4 container-fluid my-1 pagi'>
                {currentItems &&
                    currentItems.map((item, i) => (
                        <Col sm={12} md={4} key={i}>
                            <Card style={{ width: '100%' }} className='shadow'>
                                <Card.Img variant="top" src={`./images/${item.product_image}`} height={350} style={{ cursor: "pointer" }} onClick={() => navigate(`/viewdetails?_id=${item._id}`)} />
                                <Card.Body>
                                    <Card.Title style={{ cursor: "pointer" }} onClick={() => navigate(`/viewdetails?_id=${item._id}`)}>{item.product_name}</Card.Title>
                                    <Rating count={item.product_rating} />
                                    <Button variant="danger" onClick={() => cartCheck(item)}>Add To Cart</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
            </Row>
        );
    }
    //function to calculate the range for pagination 
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
                <Items currentItems={currentItems} /> {/*product display */}
                <ReactPaginate
                    breakLabel="..."
                    nextLabel={`Next`}
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    pageCount={pageCount}
                    previousLabel="Previous"
                    renderOnZeroPageCount={null}
                />
            </>
        );
    }
    return (
        <div className='ppage'>
            <div>
                <Form className='text-center'>
                    <Button type='reset' variant='danger my-3' onClick={() => { navigate('/products'); window.location.reload(false); }} >All Products</Button>
                    <NavDropdown.Divider className='mx-auto' style={{ width: '80%' }} />
                    {colors.map((val, i) => {
                        return (<Form.Check
                            key={i}
                            inline
                            className='w-100'
                            label={val.color_name}
                            name="color_id"
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
                            name="category_id"
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
                {err.show && <Alert variant="danger" className='mx-auto w-75 my-3' onClose={() => setErr({ msg: "", show: false })} dismissible>
                    <Alert.Heading>{err.msg}</Alert.Heading>
                </Alert>}
                <p className='text-end pe-5' style={{ fontSize: "25px" }}>Sort : <i className="bi bi-star-fill text-dark" style={{ cursor: 'pointer' }} onClick={sortByRating}></i>&nbsp; &#8377;<i className="bi bi-arrow-down text-dark" style={{ cursor: 'pointer' }} onClick={sortByPriceDown}></i>&nbsp; &#8377;<i className="bi bi-arrow-up text-dark" style={{ cursor: 'pointer' }} onClick={sortByPriceUP}></i></p>
                <PaginatedItems itemsPerPage={9} />
            </div>
        </div >
    )
}
