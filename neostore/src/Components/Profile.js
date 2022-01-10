import React, { useState, useEffect } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import { getUser } from '../config/Myservice';
export default function Profile() {
    const [profile, setProfile] = useState(null)
    useEffect(() => {
        let token = sessionStorage.getItem("_token");
        let decode = jwt_decode(token);
        getUser(decode.email).then(res => {
            setProfile(res.data)
        })
    }, [])
    return (<>{profile && <div className='profile'>
        <div>
            <div id="pic">{profile.fname[0]}{profile.lname[0]}</div>
            <h5 style={{ textAlign: 'center' }} className='text-info'>{profile.fname} {profile.lname}</h5>
            <Link to='/orders'><button className="hbutton"><i className="bi bi-list-ol">&nbsp;</i> &nbsp; Orders History</button></Link>
            <Link to='/profile/update'><button className="hbutton"><i className="bi bi-person-circle">&nbsp;</i> &nbsp; Manage Profile</button></Link>
            <Link to='/profile/address'><button className="hbutton"><i className="bi bi-house-door-fill">&nbsp;</i> &nbsp; Manage Address</button></Link>
            <Link to='/profile/changepass'><button className="hbutton"><i className="bi bi-arrow-left-right">&nbsp;</i> &nbsp; Change Password</button></Link>
        </div>
        <Outlet />
    </div>}</>

    )
}
