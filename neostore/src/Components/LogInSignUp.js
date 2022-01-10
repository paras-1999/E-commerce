import React, { useState, useEffect } from 'react'
import { Button, Form, Alert } from 'react-bootstrap'
import { addloger, loguser, socialloger } from '../config/Myservice';
import SocialButton from "./SocialButton";
import { useLocation, useNavigate, Link } from 'react-router-dom';
import MediaLinks from './MediaLinks';
const regForName = RegExp(/^[A-Za-z]{4,29}$/);
const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const regForPass = RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/);
const regForPhone = RegExp(/^[7-9][0-9]{9}$/);
export default function LogInSignUp() {
    const [w, setW] = useState({ l: "93vw", s: "7vw", p: 25, lf: "block", sf: "none" });
    const [err, setErr] = useState({ msg: "", show: false });
    const [lerr, setLerr] = useState({ msg: "", show: false });
    const [user, setUser] = useState({ fname: null, lname: null, email: null, pass: null, rpass: null, phone: null, gender: null });
    const [log, setLog] = useState({ email: null, pass: null })
    const [showpass, setShowpass] = useState({ pass: false, rpass: false });
    const location = useLocation();
    const navigate = useNavigate()
    useEffect(() => {
        if (sessionStorage.getItem('_token') != undefined) {
            sessionStorage.removeItem('_token')
        }
        if (location.search == "?register=true") {
            setW({ l: "7vw", s: "93vw", p: 1297, sf: "block", lf: "none" })
        }
    }, [])
    const adduser = (event) => {
        event.preventDefault();
        setErr({ msg: "", show: false });
        if (!user.fname || !regForName.test(user.fname)) {
            setErr({ msg: "Enter A Valid First Name", show: true });
        }
        else if (!user.lname || !regForName.test(user.lname)) {
            setErr({ msg: "Enter A Valid Second Name", show: true });
        }
        else if (!user.email || !regForEmail.test(user.email)) {
            setErr({ msg: "Enter A Valid Email", show: true });
        }
        else if (!user.pass || !regForPass.test(user.pass)) {
            setErr({ msg: "6-16 Digit Password Atleast One Uppercase Lowercase & Special Character", show: true });
        }
        else if (user.pass != user.rpass) {
            setErr({ msg: "Password Not Match", show: true });
        }
        else if (!user.phone || !regForPhone.test(user.phone)) {
            setErr({ msg: "Enter A Valid Number", show: true });
        }
        else if (!user.gender) {
            setErr({ msg: "Select A Gender", show: true });
        }
        else {
            addloger({ fname: user.fname, lname: user.lname, email: user.email, phone: user.phone, pass: user.pass, gender: user.gender }).then(res => {
                setW({ l: "93vw", s: "7vw", p: 25, lf: "block", sf: "none" });
                alert(res.data)
            })

        }
    }
    const verify = (event) => {
        event.preventDefault();
        setLerr({ msg: "", show: false });
        if (!log.email || !regForEmail.test(log.email)) {
            setLerr({ msg: "Enter A Valid Email", show: true });
        }
        else {
            loguser({ email: log.email, pass: log.pass }).then(res => {
                // console.log(res.data)
                if (!res.data.show) {
                    sessionStorage.setItem("_token", res.data.token);
                    navigate('/');
                    alert(res.data.msg);

                }
                if (res.data.show) {
                    setLerr(res.data);
                }
            })
        }

    }
    const handleSocialLogin = async (user) => {
        setLerr({ msg: "", show: false });
        let email = user._profile.email
        if (user._profile.email == undefined) {
            email = user._profile.id
        }
        socialloger({ email: email, fname: user._profile.firstName, lname: user._profile.lastName }).then(res => {
            // console.log(res.data)
            if (!res.data.show) {
                sessionStorage.setItem("_token", res.data.token);
                navigate('/');
                alert(res.data.msg);
            }
            if (res.data.show) {
                setLerr(res.data);
            }
        })


    };
    const handleSocialLoginFailure = (err) => {
        // console.error(err);
        setLerr({ msg: "Something went Wrong Refresh And Try Again", show: true });
    };
    return (
        <div className='holder'>
            <div className='logsign' style={{ width: w.l, background: "#E84855" }}>
                <button className='lsbtn' onClick={() => setW({ l: "93vw", s: "7vw", p: 25, lf: "block", sf: "none" })}>
                    LogIn&nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>
                </button>
                <div style={{ display: w.lf }}>
                    <h1 className='fheading'>Welcome to<Link to='/'> <span style={{ color: '#00C2D1' }}>Neo</span>Store </Link></h1>
                    <Form className='lsform' onSubmit={verify}>
                        {lerr.show && <Alert variant="warning" onClose={() => setLerr({ msg: "", show: false })} dismissible>
                            <Alert.Heading>{lerr.msg}</Alert.Heading>
                        </Alert>}
                        <input type="email" placeholder="Enter Email ID" onChange={(e) => setLog({ ...log, email: e.target.value })} /><i className="bi bi-envelope-fill"></i>
                        <input type={showpass.pass ? "text" : "password"} placeholder="Password" onChange={(e) => setLog({ ...log, pass: e.target.value })} />{showpass.pass ? <i className="bi bi-eye-slash-fill" onClick={() => setShowpass({ ...setShowpass, pass: false })} ></i> : <i onClick={() => setShowpass({ ...setShowpass, pass: true })} className="bi bi-eye-fill"></i>}
                        <Button variant='light' type='submit' className='sbtn' style={{ width: "97%" }}>Login</Button>
                    </Form>
                    <h6 style={{ textAlign: 'center', color: 'white', textDecoration: 'underline' }}><Link to="/forgetpass">Forget Your Password?</Link></h6>
                    <SocialButton
                        provider="facebook"
                        appId="462099812162182"
                        onLoginSuccess={handleSocialLogin}
                        onLoginFailure={handleSocialLoginFailure}
                        className="btn btn-light sbtn"

                    >
                        Login with facebook <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="#4267B2" className="bi bi-facebook" viewBox="0 0 16 16">
                            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                        </svg>
                    </SocialButton>
                    <SocialButton
                        provider="google"
                        appId="657163002214-oip6lttd43lt7m4kgdr6sr42la96l0sh.apps.googleusercontent.com"
                        onLoginSuccess={handleSocialLogin}
                        onLoginFailure={handleSocialLoginFailure}
                        className="btn btn-light sbtn"
                    >
                        Login with google <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="red" className="bi bi-google" viewBox="0 0 16 16">
                            <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                        </svg>
                    </SocialButton>
                </div>
            </div>
            <div className='logsign' style={{ width: w.s, background: "#00C2D1" }} >
                <button className='lsbtn' onClick={() => setW({ l: "7vw", s: "93vw", p: 1297, sf: "block", lf: "none" })}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
                        <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                    </svg>&nbsp;
                    SignUp</button>
                <div style={{ display: w.sf }}>
                    <h1 className='fheading'>Register For <span style={{ color: '#E84855' }}>Neo</span>Store</h1>
                    <Form className='lsform' onSubmit={adduser}>
                        {err.show && <Alert variant="danger" onClose={() => setErr({ msg: "", show: false })} dismissible>
                            <Alert.Heading>{err.msg}</Alert.Heading>
                        </Alert>}
                        <input type="text" placeholder="First Name" onChange={(e) => setUser({ ...user, fname: e.target.value })} /><i className="bi bi-person-fill"></i>
                        <input type="text" placeholder="Last Name" onChange={(e) => setUser({ ...user, lname: e.target.value })} /><i className="bi bi-person-fill"></i>
                        <input type="email" placeholder="Email ID" onChange={(e) => setUser({ ...user, email: e.target.value })} /><i className="bi bi-envelope-fill"></i>
                        <input type={showpass.pass ? "text" : "password"} placeholder="Password" onChange={(e) => setUser({ ...user, pass: e.target.value })} />{showpass.pass ? <i className="bi bi-eye-slash-fill" onClick={() => setShowpass({ ...setShowpass, pass: false })} ></i> : <i onClick={() => setShowpass({ ...setShowpass, pass: true })} className="bi bi-eye-fill"></i>}
                        <input type={showpass.rpass ? "text" : "password"} placeholder="R-Password" onChange={(e) => setUser({ ...user, rpass: e.target.value })} />{showpass.rpass ? <i className="bi bi-eye-slash-fill" onClick={() => setShowpass({ ...setShowpass, rpass: false })} ></i> : <i onClick={() => setShowpass({ ...setShowpass, rpass: true })} className="bi bi-eye-fill"></i>}
                        <input type="phone" placeholder="Phone" onChange={(e) => setUser({ ...user, phone: e.target.value })} /><i className="bi bi-telephone-fill"></i><br />
                        <input type="radio" name="gender" onChange={(e) => setUser({ ...user, gender: e.target.value })} style={{ width: "10%", display: "inline" }} value="male" /><span className="fheading">M a l e</span>
                        <input type="radio" name="gender" onChange={(e) => setUser({ ...user, gender: e.target.value })} style={{ width: "10%", display: "inline" }} value="female" /><span className="fheading">F e m a l e</span><br />
                        <Button variant='light' type='submit' className='sbtn' style={{ width: "97%", marginBottom: 0 }}>Submit</Button>
                    </Form>
                </div>
            </div>
            <MediaLinks p={w.p} />
        </div>
    )
}
