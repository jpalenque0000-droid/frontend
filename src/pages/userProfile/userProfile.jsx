import React, { useEffect, useState } from 'react'
import { useUser } from '../../UserContext'
import './userProfile.css'
import toast, { Toaster } from 'react-hot-toast';

const UserProfile = () => {
    const { user, fetchUserInfo } = useUser()
    const [form, setForm] = useState({
        nombre: user?.nombre || '',
        email: user?.email || '',
        banco: {
            entidad: user?.banco?.entidad || '',
            numeroCuenta: user?.banco?.numeroCuenta || '',
            titular: user?.banco?.titular || ''
        },
        wallet: {
            direccion: user?.wallet?.direccion || '',
            red: user?.wallet?.red || ''
        }
    })
    const [loading, setLoading] = useState(false)
    const [stats, setStats] = useState({ compras: 0, ventas: 0, pendientes: 0, dineroMovido: 0 });
    const [modalOpen, setModalOpen] = useState(false);
    const [formPassword, setFormPassword] = useState({ currentPassword: "", newPassword: "" });

    const fetchStats = async () => {
        try {
            const res = await fetch(`https://backend-f880.onrender.com/api/userStats/${user._id}`, {
                headers: { "Authorization": `Bearer ${user.token}` },
            });
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error("❌ Error cargando stats:", err);
        }
    }

    useEffect(() => {
        if (user) {
            fetchStats()
        }
    }, [user]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("https://backend-f880.onrender.com/api/user/change-password", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    idUser: user._id,
                    currentPassword: form.currentPassword,
                    newPassword: form.newPassword,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                setModalOpen(false);
                setForm({ currentPassword: "", newPassword: "" });
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.error("❌ Error cambiando contraseña:", err);
            toast.error("Error al actualizar contraseña");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("banco.")) {
            const field = name.split(".")[1];
            setForm((prev) => ({
                ...prev,
                banco: { ...prev.banco, [field]: value }
            }));
        } else if (name.startsWith("wallet.")) {
            const field = name.split(".")[1];
            setForm((prev) => ({
                ...prev,
                wallet: { ...prev.wallet, [field]: value }
            }));
        } else {
            setForm({ ...form, [name]: value });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('https://backend-f880.onrender.com/api/update_profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(form)
            })

            const data = await res.json()

            if (res.ok) {
                await fetchUserInfo()
                toast.success('Perfil actualizado correctamente')
            } else {
                toast.error(data.error || 'Error al actualizar')
            }
        } catch (err) {
            console.error('Error al actualizar perfil:', err)
            toast.error('Error de red')
        }

        setLoading(false)
    }

    useEffect(() => {
        if (!user) return
        setForm({
            nombre: user?.nombre || '',
            email: user?.email || '',
            banco: {
                entidad: user?.banco?.entidad || '',
                numeroCuenta: user?.banco?.numeroCuenta || '',
                titular: user?.banco?.titular || ''
            },
            wallet: {
                direccion: user?.wallet?.direccion || '',
                red: user?.wallet?.red || ''
            }
        })
    }, [user])

    if (!user) return <div className="profile">Cargando perfil...</div>

    return (
        <div className="profile">
            <Toaster />
            <h2>
                Mi Perfil
                <button onClick={() => setModalOpen(true)}>Actualizar Contraseña</button>
            </h2>

            <div className="profile-layout">
                <div className="stats-cards">
                    <div className="stat-card">
                        <h4>Compras Totales</h4>
                        <p>{stats?.compras}</p>
                    </div>
                    <div className="stat-card">
                        <h4>Ventas Totales</h4>
                        <p>{stats?.ventas}</p>
                    </div>
                    <div className="stat-card">
                        <h4>Dinero Movido</h4>
                        <p>${stats?.dineroMovido} USDT</p>
                    </div>
                    <div className="stat-card">
                        <h4>Pendientes</h4>
                        <p>{stats?.pendientes}</p>
                    </div>
                </div>

                <form className="profile-card" onSubmit={handleSubmit}>
                    <div className="flexform">
                        <h3>Información de Usuario</h3>
                        <div className="inform">
                            <div className="profile-item">
                                <label>Nombre completo</label>
                                <input type="text" name="nombre" value={form?.nombre} onChange={handleChange} required />
                            </div>
                            <div className="profile-item">
                                <label>Email</label>
                                <input type="email" name="email" value={form?.email} onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    <div className="flexform">
                        <h3>Datos Bancarios</h3>
                        <div className="inform">
                            <div className="profile-item">
                                <label>Entidad Bancaria</label>
                                <input type="text" name="banco.entidad" value={form?.banco?.entidad} onChange={handleChange} />
                            </div>
                            <div className="profile-item">
                                <label>Número de Cuenta</label>
                                <input type="text" name="banco.numeroCuenta" value={form?.banco?.numeroCuenta} onChange={handleChange} />
                            </div>
                            <div className="profile-item">
                                <label>Titular</label>
                                <input type="text" name="banco.titular" value={form?.banco?.titular} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="flexform">
                        <h3>Wallet</h3>
                        <div className="inform">
                            <div className="profile-item direction">
                                <label>Dirección</label>
                                <input type="text" name="wallet.direccion" value={form?.wallet?.direccion} onChange={handleChange} />
                            </div>
                            <div className="profile-item">
                                <label>Red</label>
                                <select name="wallet.red" value={form?.wallet?.red} onChange={handleChange}>
                                    <option value="">Seleccione red</option>
                                    <option value="TRC20">TRC20</option>
                                    <option value="ERC20">ERC20</option>
                                    <option value="BEP20">BEP20</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Guardando...' : 'Actualizar Datos'}
                    </button>
                </form>
            </div>

            {modalOpen && (
                <div className="modal-overlay-profile" onClick={() => setModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Cambiar Contraseña</h3>
                        <form className='formmp' onSubmit={handlePasswordChange}>
                            <input
                                type="password"
                                placeholder="Contraseña actual"
                                value={form.currentPassword}
                                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Nueva contraseña"
                                value={form.newPassword}
                                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                                required
                            />
                            <div className="btns">
                                <button type="submit">Actualizar</button>
                                <button type="button" onClick={() => setModalOpen(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserProfile
