import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from '../../UserContext';
import './buy.css';
import toast, { Toaster } from 'react-hot-toast';
import { useSearchParams } from "react-router-dom";

const Buy = () => {
    const [searchParams] = useSearchParams();
    const { user, fetchUserInfo } = useUser();
    const [step, setStep] = useState(1);
    const [usdtPrice, setUsdtPrice] = useState(6.95);
    const [monto, setMonto] = useState('');
    const [comprobante, setComprobante] = useState(null);
    const [walletUsuario, setWalletUsuario] = useState(user?.wallet?.direccion);
    const [red, setRed] = useState(user?.wallet?.red);
    const [dataBanco, setDataBanco] = useState({
        entidad: "",
        numeroCuenta: "",
        titular: "",
        qrUrl: ""
    });

    console.log(user)

    const fetchInfoEmpresa = async () => {
        try {
            const res = await fetch('https://backend-f880.onrender.com/api/empresa/bancos', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const data = await res.json();

            setDataBanco({
                entidad: data?.bancos?.entidad || "no data",
                numeroCuenta: data?.bancos?.numeroCuenta || "no data",
                titular: data?.bancos?.titular || "no data",
                qrUrl: data?.bancos?.qrUrl || "no data"
            });
        } catch (err) {
            console.error("❌ Error al obtener info empresa:", err);
        }
    };

    useEffect(() => {
        fetchInfoEmpresa()
    }, [user])

    useEffect(() => {
        const queryMonto = searchParams.get("amount");
        if (queryMonto) {
            setMonto(queryMonto);
        }
    }, [searchParams]);

    const handleImageUpload = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const maxSize = 450;
                let width = img.width;
                let height = img.height;

                if (width > maxSize || height > maxSize) {
                    if (width > height) {
                        height = (height * maxSize) / width;
                        width = maxSize;
                    } else {
                        width = (width * maxSize) / height;
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                const resizedBase64 = canvas.toDataURL('image/jpeg');
                setComprobante(resizedBase64);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!walletUsuario || !red) {
            toast.error("⚠️ Debes ingresar tu dirección de wallet y red.");
            return;
        }

        const url = "https://backend-f880.onrender.com/api/buyusdt"

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    usuarioId: user._id,
                    monto: Number(monto),
                    BobExchangeRate: Number(usdtPrice),
                    comprobanteUrl: comprobante,
                    walletUsuario,
                    red
                }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                setMonto('');
                setComprobante(null);
                setStep(1);
                await fetchUserInfo();
            } else {
                toast.error(data.error || 'Error en la transacción');
            }
        } catch (error) {
            console.error('❌ Error al enviar:', error);
            toast.error('Ocurrió un error inesperado');
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("https://backend-f880.onrender.com/api/usdt-price")
                const data = await res.json();
                setUsdtPrice(data.usdtPriceBuy);
            } catch (error) {
                console.error("❌ Error cargando precios:", error);
            }
        };

        fetchData();
    }, [])

    return (
        <div className="buycont">
            <Toaster />
            <h2>Comprar USDT</h2>

            <div className="anunce">
                Recuerda que debes esperar entre 10 minutos y 1 hora habil para que tu compra o venta se haga efectivo.
            </div>

            <div className="steps">
                <div className={`step-indicator ${step === 1 ? 'active' : ''}`}>1. Verificar datos</div>
                <div className={`step-indicator ${step === 2 ? 'active' : ''}`}>2. Transferencia</div>
                <div className={`step-indicator ${step === 3 ? 'active' : ''}`}>3. Confirmación</div>
            </div>

            <form onSubmit={handleSubmit}>
                {step === 1 && (
                    <div className="step-content">
                        <h3>1. Verifica tu información</h3>
                        <label>Cuenta a nombre de</label>
                        <input type="text" value={user?.nombre} disabled />

                        <label>Email</label>
                        <input type="text" value={user?.email} disabled />

                        <label>Monto a comprar (USDT)</label>
                        <input
                            type="number"
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                            required
                        />

                        <p>Total en BOB: {monto && usdtPrice ? (monto * usdtPrice).toFixed(2) : 0}</p>

                        <button
                            type="button"
                            onClick={() => {
                                if (!monto || Number(monto) <= 0) {
                                    toast.error("Debes ingresar un monto válido.");
                                    return;
                                }
                                setStep(2);
                            }}
                        >
                            Siguiente
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="step-content sc2">
                        <h3>2. Realiza la transferencia</h3>
                        <h4 className="monto-s2">
                            <small>$</small> {monto} <small>USDT</small>
                            <br />
                            <span>≈ {monto && usdtPrice ? (monto * usdtPrice).toFixed(2) : 0} bob</span>
                        </h4>
                        <p className="ulsc2">
                            Transfiere ${monto * usdtPrice} BOB a la siguiente cuenta:
                        </p>
                        <ul>
                            <li>
                                <strong>Banco:</strong> {dataBanco?.entidad}
                            </li>
                            <li>
                                <strong>Numero Cuenta:</strong> {dataBanco?.numeroCuenta}
                            </li>
                            <li>
                                <strong>Titular Cuenta:</strong> {dataBanco?.titular}
                            </li>
                        </ul>

                        <div className="qr-code">
                            <p>QR de pago:</p>
                            {
                                dataBanco.qrUrl ? (
                                    <img src={dataBanco.qrUrl} alt="" />
                                ) : (
                                    <p>NO DATA</p>
                                )
                            }
                        </div>

                        <label>Comprobante (imagen)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e.target.files[0])}
                            required
                        />

                        {comprobante && <img className="img-p" src={comprobante} alt="" />}

                        <div className="step-actions">
                            <button type="button" onClick={() => setStep(1)}>
                                Atrás
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (!comprobante) {
                                        toast.error("Debes subir un comprobante antes de continuar.");
                                        return;
                                    }
                                    setStep(3);
                                }}
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="step-content">
                        <h3>3. Confirmarcion Wallet</h3>
                        <small className='text-s3'>para guardar los datos de tu wallet actualizala en "Mi Perfil".</small>

                        <label>Dirección de Wallet</label>
                        <input
                            type="text"
                            value={walletUsuario}
                            onChange={(e) => setWalletUsuario(e.target.value)}
                        />

                        <label>RED</label>
                        <input
                            type="text"
                            value={red}
                            onChange={(e) => setRed(e.target.value)}
                        />

                        <div className="step-actions">
                            <button type="button" onClick={() => setStep(2)}>
                                Atrás
                            </button>
                            <button type="submit">
                                Confirmar Compra
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Buy;
