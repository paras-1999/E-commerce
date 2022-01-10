import React, { useEffect, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart } from '../redux/action';
import { useNavigate } from 'react-router-dom';
export default function Cart() {
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(null);
    const navigate = useNavigate();
    const count = useSelector((state) => state.cartReducer);
    const dispatch = useDispatch();
    useEffect(() => {
        if (localStorage.getItem('cart') != undefined) {
            let list = JSON.parse(localStorage.getItem('cart'));
            setItems(list);
            countTotal(list);
        }
    }, [])
    const countTotal = (items) => {
        let total = 0;
        items.map((val) => {
            total += val.price * val.quantity;
        })
        setTotal(total);
    }
    const removeitem = (i) => {
        let temp = [...items];
        temp.splice(i, 1);
        setItems(temp);
        countTotal(temp);
        localStorage.setItem('cart', JSON.stringify(temp))
        dispatch(removeFromCart());
    }
    const incq = (i) => {
        let temp = [...items];
        temp[i].quantity++;
        setItems(temp)
        countTotal(temp);
        localStorage.setItem('cart', JSON.stringify(temp))
    }
    const decq = (i) => {
        let temp = [...items];
        temp[i].quantity--;
        setItems(temp)
        countTotal(temp);
        localStorage.setItem('cart', JSON.stringify(temp))
    }
    return (
        <>{count ? <Row className='container-fluid'>
            <Col sx={12} md={9} lg={9}>
                {items.map((val, i) =>
                    <div className='cartitem ' key={i}>
                        <img src={`./images/${val.pimg}`} />
                        <h5>{val.pname}</h5>
                        <h6 className='text-danger'>&#8377; {val.price}</h6>
                        <div >
                            <Button variant='danger' disabled={val.quantity <= 1 ? true : false} className='rounded-circle text-white' onClick={() => decq(i)}>-</Button>
                            <span>{val.quantity}</span>
                            <Button variant='info' className='rounded-circle text-white' onClick={() => incq(i)}>+</Button>
                        </div>
                        <h4>&#8377; {+val.price * parseInt(val.quantity)}</h4>
                        <i className="bi bi-x-circle text-danger me-2 " onClick={() => { removeitem(i) }} style={{ cursor: 'pointer', fontSize: '22px' }}></i>
                    </div>
                )}
            </Col>
            <Col sx={12} md={3} lg={3}>
                <div className='cal ' style={{ position: 'sticky', top: 10 }}>
                    <h1>Bill :</h1>
                    <h5>Total : &#8377;{total}</h5>
                    <h5>GST (18%) : &#8377;{Math.floor(total * .18)}</h5>
                    <h5>Delivery : &#8377;0</h5>
                    <h4 className='text-info'>Grand Total : <span className='text-danger'>&#8377;{Math.floor(total + (.18 * total))}</span></h4>
                    <Button variant='danger' className='mt-3 w-100' onClick={() => navigate('/checkout', { state: total })}>CHECKOUT </Button>
                </div>
            </Col>
        </Row>
            :
            <div ><img src='./images/cart.gif' height={'200px'} className='d-block mx-auto' /><h1 id='notfound'>Cart is Empty</h1></div>}

        </>
    )
}
