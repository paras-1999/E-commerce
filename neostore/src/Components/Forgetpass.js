import React, { useState } from 'react'
import { Form, FloatingLabel, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { sendOTP, checkOTP, changePASS } from '../config/Myservice';
const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const regForPass = RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/);
export default function Forgetpass() {
    const [view, setView] = useState({ email: true, otp: false, change: false });
    const [user, setUser] = useState({ email: null, otp: null, pass: null, cpass: null });
    const [err, setErr] = useState({ msg: "", show: false });
    const [showpass, setShowpass] = useState({ pass: false, rpass: false });
    const navigate = useNavigate()
    //function to send otp to mail
    const sendotp = () => {
        if (!user.email || !regForEmail.test(user.email)) {
            setErr({ msg: "Enter A Valid Email", show: true });
        }
        else {
            sendOTP(user.email).then(res => {
                if (!res.data.show) {
                    setView({ ...view, otp: true, email: false })
                    setErr({ msg: res.data.msg, show: true })
                }
                if (res.data.show) {
                    setErr(res.data);
                }
            })
        }
    }
    //function to verfy the otp n backend
    const verifyotp = () => {
        if (!user.otp || (parseInt(user.otp) < 1000 || parseInt(user.otp) > 9999)) {
            setErr({ msg: "Enter A Valid OTP", show: true });
        }
        else {
            checkOTP(user.email, user.otp).then((res) => {
                if (!res.data.show) {
                    setView({ ...view, change: true, otp: false })
                    setErr({ msg: res.data.msg, show: true })
                }
                if (res.data.show) {
                    setErr(res.data);
                }
            })
        }
    }
    // function to reset the password
    const changepass = () => {
        if (!user.pass || !regForPass.test(user.pass)) {
            setErr({ msg: "6-16 Digit Password Atleast One Uppercase Lowercase & Special Character", show: true });
        }
        else if (user.pass != user.cpass) {
            setErr({ msg: "Password Not Match", show: true });
        }
        else {
            let up = { email: user.email, pass: user.pass };
            changePASS(up).then((res) => {
                if (res.data.show) {
                    navigate('/LoginSignup');
                    alert(res.data.msg)
                }
            })
        }
    }
    return (
        <div>
            <Link to='/LoginSignup'><button className='buttton'><i className="bi bi-caret-left-fill text-danger"></i>&nbsp;Go Back</button>
            </Link>
            <h1 className='fheading text-info w-100' style={{ position: 'fixed', top: 20 }}><spam style={{ color: '#E84855' }}>Neo</spam>Store Password Recoverey</h1>
            <div style={{ display: 'flex', justifyContent: "center", alignItems: "center", height: '70vh' }}>
                <div className='forgetform'>
                    {err.show && <Alert variant="danger" className='ms-2 w-100' onClose={() => setErr({ msg: "", show: false })} dismissible>
                        <Alert.Heading>{err.msg}</Alert.Heading>
                    </Alert>}
                    {view.email && <> <FloatingLabel
                        label="Enter Email Address"
                        className="mb-2"
                    >
                        <Form.Control type="email" placeholder="name@example.com" onChange={(e) => setUser({ ...user, email: e.target.value })} />
                    </FloatingLabel>
                        <Button variant='dark' size='lg' onClick={() => sendotp()} >Send OTP</Button></>}
                    {view.otp && <><FloatingLabel
                        label="OTP"
                        className="mb-2"
                    >
                        <Form.Control type="number" placeholder="1234" onChange={(e) => setUser({ ...user, otp: e.target.value })} />
                    </FloatingLabel>
                        <Button variant='dark' size='lg' onClick={() => verifyotp()}>Verfiy OTP</Button></>}
                    {view.change && <><div style={{ position: "relative " }}>
                        <FloatingLabel
                            label="Create-New-Password"
                            className="mb-2"
                        >
                            <Form.Control type={showpass.rpass ? "text" : "password"} placeholder="paras@123" onChange={(e) => setUser({ ...user, pass: e.target.value })} />
                        </FloatingLabel>
                        <button className='fpass'>{showpass.rpass ? <i className="bi bi-eye-slash-fill text-dark" onClick={() => setShowpass({ ...setShowpass, rpass: false })} ></i> : <i onClick={() => setShowpass({ ...setShowpass, rpass: true })} className="bi bi-eye-fill text-dark"></i>}</button>
                    </div>
                        <div style={{ position: "relative " }}>
                            <FloatingLabel
                                label="R-Create-New-Password"
                                className="mb-2"
                            >
                                <Form.Control type={showpass.pass ? "text" : "password"} placeholder="paras@123" onChange={(e) => setUser({ ...user, cpass: e.target.value })} />
                            </FloatingLabel>
                            <button className='fpass'>{showpass.pass ? <i className="bi bi-eye-slash-fill text-dark" onClick={() => setShowpass({ ...setShowpass, pass: false })} ></i> : <i onClick={() => setShowpass({ ...setShowpass, pass: true })} className="bi bi-eye-fill text-dark"></i>}</button>
                        </div>
                        <Button variant='dark' size='lg' onClick={() => changepass()}>Change Password</Button></>}
                </div>
            </div>
        </div>
    )
}
