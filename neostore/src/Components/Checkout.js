import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { authenticationCall, placeOrder, getAddress } from '../config/Myservice';
import { useDispatch } from 'react-redux'
import jwt_decode from 'jwt-decode'
import { setCart } from '../redux/action';
import { Alert, Button, Form } from 'react-bootstrap';
const regForName = RegExp(/^[A-Z a-z]{4,29}$/);
export default function Checkout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [addlist, setAddlist] = useState([]);
    const location = useLocation();
    const [total, setTotal] = useState(0);
    const [add, setAdd] = useState(null);
    const [err, setErr] = useState({ msg: "", show: false });
    useEffect(() => {
        if (sessionStorage.getItem('_token') != undefined) {
            authenticationCall(sessionStorage.getItem("_token")).then(res => {
                if (res.data.err) {
                    alert(res.data.msg);
                    navigate('/LogInSignUp');
                }
            })
        }
        else {
            if (window.confirm('Login to Checkout')) {
                navigate('/LoginSignup')
            }
            else {
                navigate('/')
            }
            window.location.reload(false);
        }
        setTotal(location.state)
        let token = sessionStorage.getItem("_token");
        let decode = jwt_decode(token);
        getAddress(decode.email).then(res => {
            if (res.data != null) {
                setAddlist(res.data)
            }
            else {
                alert('add an address first')
                navigate('/profile/address')
            }
        })

    }, [])
    const checkout = () => {
        setErr({ msg: "", show: false });
        let cardno = document.getElementById('set1').value + document.getElementById('set2').value + document.getElementById('set3').value + document.getElementById('set4').value;
        let cvv = document.getElementById('cvv').value;
        let name = document.getElementById('holder').value;
        if (cardno.length != 16) {
            setErr({ msg: "Enter Vaild No.", show: true });
        }
        else if (!name || !regForName.test(name)) {
            setErr({ msg: "Enter A Valid Name", show: true });
        }
        else if (cvv.length != 3) {
            setErr({ msg: "Enter Vaild cvv", show: true });
        }
        else if (!add) {
            setErr({ msg: "Select an address", show: true });
        }
        else {
            let token = sessionStorage.getItem("_token");
            let decode = jwt_decode(token);
            let list = JSON.parse(localStorage.getItem('cart'));
            let order = { email: decode.email, orderlist: list, total: total, address: add };
            placeOrder(order).then(res => {
                alert(res.data)
                localStorage.removeItem('cart');
                dispatch(setCart(0));
                navigate('/');
            })
        }
    }
    return (<>{err.show && <Alert variant="success" className='my-2 w-100' onClose={() => setErr({ msg: "", show: false })} dismissible>
        <Alert.Heading>{err.msg}</Alert.Heading>
    </Alert>}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: "space-around", marginTop: "7%" }}>
            <div className=' debitcard'>
                <div className='worldmap'></div>
                <div className='visa'></div>
                <div className='cardno'>
                    <input type='number' id='set1' onChange={(e) => { e.target.value.length == 4 && document.getElementById('set2').focus() }}></input>
                    <input type='number' id='set2' onChange={(e) => { e.target.value.length == 4 && document.getElementById('set3').focus() }}></input>
                    <input type='number' id='set3' onChange={(e) => { e.target.value.length == 4 && document.getElementById('set4').focus() }}></input>
                    <input type='number' id='set4' onChange={(e) => { e.target.value.length == 4 && document.getElementById('holder').focus() }}></input>
                    <img src="./images/Mastercard-logo.png" height="60px" />
                </div>
                <div className='cardholder'>
                    <p>CARD HOLDER</p>
                    <input type='text' id='holder' />
                </div>
                <div className='cvv'>
                    <p>CVV</p>
                    <input type='number' id='cvv' onChange={(e) => { e.target.value.length == 3 && document.getElementById('cvv').blur() }} />
                </div>
            </div>
            <div className='bill '>
                <Form.Select size="lg" onChange={(e) => { setAdd(e.target.value) }} >
                    <option>Select an Address</option>
                    {addlist.map((val, i) =>
                        <option key={i} >{val.address},{val.pin},{val.city},{val.state},{val.country}</option>
                    )}
                </Form.Select>
                <h1>Bill :</h1>
                <h5>Total : &#8377;{total}</h5>
                <h5>GST (18%) : &#8377;{Math.floor(total * .18)}</h5>
                <h5>Delivery : &#8377;0</h5>
                <h4 className='text-info'>Grand Total : <span className='text-danger'>&#8377;{Math.floor(total + (.18 * total))}</span></h4>
                <Button variant='danger' className='mt-1 w-100 ' onClick={checkout}>Pay </Button>

            </div>
        </div>
    </>
    )
}
