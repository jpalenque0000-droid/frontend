import React, { useEffect, useState } from 'react';
import './dashboardAdmin.css';
import { useUser } from '../../UserContext';
import { Toaster, toast } from "react-hot-toast"

const DashboardAdmin = () => {
    const { user } = useUser();
    const [compras, setCompras] = useState([]);
    const [ventas, setVentas] = useState([]);
    const [estadisticas, setEstadisticas] = useState({});
    const [loadingCompras, setLoadingCompras] = useState(true);
    const [loadingVentas, setLoadingVentas] = useState(true);
    const [usdtPriceSell, setUsdtPriceSell] = useState(0);
    const [usdtPriceBuy, setUsdtPriceBuy] = useState(0);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenPrices, setModalOpenPrices] = useState(false);
    const [modalOpenImage, setModalOpenImage] = useState(false);

    // Datos de empresa
    const [entidad, setEntidad] = useState('');
    const [numeroCuenta, setNumeroCuenta] = useState('');
    const [titular, setTitular] = useState('');
    const [qrBase64, setQrBase64] = useState('');
    const [walletDireccion, setWalletDireccion] = useState('');
    const [walletRed, setWalletRed] = useState('TRC20');

    const fetchCompras = async () => {
        setLoadingCompras(true);
        try {
            const res = await fetch('https://backend-24na.onrender.com/api/admin/buys', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const data = await res.json();
            setCompras(data);
        } catch (err) {
            console.error('Error al cargar compras', err);
        }
        setLoadingCompras(false);
    };

    const fetchVentas = async () => {
        setLoadingVentas(true);
        try {
            const res = await fetch('https://backend-24na.onrender.com/api/admin/sales', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const data = await res.json();
            setVentas(data);
        } catch (err) {
            console.error('Error al cargar ventas', err);
        }
        setLoadingVentas(false);
    };

    const fetchEstadisticas = async () => {
        try {
            const res = await fetch('https://backend-24na.onrender.com/api/admin/estadisticas', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const data = await res.json();
            setEstadisticas(data);
        } catch (err) {
            console.error('Error al cargar estadísticas', err);
        }
    };

    const actualizarCompra = async (id, estado) => {
        try {
            const res = await fetch(`https://backend-24na.onrender.com/api/admin/buy/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ estado }),
            });

            if (!res.ok) {
                throw new Error("Error en la actualización de compra");
            }

            toast.success("✅ Compra actualizada correctamente");
            fetchCompras();
            fetchEstadisticas();
        } catch (err) {
            console.error("Error al actualizar compra", err);
            toast.error("❌ No se pudo actualizar la compra");
        }
    };

    const actualizarVenta = async (id, estado) => {
        try {
            const res = await fetch(`https://backend-24na.onrender.com/api/admin/sell/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ estado }),
            });

            if (!res.ok) {
                throw new Error("Error en la actualización de venta");
            }

            toast.success("✅ Venta actualizada correctamente");
            fetchVentas();
            fetchEstadisticas();
        } catch (err) {
            console.error("Error al actualizar venta", err);
            toast.error("❌ No se pudo actualizar la venta");
        }
    };

    const fetchInfoEmpresa = async () => {
        try {
            const res = await fetch('https://backend-24na.onrender.com/api/empresa/bancos', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const data = await res.json();

            if (data) {
                setEntidad(data.bancos?.entidad || '')
                setNumeroCuenta(data.bancos?.numeroCuenta || '')
                setTitular(data.bancos?.titular || '')
                setQrBase64(data.bancos?.qrUrl || '')
                setWalletDireccion(data.walletEmpresa?.direccion || '')
                setWalletRed(data.walletEmpresa?.red || 'TRC20')
            }
        } catch (err) {
            console.error('Error al obtener info empresa', err);
        }
    }

    const handleSaveConfig = async () => {
        try {
            await fetch(`https://backend-24na.onrender.com/api/empresa/bancos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    bancos: {
                        entidad,
                        numeroCuenta,
                        titular,
                        qrUrl: qrBase64,
                    },
                    walletEmpresa: {
                        direccion: walletDireccion,
                        red: walletRed,
                    },
                }),
            });
            setModalOpen(false);
        } catch (err) {
            console.error('Error al actualizar configuración', err)
        }
    }

    const handleSavePrices = async () => {
        try {
            const res = await fetch("https://backend-24na.onrender.com/api/usdt-price", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    usdtPriceBuy,
                    usdtPriceSell,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "❌ Error al guardar precios");
                return;
            }

            setModalOpenPrices(false)
            toast.success("Precios guardados correctamente");
        } catch (error) {
            console.error("❌ Error al conectar con el servidor:", error);
            toast.error("⚠️ No se pudo conectar con el servidor");
        }
    }

    const handleImageUpload = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const maxSize = 650;
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
                setQrBase64(resizedBase64);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    useEffect(() => {
        if (!user?.token) return
        fetchCompras()
        fetchVentas()
        fetchEstadisticas()
        fetchInfoEmpresa()
    }, [user])

    const fetchData = async () => {
        try {
            const res = await fetch("https://backend-24na.onrender.com/api/usdt-price")

            const data = await res.json();
            setUsdtPriceSell(data.usdtPriceSell);
            setUsdtPriceBuy(data.usdtPriceBuy);
        } catch (error) {
            console.error("❌ Error cargando precios:", error);
        }
    };

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="dashboard">
            <Toaster></Toaster>
            <h2>
                Panel de Control - USDT
                <div className="contbtns">
                    <div className="config-actions">
                        <button onClick={() => setModalOpen(true)}>⚙️ Actualizar Datos Empresa</button>
                    </div>
                    <div className="config-actions">
                        <button onClick={() => setModalOpenPrices(true)}>$ Actualizar Precios</button>
                    </div>
                </div>
            </h2>

            <div className="stats">
                <div className="card">Usuarios Activos<span>{estadisticas?.usuariosActivos || 0}</span></div>
                <div className="card">Total Comprado<span>${estadisticas?.totalComprado?.toLocaleString() || 0}</span></div>
                <div className="card">Total Vendido<span>${estadisticas?.totalVendido?.toLocaleString() || 0}</span></div>
                <div className="card">Transacciones Totales<span>{estadisticas?.totalTransacciones || 0}</span></div>
            </div>

            <div className="table-section">
                <h3>Peticiones de Compra</h3>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Fecha</th>
                                <th>Monto (USDT)</th>
                                <th>Monto (BOB)</th>
                                <th>Wallet</th>
                                <th>RED</th>
                                <th>Comprobante</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingCompras ? (
                                <tr><td colSpan="6">Cargando compras...</td></tr>
                            ) : compras.length === 0 ? (
                                <tr><td colSpan="6" className="empty-message">No hay compras registradas</td></tr>
                            ) : (
                                compras.map(c => (
                                    <tr key={c._id}>
                                        <td className="truncate-text">{c.usuarioId?.nombre}</td>
                                        <td>{new Date(c.fecha).toLocaleString()}</td>
                                        <td>${c.monto}</td>
                                        <td>${c.monto * c.BobExchangeRate}</td>
                                        <td>
                                            <span>{(c.walletUsuario).slice(0, 20)}...</span>
                                            <button onClick={() => {
                                                navigator.clipboard.writeText(c.walletUsuario);
                                                toast.success("Texto Copiado!");
                                            }}>
                                                <img width="15" height="15" src="https://img.icons8.com/material-outlined/24/FFFFFF/copy.png" alt="copy" />
                                                Copiar
                                            </button>
                                        </td>
                                        <td>{c.red}</td>
                                        <td><button onClick={() => setModalOpenImage(c.comprobanteUrl)}>Ver Comprobante</button></td>
                                        <td>
                                            {c.estado === 'pendiente' ? (
                                                <div className="btns">
                                                    <button className="ap" onClick={() => actualizarCompra(c._id, 'aprobada')}>Aprobar</button>
                                                    <button className="re" onClick={() => actualizarCompra(c._id, 'rechazada')}>Rechazar</button>
                                                </div>
                                            ) : <span>{c.estado}</span>}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="table-section">
                <h3>Peticiones de Venta</h3>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Fecha</th>
                                <th>Monto (USDT)</th>
                                <th>Monto (BOB)</th>
                                <th>Banco</th>
                                <th>Comprobante</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingVentas ? (
                                <tr><td colSpan="7">Cargando ventas...</td></tr>
                            ) : ventas.length === 0 ? (
                                <tr><td colSpan="7" className="empty-message">No hay ventas registradas</td></tr>
                            ) : (
                                ventas.map(v => (
                                    <tr key={v._id}>
                                        <td className="truncate-text">{v.usuarioId?.nombre}</td>
                                        <td>{new Date(v.fecha).toLocaleString()}</td>
                                        <td>${v.monto}</td>
                                        <td>${v.monto * v.BobExchangeRate}</td>
                                        <td>
                                            {v.bancoUsuario.entidad}
                                            <br />
                                            {v.bancoUsuario.numeroCuenta}
                                            <br />
                                            {v.bancoUsuario.titular}
                                        </td>
                                        <td><button onClick={() => setModalOpenImage(v.comprobanteUrl)}>Ver Comprobante</button></td>
                                        <td>
                                            {v.estado === 'pendiente' ? (
                                                <div className="btns">
                                                    <button className="ap" onClick={() => actualizarVenta(v._id, 'aprobado')}>Aprobar</button>
                                                    <button className="re" onClick={() => actualizarVenta(v._id, 'rechazado')}>Rechazar</button>
                                                </div>
                                            ) : <span>{v.estado}</span>}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {modalOpen && (
                <div className="modal">
                    <div className="modal-content modalbank">
                        <h3>Actualizar Datos de Pago</h3>

                        <h4>Datos Banco</h4>
                        <label>Entidad Bancaria</label>
                        <input type="text" value={entidad} onChange={(e) => setEntidad(e.target.value)} />

                        <label>Número de Cuenta</label>
                        <input type="text" value={numeroCuenta} onChange={(e) => setNumeroCuenta(e.target.value)} />

                        <label>Titular</label>
                        <input type="text" value={titular} onChange={(e) => setTitular(e.target.value)} />

                        <label>QR de Pago</label>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} />
                        {qrBase64 && <img src={qrBase64} alt="QR" style={{ width: '150px', marginTop: '10px' }} />}

                        <h4>Datos Wallet</h4>
                        <label>Wallet Dirección</label>
                        <input type="text" value={walletDireccion} onChange={(e) => setWalletDireccion(e.target.value)} />

                        <label>Red de la Wallet</label>
                        <select value={walletRed} onChange={(e) => setWalletRed(e.target.value)}>
                            <option value="TRC20">TRC20</option>
                            <option value="ERC20">ERC20</option>
                            <option value="BEP20">BEP20</option>
                        </select>

                        <div className="modal-actions">
                            <button onClick={handleSaveConfig}>Guardar</button>
                            <button onClick={() => setModalOpen(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {modalOpenPrices && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Actualizar Precios</h3>

                        <label>Precio Venta (BOB)</label>
                        <input type="text" value={usdtPriceSell} onChange={(e) => setUsdtPriceSell(e.target.value)} />

                        <label>Precio Compra (BOB)</label>
                        <input type="text" value={usdtPriceBuy} onChange={(e) => setUsdtPriceBuy(e.target.value)} />

                        <div className="modal-actions">
                            <button onClick={handleSavePrices}>Guardar</button>
                            <button onClick={() => setModalOpenPrices(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {modalOpenImage && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Ver Comprobante</h2>
                        <img src={modalOpenImage} alt="Comprobante" />
                        <button className="close-btn" onClick={() => setModalOpenImage(null)}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardAdmin;
