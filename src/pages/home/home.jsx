import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from '../../UserContext';
import "./home.css";

const Home = () => {
    const navigate = useNavigate();
    const { user, fetchUserInfo } = useUser();
    const [usdtPriceSell, setUsdtPriceSell] = useState(0);
    const [usdtPriceBuy, setUsdtPriceBuy] = useState(0);
    const [mode, setMode] = useState("buy");

    const [usdtAmount, setUsdtAmount] = useState("");
    const [bobAmount, setBobAmount] = useState("");

    const [selectedImage, setSelectedImage] = useState(null);
    const [history, setHistory] = useState([]);

    const fetchData = async () => {
        try {
            const res = await fetch("https://backend-f880.onrender.com/api/usdt-price")

            const data = await res.json();
            setUsdtPriceSell(data.usdtPriceSell);
            setUsdtPriceBuy(data.usdtPriceBuy);
        } catch (error) {
            console.error("❌ Error cargando precios:", error);
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await fetch(`https://backend-f880.onrender.com/api/historial/${user?._id}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const data = await res.json();

            const recargas = data.recargas.map(r => ({
                type: "buy",
                date: r.fecha,
                amount: r.monto,
                price: r.BobExchangeRate,
                walletAddress: r.walletUsuario,
                comprobante: r.comprobanteUrl,
                estado: r.estado
            }));

            const retiros = data.retiros.map(r => ({
                type: "sell",
                date: r.fecha,
                amount: r.monto,
                price: r.BobExchangeRate,
                bankName: r.bancoUsuario.entidad,
                bankAccount: r.bancoUsuario.numeroCuenta,
                accountHolder: r.bancoUsuario.titular,
                comprobante: r.comprobanteUrl,
                estado: r.estado
            }));

            const historyFormatted = [...recargas, ...retiros].sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );

            setHistory(historyFormatted);
        } catch (error) {
            console.error("❌ Error cargando historial:", error);
        }
    }

    useEffect(() => {
        if (user) {
            fetchHistory()
        }
    }, [user])

    useEffect(() => {
        fetchData()
    }, [])

    const handleSwitch = () => {
        setMode(mode === "buy" ? "sell" : "buy");
        setBobAmount("");
        setUsdtAmount("");
    };

    const handleAction = () => {
        if (!usdtAmount) return;
        const path = mode === "buy" ? `/buy?amount=${usdtAmount}` : `/sell?amount=${usdtAmount}`;
        navigate(path);
        setBobAmount("");
        setUsdtAmount("");
    };

    return (
        <div className="homeContainer">
            <div className="banner">
                <div className="left">
                    <h3>Precio Actual</h3>
                    <div className="cont-center">
                        <small>precio compra</small>
                        <span>
                            1 USDT = {usdtPriceBuy ? `${usdtPriceBuy} BOB` : "Cargando..."}
                        </span>
                    </div>
                    <div className="cont-center">
                        <small>precio venta</small>
                        <span>
                            1 USDT = {usdtPriceSell ? `${usdtPriceSell} BOB` : "Cargando..."}
                        </span>
                    </div>
                    <small className="advertencia">
                        <img src="https://img.icons8.com/ios-filled/50/FFFFFF/break--v1.png" alt="break--v1" />
                        Advertencia: Este precio cambia en tiempo real segun el mercado.
                    </small>
                </div>
                <div className="priceTable">
                    <h3>Tabla de Conversión USDT vs BOB</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>USDT</th>
                                <th>BOB (Precio Compra)</th>
                                <th>BOB (Precio Venta)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[50, 100, 200, 500, 1000].map((val) => (
                                <tr key={val}>
                                    <td>{val}</td>
                                    <td>{(val * usdtPriceBuy).toFixed(2)}</td>
                                    <td>{(val * usdtPriceSell).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="calculatorSection">
                <div className="calculatorInfo">
                    <h3>¿Cómo usar la calculadora?</h3>
                    <p>
                        Aquí puedes calcular de forma rápida cuánto pagarías o recibirías al
                        comprar o vender USDT en BOB.
                    </p>
                    <ul>
                        <li>El precio se actualiza en tiempo real.</li>
                        <li>Puedes simular compras y ventas para saber cuanto recibiras/pagaras.</li>
                        <li>Las operaciones son seguras y rápidas.</li>
                        <li>Disponibilidad 24/7 para atender tus solicitudes.</li>
                    </ul>
                    <p>¿Tienes alguna duda?</p>
                    <a
                        href="https://wa.me/59175972099"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsappBtn"
                    >
                        <img width="20" height="20" src="https://img.icons8.com/color/48/whatsapp--v1.png" alt="whatsapp--v1" />
                        Contáctanos por WhatsApp
                    </a>
                </div>
                <div className="calculator">
                    <h3>Calculadora TetherBOB</h3>

                    <div className="switch">
                        <button
                            onClick={() => handleSwitch()}
                            className={mode === "buy" ? "active" : ""}
                        >
                            Comprar
                        </button>
                        <button
                            onClick={() => handleSwitch()}
                            className={mode === "sell" ? "active" : ""}
                        >
                            Vender
                        </button>
                    </div>

                    <div className="inputBox">
                        <label>Cantidad (USDT):</label>
                        <input
                            type="number"
                            value={usdtAmount}
                            onChange={(e) => {
                                const value = e.target.value;
                                setUsdtAmount(value);

                                if (mode === "buy") {
                                    setBobAmount((value * usdtPriceBuy).toFixed(2));
                                } else if (mode === "sell") {
                                    setBobAmount((value * usdtPriceSell).toFixed(2));
                                }
                            }}
                            placeholder="Ingrese cantidad"
                        />
                    </div>

                    <div className="inputBox">
                        <label>{mode === "buy" ? "Total a pagar (BOB):" : "Total a recibir (BOB):"}</label>
                        <input
                            type="number"
                            value={bobAmount}
                            onChange={(e) => {
                                const value = e.target.value;
                                setBobAmount(value);

                                if (mode === "buy" && usdtPriceBuy > 0) {
                                    setUsdtAmount((value / usdtPriceBuy).toFixed(2));
                                } else if (mode === "sell" && usdtPriceSell > 0) {
                                    setUsdtAmount((value / usdtPriceSell).toFixed(2));
                                }
                            }}
                            placeholder="Ingrese cantidad"
                        />
                    </div>

                    <button className="actionBtn" onClick={handleAction}>
                        {mode === "buy" ? "Comprar" : "Vender"}
                    </button>
                </div>
            </div>

            <div className="history">
                <h3>Compras / Ventas Anteriores</h3>
                <ul>
                    {history.map((h, i) => (
                        <li key={i} className={`history-item ${h.type}`}>
                            <div className="header">
                                <span className="date">{new Date(h.date).toLocaleString()}</span>
                                <span className={`type ${h.type}`}>
                                    {h.type === "buy" ? "Compra" : "Venta"}
                                </span>
                                <span className={`status ${h.estado}`}>{h.estado}</span>
                            </div>

                            <div className="details">
                                <span>
                                    <strong>Monto:</strong> <br /> {h.amount} USDT
                                </span>
                                <span>
                                    <strong>Precio:</strong> <br /> {h.price} BOB
                                </span>
                                <span>
                                    <strong>Total:</strong> <br /> {(h.amount * h.price).toFixed(2)} BOB
                                </span>
                            </div>

                            {h.type === "buy" && (
                                <div className="extra">
                                    <span>
                                        <strong>Wallet usada:</strong> {h.walletAddress}
                                    </span>
                                </div>
                            )}

                            {h.type === "sell" && (
                                <div className="extra">
                                    <span>
                                        <strong>Banco:</strong> {h.bankName}
                                    </span>
                                    <span>
                                        <strong>Cuenta:</strong> {h.bankAccount}
                                    </span>
                                    <span>
                                        <strong>Titular:</strong> {h.accountHolder}
                                    </span>
                                </div>
                            )}

                            <div className="actions">
                                <button onClick={() => setSelectedImage(h.comprobante)}>
                                    Ver comprobante
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                {selectedImage && (
                    <div className="modalHome" onClick={() => setSelectedImage(null)}>
                        <div className="modal-content">
                            <h2>Ver Comprobante</h2>
                            <img src={selectedImage} alt="Comprobante" />
                            <button className="close-btn" onClick={() => setSelectedImage(null)}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
