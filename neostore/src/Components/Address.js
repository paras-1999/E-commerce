import React, { useState, useEffect } from 'react'
import jwt_decode from 'jwt-decode'
import axios from 'axios';
import { Modal, Row, Col, Form, FloatingLabel, DropdownButton, Dropdown, Card, Button, Alert } from 'react-bootstrap'
import { addAddress, getAddress, removeAdd } from '../config/Myservice';
export default function Address() {
    const [show, setShow] = useState(false);
    const [address, seTaddress] = useState({ address: null, pin: null, state: "State", city: "city", country: "India" });
    const [err, setErr] = useState({ msg: "", show: false });
    const [states, setStates] = useState([]);
    const [city, setCity] = useState([]);
    const [addlist, setAddlist] = useState([]);
    const [email, setEmail] = useState(null)
    useEffect(() => {
        let token = sessionStorage.getItem("_token");
        let decode = jwt_decode(token);
        setEmail(decode.email)
        getAddress(decode.email).then(res => {
            setAddlist(res.data)
        })

    }, [])
    const getstates = () => {
        axios.get("https://www.universal-tutorial.com/api/states/India", {
            headers: { "authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJuc3Rjb2RlcnMxMjNAZ21haWwuY29tIiwiYXBpX3Rva2VuIjoiTFJWbnF5aHhIUU5nWWdnRExEWGJ6NGoxNVVQSFhaaUFaLWlfb3o1amF1M0ZrQk5EelVFTlRXWXdha2ZRdUFCU3hBYyJ9LCJleHAiOjE2NDE1NTA0NjF9.cuHoxme3xNIFHfsb7UqJy8amNLnCsW5Hip_nWf1Kv0M` }
        }).then(res => {
            setStates(res.data);
        })
    }
    const getcitys = (s) => {
        axios.get(`https://www.universal-tutorial.com/api/cities/${s}`, {
            headers: { "authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJuc3Rjb2RlcnMxMjNAZ21haWwuY29tIiwiYXBpX3Rva2VuIjoiTFJWbnF5aHhIUU5nWWdnRExEWGJ6NGoxNVVQSFhaaUFaLWlfb3o1amF1M0ZrQk5EelVFTlRXWXdha2ZRdUFCU3hBYyJ9LCJleHAiOjE2NDE1NTA0NjF9.cuHoxme3xNIFHfsb7UqJy8amNLnCsW5Hip_nWf1Kv0M` }
        }).then(res => {
            setCity(res.data);
        })
    }
    const addaddress = () => {
        console.log(address)
        if (!address.address || address.address.length < 10) {
            setErr({ msg: "Enter A Valid Address with block ,Street No. & district", show: true });
        }
        else if (!address.pin || address.pin < 100000 || address.pin > 999999) {
            setErr({ msg: "Enter A 6 digit pin", show: true });
        }
        else if (address.state == "State") {
            setErr({ msg: "Select a State", show: true });
        }
        else if (address.city == "city") {
            setErr({ msg: "Select a city", show: true });
        }
        else {
            let temp = [...addlist]
            temp.push(address)
            setAddlist(temp)
            // let token = sessionStorage.getItem("_token");
            // let decode = jwt_decode(token);
            addAddress(address, email).then(res => {
                if (res.data.show) {
                    setErr(res.data);
                    seTaddress({ address: null, pin: null, state: "State", city: "city", country: "India" });
                    setTimeout(() => {
                        setErr({ msg: "", show: false });
                        setShow(false)
                    }, 1000);
                }
                else {
                    setErr({ msg: "Something Went Wrong", show: true });
                }
            })

        }
    }
    const removeadd = (i) => {
        let temp = [...addlist];
        temp.splice(i, 1);
        setAddlist(temp)
        removeAdd(temp, email).then(res => {
            console.log(res.data)
        })
    }
    return (
        <div >
            <Modal show={show} size="lg" onHide={() => { setShow(false); setErr({ msg: "", show: false }); seTaddress({ address: null, pin: null, state: "State", city: "city", country: "India" }); }}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {err.show && <Alert variant="success" className='my-2 w-100' onClose={() => setErr({ msg: "", show: false })} dismissible>
                        <Alert.Heading>{err.msg}</Alert.Heading>
                    </Alert>}
                    <Row className="mb-3">
                        <Col>
                            <FloatingLabel controlId="floatingTextarea2" label="Address">
                                <Form.Control
                                    as="textarea"
                                    placeholder="Address"
                                    style={{ height: '100px' }}
                                    onChange={(e) => seTaddress({ ...address, address: e.target.value })}
                                />
                            </FloatingLabel>
                        </Col>

                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <Form.Floating  >
                                <Form.Control
                                    type="number"
                                    placeholder="110053"
                                    style={{ margin: "0 !important", width: "50%" }}
                                    onChange={(e) => seTaddress({ ...address, pin: e.target.value })}
                                />
                                <label >Pin Code</label>
                            </Form.Floating>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <DropdownButton
                                variant="outline-secondary"
                                title={address.state}
                            >
                                {states.map((val) =>
                                    <Dropdown.Item key={val.state_name} onClick={() => { seTaddress({ ...address, state: val.state_name, city: "city" }); getcitys(val.state_name) }} >{val.state_name}</Dropdown.Item>
                                )}

                            </DropdownButton>
                        </Col>
                        <Col >
                            <DropdownButton
                                variant="outline-secondary"
                                title={address.city}
                            >
                                {city.map((val) =>
                                    <Dropdown.Item key={val.city_name} onClick={() => seTaddress({ ...address, city: val.city_name })} >{val.city_name}</Dropdown.Item>
                                )}

                            </DropdownButton>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Country"
                                className="my-3 w-50"
                            >
                                <Form.Control type="text" placeholder="India" value="India" disabled />
                            </FloatingLabel>
                        </Col>
                    </Row>
                    <Button className='w-100' variant='dark' size='lg' onClick={addaddress}>Add Address</Button>
                </Modal.Body>
            </Modal>
            {addlist.map((val, i) =>
                <Card
                    bg='dark'
                    key={i}
                    text='light'
                    className="mb-2 w-100"
                >
                    <Card.Header>Address ({i + 1})</Card.Header>
                    <Card.Body>
                        <Card.Title> {val.address},{val.pin} </Card.Title>
                        <Card.Text>
                            {val.city},{val.state},{val.country}
                        </Card.Text>
                        <Button variant="danger" onClick={() => removeadd(i)}>Remove</Button>
                    </Card.Body>
                </Card>
            )}
            <button id='addadd' onClick={() => { setShow(true); getstates() }}>+</button>
        </div >
    )
}
