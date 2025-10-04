import React from 'react'
import Logo from "../../img/logo.png"
import { Link } from "react-router-dom"
import "../navUser/nav.css"
import { useNavigate } from 'react-router-dom'

const NavAdmin = () => {
    const navigate = useNavigate()

    return (
        <nav>
            <img className='logo' src={Logo} alt="" />

            <div className="right">
                <button onClick={() => navigate("/")}>
                    <img src="https://img.icons8.com/ios-filled/50/FFFFFF/login-rounded-right.png" alt="login-rounded-right" />
                    Cerrar Sesion
                </button>
            </div>
        </nav>
    )
}

export default NavAdmin
