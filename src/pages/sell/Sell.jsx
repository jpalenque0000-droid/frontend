import React, { useState, useEffect } from 'react';
import { useUser } from '../../UserContext';
import './sell.css';
import toast, { Toaster } from 'react-hot-toast';
import { useSearchParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

const Sell = () => {
    const [searchParams] = useSearchParams();
    const { user, fetchUserInfo } = useUser();
    const [step, setStep] = useState(1);
    const [monto, setMonto] = useState('');
    const [usdtPrice, setUsdtPrice] = useState(6.95);
    const [bankName, setBankName] = useState(user?.banco?.entidad);
    const [bankAccount, setBankAccount] = useState(user?.banco?.numeroCuenta);
    const [accountHolder, setAccountHolder] = useState(user?.banco?.titular);
    const [comprobante, setComprobante] = useState(null);
    const [dataBanco, setDataBanco] = useState({
        wallet: "",
        red: ""
    });

    const fetchInfoEmpresa = async () => {
        try {
            const res = await fetch('https://backend-24na.onrender.com/api/empresa/bancos', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const data = await res.json();

            setDataBanco({
                wallet: data?.walletEmpresa?.direccion || "NO DATA",
                red: data?.walletEmpresa?.red || "NO DATA"
            });
        } catch (err) {
            console.error("❌ Error al obtener info empresa:", err);
        }
    }

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

        if (!bankAccount || !bankName || !accountHolder) {
            toast.error("⚠️ Debes ingresar tu informacion de banco");
            return;
        }

        const url = "https://backend-24na.onrender.com/api/sellusdt";

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
                    bankAccount,
                    bankName,
                    accountHolder
                }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                setMonto('');
                setComprobante(null);
                await fetchUserInfo();
                setStep(1);
            } else {
                toast.error(data.error || 'Error en la transacción');
            }
        } catch (error) {
            console.error('❌ Error al enviar:', error);
            toast.error('Ocurrió un error inesperado');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("https://backend-24na.onrender.com/api/usdt-price")
                const data = await res.json();
                setUsdtPrice(data.usdtPriceSell);
            } catch (error) {
                console.error("❌ Error cargando precios:", error);
            }
        };

        fetchData();
    }, [])

    console.log(user)

    return (
        <div className="sellcont">
            <Toaster />

            <h2>Vender USDT</h2>

            <div className="anunce">
                Recuerda que debes esperar entre 10 minutos y 1 hora hábil para recibir tu pago en tu cuenta bancaria.
            </div>

            <div className="steps">
                <div className={`step-indicator ${step === 1 ? 'active' : ''}`}>1. Verificar datos</div>
                <div className={`step-indicator ${step === 2 ? 'active' : ''}`}>2. Transferir USDT</div>
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

                        <label>Monto a vender (USDT)</label>
                        <input
                            type="number"
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                            required
                        />

                        <p>Total en BOB: {monto && usdtPrice ? (monto * usdtPrice).toFixed(2) : 0}</p>

                        <button type="button" onClick={() => {
                            if (!monto || Number(monto) <= 0) {
                                toast.error("Debes ingresar un monto válido.");
                                return;
                            }
                            setStep(2);
                        }}>
                            Siguiente
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="step-content">
                        <h3>2. Transfiere tus USDT</h3>
                        <h4 className="monto-s2">
                            <small>$</small> {monto || 0} <small>USDT</small>
                            <br />
                            <span>≈ {monto && usdtPrice ? (monto * usdtPrice).toFixed(2) : 0} BOB</span>
                        </h4>
                        <p>Envía la cantidad a la siguiente dirección USDT (Red {dataBanco?.red}):</p>
                        <div className="wallet-box">
                            <strong>Wallet:</strong> <span>{dataBanco?.wallet}</span>
                        </div>

                        <div className="qr-code">
                            <p>QR de pago:</p>
                            {dataBanco?.wallet ? (
                                <QRCodeCanvas
                                    value={dataBanco?.wallet}
                                    size={250}
                                    bgColor="#ffffff"
                                    fgColor="#000000"
                                    includeMargin={true}
                                    className="qr"
                                />
                            ) : (
                                <p>NO DATA</p>
                            )}
                        </div>

                        <label>Comprobante de transferencia</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e.target.files[0])}
                            required
                        />

                        {comprobante && (
                            <img className="img-p" src={comprobante} alt="Comprobante" />
                        )}

                        <div className="step-actions">
                            <button type="button" onClick={() => setStep(1)}>Atrás</button>
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
                        <h3>3. Confirma y deja tus datos bancarios</h3>
                        <small className='text-s3'>para guardar los datos de tu banco actualizala en "Mi Perfil".</small>

                        <label>Banco</label>
                        <input
                            type="text"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                        />

                        <label>Número de cuenta</label>
                        <input
                            type="text"
                            value={bankAccount}
                            onChange={(e) => setBankAccount(e.target.value)}
                        />

                        <label>Titular de la cuenta</label>
                        <input
                            type="text"
                            value={accountHolder}
                            onChange={(e) => setAccountHolder(e.target.value)}
                        />

                        <div className="step-actions">
                            <button type="button" onClick={() => setStep(2)}>Atrás</button>
                            <button type="submit">Confirmar Venta</button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Sell;
