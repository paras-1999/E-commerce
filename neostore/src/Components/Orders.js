import React, { useEffect, useState, useRef } from 'react'
import { Button, Col, Row, Modal, Table } from 'react-bootstrap';
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { getOrder } from '../config/Myservice';
import ReactToPdf from 'react-to-pdf'
const options = {
    orientation: 'portrait',
    unit: 'in',
    format: 'A4'
};
export default function Orders() {
    const [order, setOrder] = useState([]);
    const [show, setShow] = useState(false);
    const [bill, setBill] = useState(null);
    const pdfRef = useRef(null);
    const navigate = useNavigate();
    //fetch order for the user
    useEffect(() => {
        if (sessionStorage.getItem('_token') != undefined) {
            let token = sessionStorage.getItem("_token");
            let decode = jwt_decode(token);
            getOrder(decode.email).then(res => {
                setOrder(res.data)
            })
        }
        else {
            alert('Login To See Order History')
            navigate('/')
        }
    }, [])
    if (order.length) {
        return (
            <>{order.map((val, i) =>
                <div className='olist' key={i}>
                    <h5>Order ID : {val._id}</h5>
                    <p>Total Amount : &#8377;{Math.floor(val.total + (val.total * .18))}</p>
                    <hr />
                    {val.orderlist.map((img, i) =>
                        <img key={i} src={`./images/${img.pimg}`} height={100} width={100} style={{ margin: 10, borderRadius: 8 }} />
                    )}
                    <Button variant='danger' onClick={() => { setShow(true); setBill(val) }}>View Invoice Details</Button>
                </div>
            )}
                {bill && <Modal show={show} fullscreen onHide={() => setShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Order ID : {bill._id}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='mx-auto my-2 invoice' ref={pdfRef}>
                            <h3>Invoice</h3>
                            <hr />
                            <h2 className="text-info">Neo<span className="text-danger">Store</span> </h2>
                            <p>NeoStore@gmail.com</p>
                            <p>4th Floor, The Ruby, 29, Senapati Bapat Marg, Dadar West, Mumbai, Maharashtra 400028</p>
                            <div id='contact' ><span>&nbsp;&nbsp;&nbsp;&nbsp;Phone : +91 9876543210</span><span>Order ID : {bill._id}&nbsp;&nbsp;&nbsp;&nbsp;</span></div>
                            <hr />
                            <div className='mx-auto' style={{ width: '90%' }}>

                                <h3 className='text-start'>Bill To :</h3>
                                <div id='contact' ><span style={{ display: 'inline-block', width: "30%", textAlign: "left" }}>({bill.email}){bill.address}</span><h1 className=' text-info'>PAID</h1></div>
                                <p className='text-end'>Date : {bill.created_at.substring(0, 10)}</p>

                                <hr style={{ width: '100%' }} />
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>S.No.</th>
                                            <th>Product Name</th>
                                            <th>Qunatity</th>
                                            <th>Price(&#8377;)</th>
                                            <th>Total(&#8377;)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bill.orderlist.map((val, i) =>
                                            <tr key={i}>
                                                <td>{i}</td>
                                                <td>{val.pname}</td>
                                                <td>{val.quantity}</td>
                                                <td>{val.price}</td>
                                                <td>{val.quantity * val.price}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                                <h3 className='text-end text-danger'>GRAND TOTAL : &#8377;{bill.total}</h3>
                                <p className='text-end'>Include GST(18%)</p>
                                <p>Copyright © 2022 NeoSoft Technologies All Right Reserved | Design By Paras Saxena</p>
                            </div>
                        </div>
                    </Modal.Body>
                    <ReactToPdf targetRef={pdfRef} filename={`${bill._id}_invoice.pdf`} options={options} x={0} y={0} scale={.75}>
                        {({ toPdf }) => (

                            <Button variant='danger' onClick={() => toPdf()} className="w-50 mx-auto">DOWNLOAD PDF <i className="bi bi-file-earmark-pdf-fill"></i></Button>
                        )}
                    </ReactToPdf>
                </Modal>}
            </>
        )
    }
    else {
        return (
            <div ><img src='./images/cart.gif' height={'200px'} className='d-block mx-auto' /><h1 id='notfound'>No Order History</h1></div>
        )
    }
}
