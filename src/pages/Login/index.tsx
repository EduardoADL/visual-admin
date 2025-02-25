import { useState, FormEvent } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        await login({ username: email, password });
    }


    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg flex flex-col items-center">
                <img src="/logo.svg" className="w-16 h-16 " />
                <h2 className="text-center text-2xl font-semibold text-gray-800">Bem-vindo de volta</h2>
                <p className="text-center text-gray-500">Faça login para continuar</p>

                <form className="space-y-4 w-full" onSubmit={handleSubmit}>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">E-mail</label>
                        <input
                            type="email"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Senha</label>
                        <input
                            type="password"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="cursor-pointer w-full rounded-lg bg-purple-600 px-4 py-2 text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}
