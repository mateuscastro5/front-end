import { Link, useNavigate } from "react-router-dom"
import { useClienteStore } from "../context/ClienteContext"
import { useState } from "react"

export default function Titulo() {
    const { cliente, deslogaCliente } = useClienteStore()
    const navigate = useNavigate()
    const [menuMobileAberto, setMenuMobileAberto] = useState(false)

    function clienteSair() {
        if (confirm("Confirma saída do sistema?")) {
            deslogaCliente()
            localStorage.removeItem("clienteKey")
            navigate("/login")
        }
    }

    return (
        <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo e Título */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="bg-white rounded-full p-2 group-hover:scale-110 transition-transform duration-200">
                                <span className="text-2xl">📰</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-white tracking-tight">
                                    News Portal
                                </span>
                                <span className="text-xs text-blue-100 -mt-1">
                                    Suas notícias em tempo real
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Menu Desktop */}
                    <div className="hidden md:flex items-center space-x-4">
                        {cliente?.id ? (
                            <>
                                {/* Informações do usuário */}
                                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {cliente.nome.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="text-white">
                                        <div className="text-sm font-medium">{cliente.nome}</div>
                                        {cliente.admin && (
                                            <div className="text-xs text-yellow-300 font-semibold">
                                                ⭐ Administrador
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Botões de navegação */}
                                <div className="flex items-center space-x-2">
                                    <Link 
                                        to="/area-cliente" 
                                        className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                                    >
                                        <span>👤</span>
                                        <span>Minha Área</span>
                                    </Link>

                                    <Link 
                                        to="/minhas-noticias" 
                                        className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2 shadow-lg"
                                    >
                                        <span>✏️</span>
                                        <span>Criar Notícia</span>
                                    </Link>

                                    {cliente.admin && (
                                        <Link 
                                            to="/admin" 
                                            className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2 shadow-lg animate-pulse"
                                        >
                                            <span>🛡️</span>
                                            <span>Admin</span>
                                        </Link>
                                    )}

                                    <button
                                        onClick={clienteSair}
                                        className="bg-red-500/80 hover:bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                                    >
                                        <span>🚪</span>
                                        <span>Sair</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link 
                                    to="/cadastro"
                                    className="text-white hover:text-blue-200 px-3 py-2 text-sm font-medium transition-colors duration-200"
                                >
                                    Cadastrar-se
                                </Link>
                                <Link 
                                    to="/login" 
                                    className="bg-white text-blue-600 hover:bg-blue-50 rounded-lg px-6 py-2 text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2"
                                >
                                    <span>🔐</span>
                                    <span>Entrar</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Botão do menu mobile */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMenuMobileAberto(!menuMobileAberto)}
                            className="text-white hover:text-blue-200 focus:outline-none focus:text-blue-200 transition-colors duration-200"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {menuMobileAberto ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Menu Mobile */}
                {menuMobileAberto && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-white/10 backdrop-blur-sm rounded-lg mt-2 border border-white/20">
                            {cliente?.id ? (
                                <>
                                    {/* Info do usuário mobile */}
                                    <div className="flex items-center space-x-3 px-3 py-2 bg-white/10 rounded-lg mb-2">
                                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {cliente.nome.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="text-white">
                                            <div className="font-medium">{cliente.nome}</div>
                                            {cliente.admin && (
                                                <div className="text-xs text-yellow-300">⭐ Admin</div>
                                            )}
                                        </div>
                                    </div>

                                    <Link 
                                        to="/area-cliente" 
                                        className="text-white hover:bg-white/20 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                                        onClick={() => setMenuMobileAberto(false)}
                                    >
                                        👤 Minha Área
                                    </Link>

                                    <Link 
                                        to="/minhas-noticias" 
                                        className="text-white hover:bg-white/20 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                                        onClick={() => setMenuMobileAberto(false)}
                                    >
                                        ✏️ Criar Notícia
                                    </Link>

                                    {cliente.admin && (
                                        <Link 
                                            to="/admin" 
                                            className="text-yellow-300 hover:bg-white/20 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                                            onClick={() => setMenuMobileAberto(false)}
                                        >
                                            🛡️ Painel Admin
                                        </Link>
                                    )}

                                    <button
                                        onClick={() => {
                                            clienteSair()
                                            setMenuMobileAberto(false)
                                        }}
                                        className="text-red-300 hover:bg-white/20 block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                                    >
                                        🚪 Sair
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        to="/cadastro"
                                        className="text-white hover:bg-white/20 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                                        onClick={() => setMenuMobileAberto(false)}
                                    >
                                        Cadastrar-se
                                    </Link>
                                    <Link 
                                        to="/login" 
                                        className="text-white hover:bg-white/20 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                                        onClick={() => setMenuMobileAberto(false)}
                                    >
                                        🔐 Entrar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}