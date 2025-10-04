import React, { useEffect, useState } from 'react'
import Logo from "../../img/logo.png"
import { Link, useNavigate } from "react-router-dom"
import "./nav.css"
import { useUser } from '../../UserContext'

const Nav = () => {
    const { user, setUser } = useUser()
    const navigate = useNavigate()

    const handleLogout = async () => {
        if (!user.token) {
            setUser(null);
            localStorage.removeItem('token');
            navigate("/");
            return;
        }

        try {
            await fetch('https://backend-24na.onrender.com/api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }

        setUser(null);
        localStorage.removeItem('token');
        navigate("/");
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate("/");
        }
    }, []);

    return (
        <nav>
            <img className='logo' src={Logo} alt="" />
            <ul>
                <li>
                    <Link to={"/home"}>
                        <img src="https://img.icons8.com/ios-glyphs/30/FFFFFF/home.png" alt="home" />
                        Inicio
                    </Link>
                </li>
                <li>
                    <Link to={"/buy"}>
                        <img src="https://img.icons8.com/material-rounded/48/FFFFFF/shopping-cart.png" alt="shopping-cart" />
                        Comprar
                    </Link>
                </li>
                <li>
                    <Link to={"/sell"}>
                        <img width="48" height="48" src="https://img.icons8.com/material-rounded/FFFFFF/48/sell.png" alt="sell" />                        Vender
                    </Link>
                </li>
                <li>
                    <Link to={"/profile"}>
                        <img src="https://img.icons8.com/ios-glyphs/30/FFFFFF/user--v1.png" alt="user--v1" />
                        Mi Perfil
                    </Link>
                </li>
            </ul>
            <div className="right">
                <button onClick={handleLogout}>
                    Cerrar Sesion
                    <img src="https://img.icons8.com/ios-filled/50/FFFFFF/login-rounded-right.png" alt="logout" />
                </button>
            </div>

            <div className="nav-cel">
                <ul>
                    <li>
                        <Link to={"/home"}>
                            <img src="https://img.icons8.com/ios-glyphs/30/FFFFFF/home.png" alt="home" />
                            Inicio
                        </Link>
                    </li>
                    <li>
                        <Link to={"/buy"}>
                            <img src="https://img.icons8.com/material-rounded/48/FFFFFF/shopping-cart.png" alt="shopping-cart" />
                            Comprar
                        </Link>
                    </li>
                    <li>
                        <Link to={"/sell"}>
                            <img width="48" height="48" src="https://img.icons8.com/material-rounded/FFFFFF/48/sell.png" alt="sell" />                        Vender
                        </Link>
                    </li>
                    <li>
                        <Link to={"/profile"}>
                            <img src="https://img.icons8.com/ios-glyphs/30/FFFFFF/user--v1.png" alt="user--v1" />
                            Mi Perfil
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Nav