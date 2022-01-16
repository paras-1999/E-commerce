import React, { useState, useEffect } from 'react'
import jwt_decode from 'jwt-decode'
import { getUser, updateProfile } from '../config/Myservice';
import { Form, FloatingLabel, Button, Alert } from 'react-bootstrap';
const regForName = RegExp(/^[A-Za-z]{4,29}$/);
const regForPhone = RegExp(/^[7-9][0-9]{9}$/);
export default function UpdateProfile() {
    const [profile, setProfile] = useState(null);
    const [err, setErr] = useState({ msg: "", show: false });
    useEffect(() => {
        let token = sessionStorage.getItem("_token");
        let decode = jwt_decode(token);
        getUser(decode.email).then(res => {
            setProfile(res.data)
        })
    }, [])
    const updateprofile = (e) => {
        e.preventDefault();
        setErr({ msg: "", show: false });
        if (!profile.fname || !regForName.test(profile.fname)) {
            setErr({ msg: "Enter A Valid First Name", show: true });
        }
        else if (!profile.lname || !regForName.test(profile.lname)) {
            setErr({ msg: "Enter A Valid Second Name", show: true });
        }
        else if (!profile.phone || !regForPhone.test(profile.phone)) {
            setErr({ msg: "Enter A Valid Number", show: true });
        }
        else {
            updateProfile(profile).then(res => {
                setErr(res.data)
                window.location.reload(false)
            })
        }
    }
    return (<>{profile && <Form className='forgetform h-75 my-5'>
        {err.show && <Alert variant="info" className='ms-2 w-100' onClose={() => setErr({ msg: "", show: false })} dismissible>
            <Alert.Heading>{err.msg}</Alert.Heading>
        </Alert>}
        <FloatingLabel
            label="First Name"
            className="mb-3"
        >
            <Form.Control type="text" placeholder="Paras" value={profile.fname} onChange={(e) => setProfile({ ...profile, fname: e.target.value })} />
        </FloatingLabel>
        <FloatingLabel
            controlId="floatingInput"
            label="Last Name"
            className="mb-3"
        >
            <Form.Control type="text" placeholder="Saxena" value={profile.lname} onChange={(e) => setProfile({ ...profile, lname: e.target.value })} />
        </FloatingLabel>
        <FloatingLabel
            controlId="floatingInput"
            label="Email"
            className="mb-3"
        >
            <Form.Control type="email" placeholder="name@example.com" value={profile.email} disabled />
        </FloatingLabel>
        <FloatingLabel
            controlId="floatingInput"
            label="Phone No."
            className="mb-3"
        >
            <Form.Control type="tel" placeholder="9999999999" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
        </FloatingLabel>
        <Button variant='dark' type='submit' className='sbtn w-100' style={{ margin: '8px' }} onClick={updateprofile} >Update Profile</Button>
    </Form>}</>

    )
}
