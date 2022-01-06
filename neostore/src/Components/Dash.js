import React from 'react'
import NavigationBar from './NavigationBar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
export default function Dash() {
    return (
        <>
            <NavigationBar />
            <div style={{ minHeight: `calc(100vh - 236px)`, padding: 0, margin: 0 }} >
                <Outlet />
            </div>
            <Footer />
        </>
    )
}
