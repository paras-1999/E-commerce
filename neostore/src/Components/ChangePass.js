import React, { useState, useEffect } from 'react'
import jwt_decode from 'jwt-decode'
import { getUser, resetPASS, updateProfile } from '../config/Myservice';
import { Form, FloatingLabel, Button, Alert } from 'react-bootstrap';
const regForPass = RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/);
export default function ChangePass() {
    const [user, setUser] = useState({ email: null, oldpass: null, newpass: null, rnewpass: null });
    const [err, setErr] = useState({ msg: "", show: false });
    const [showpass, setShowpass] = useState({ oldpass: false, newpass: false, rnewpass: false });
    useEffect(() => {
        let token = sessionStorage.getItem("_token");
        let decode = jwt_decode(token);
        setUser({ ...user, email: decode.email });
    }, [])
    //function to reset password
    const resetpass = (e) => {
        e.preventDefault();
        setErr({ msg: "", show: false });
        if (!user.oldpass) {
            setErr({ msg: "Enter Old Password", show: true });
        }
        else if (user.oldpass == user.newpass) {
            setErr({ msg: "old password and new password can't be same!!", show: true });
        }
        else if (!user.newpass || !regForPass.test(user.newpass)) {
            setErr({ msg: "6-16 Digit Password Atleast One Uppercase Lowercase & Special Character", show: true });
        }
        else if (user.rnewpass != user.newpass) {
            setErr({ msg: "Enter Same Password", show: true });
        }
        else {
            resetPASS(user).then(res => {
                if (res.data.show) {
                    setErr(res.data);
                    window.location.reload(false)
                }
            })
        }
    }
    return (<>{user.email && <Form className='forgetform h-100 my-5'>
        {err.show && <Alert variant="info" className='ms-2 w-100' onClose={() => setErr({ msg: "", show: false })} dismissible>
            <Alert.Heading>{err.msg}</Alert.Heading>
        </Alert>}
        <div style={{ position: "relative " }}>
            <FloatingLabel
                label="Old-Password"
                className="mb-4"
            >
                <Form.Control type={showpass.oldpass ? "text" : "password"} placeholder="paras@123" onChange={(e) => setUser({ ...user, oldpass: e.target.value })} />
            </FloatingLabel>
            <button type="button" className='fpass'>{showpass.oldpass ? <i className="bi bi-eye-slash-fill text-dark" onClick={() => setShowpass({ ...setShowpass, oldpass: false })} ></i> : <i onClick={() => setShowpass({ ...setShowpass, oldpass: true })} className="bi bi-eye-fill text-dark"></i>}</button>
        </div>

        <div style={{ position: "relative " }}>
            <FloatingLabel
                label="Create-New-Password"
                className="mb-4"
            >
                <Form.Control type={showpass.newpass ? "text" : "password"} placeholder="paras@123" onChange={(e) => setUser({ ...user, newpass: e.target.value })} />
            </FloatingLabel>
            <button type="button" className='fpass'>{showpass.newpass ? <i className="bi bi-eye-slash-fill text-dark" onClick={() => setShowpass({ ...setShowpass, newpass: false })} ></i> : <i onClick={() => setShowpass({ ...setShowpass, newpass: true })} className="bi bi-eye-fill text-dark"></i>}</button>
        </div>
        <div style={{ position: "relative " }}>
            <FloatingLabel
                label="R-Create-New-Password"
                className="mb-4"
            >
                <Form.Control type={showpass.rnewpass ? "text" : "password"} placeholder="paras@123" onChange={(e) => setUser({ ...user, rnewpass: e.target.value })} />
            </FloatingLabel>
            <button type="button" className='fpass'>{showpass.rnewpass ? <i className="bi bi-eye-slash-fill text-dark" onClick={() => setShowpass({ ...setShowpass, rnewpass: false })} ></i> : <i onClick={() => setShowpass({ ...setShowpass, rnewpass: true })} className="bi bi-eye-fill text-dark"></i>}</button>
        </div>
        <Button variant='dark' type='submit' className='sbtn w-100' style={{ margin: '8px' }} onClick={resetpass} >Change Password</Button>
    </Form>}</>

    )
}
