import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ILogin } from "../interfaces/AuthInterface";
import { AuthService } from "../services/AuthService";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (data: ILogin) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem("token"));

    useEffect(() => {
        setIsAuthenticated(!!localStorage.getItem("token"));
    }, []);

    async function login(data: ILogin) {
        try {
            const response = await AuthService.login(data);
            if (response?.access_token) {
                localStorage.setItem("token", response.access_token);
                setIsAuthenticated(true);
                navigate("/");
            } else {
                console.error("Login falhou: Token não encontrado");
            }
        } catch (error) {
            console.error("Erro ao logar:", error);
        }
    }

    function logout() {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/login");
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook personalizado para acessar o contexto
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
}
