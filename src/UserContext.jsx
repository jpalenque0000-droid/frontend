import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    const fetchUserInfo = async () => {
        const token = localStorage.getItem('token')
        if (!token) return

        try {
            const res = await fetch('https://backend-24na.onrender.com/api/get_user_info', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (res.status === 401) {
                localStorage.removeItem('token')
                setUser(null)
                window.location.href = "/"
                return
            }

            const data = await res.json()
            if (res.ok) {
                setUser(data)
            } else {
                console.error(data.error)
            }
        } catch (error) {
            console.error('Error al obtener información del usuario:', error)
        }
    }

    useEffect(() => {
        fetchUserInfo()
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser, fetchUserInfo }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)
