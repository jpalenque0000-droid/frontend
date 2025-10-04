import { useState, useEffect } from 'react'
import Logo from "../../img/logo.png"
import { useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../../UserContext'
import "./auth.css"
import toast, { Toaster } from 'react-hot-toast';

const Auth = () => {
  const [stateSection, setStateSection] = useState(1)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, setUser, fetchUserInfo } = useUser()

  // Login
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Register
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const code = params.get('referal_code')
    if (code) {
      setReferralCode(code)
      setStateSection(2)
    }
  }, [location])

  const handleLogin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Iniciando sesión...');

    try {
      const res = await fetch('https://backend-24na.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Error al iniciar sesión');
      } else {
        localStorage.setItem('token', data.token);
        await fetchUserInfo();

        if (data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }

        toast.success("Sesión iniciada correctamente");
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de red al iniciar sesión');
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault()

    const payload = {
      nombre,
      telefono,
      email: registerEmail,
      password: registerPassword,
      confirmPassword,
      codigoReferido: referralCode
    }

    try {
      const res = await fetch('https://backend-24na.onrender.com/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Error al registrarse')
      } else {
        toast.success('Registro exitoso. Ahora puedes iniciar sesión.')
        setStateSection(1)
      }
    } catch (error) {
      console.error(error)
      toast.error('Error de red al registrarse')
    }
  }

  return (
    <div className='sectionInit'>
      <Toaster></Toaster>
      {
        stateSection === 1 ? (
          <div className="form-container">
            <img className='logo' src={Logo} alt="" />
            <p className="title">Iniciar Sesion</p>
            <form className="form" onSubmit={handleLogin}>
              <input
                type="email"
                className="input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                className="input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="form-btn" type="submit">Ingresar</button>
            </form>
            <p className="sign-up-label">
              No tienes cuenta? &nbsp;
              <span onClick={() => setStateSection(2)} className="sign-up-link">Registrate</span>
            </p>
          </div>
        ) : (
          <div className="form-container register">
            <img className='logo' src={Logo} alt="" />
            <p className="title">Registrarse</p>
            <form className="form" onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                  id="name"
                  type="text"
                  className="input"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  placeholder="Email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  id="password"
                  type="password"
                  className="input"
                  placeholder="Contraseña"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="input"
                  placeholder="Confirmar Contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button className="form-btn" type="submit">Registrarse</button>
            </form>
            <p className="sign-up-label">
              ¿Ya tienes una cuenta? &nbsp;
              <span onClick={() => setStateSection(1)} className="sign-up-link">Iniciar Sesión</span>
            </p>
          </div>
        )
      }
    </div>
  )
}

export default Auth