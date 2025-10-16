import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { NoticiaType } from "../utils/NoticiaType";
import { useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
    termo: string
}

type InputPesquisaProps = {
    setNoticias: React.Dispatch<React.SetStateAction<NoticiaType[]>>
}

export function InputPesquisa({ setNoticias }: InputPesquisaProps) {
    const { register, handleSubmit, reset } = useForm<Inputs>()
    const [pesquisando, setPesquisando] = useState(false)

    async function enviaPesquisa(data: Inputs) {
        if (data.termo.length < 2) {
            toast.error("Informe, no mínimo, 2 caracteres")
            return
        }

        setPesquisando(true)

        try {
            const response = await fetch(`${apiUrl}/noticias/pesquisa/${encodeURIComponent(data.termo)}`)
            
            if (response.ok) {
                const dados = await response.json()
                setNoticias(dados)
                
                if (dados.length === 0) {
                    toast.info("Nenhuma notícia encontrada")
                } else {
                    toast.success(`${dados.length} notícia(s) encontrada(s)`)
                }
            } else {
                toast.error("Erro ao pesquisar notícias")
            }
        } catch (error) {
            console.error("Erro na pesquisa:", error)
            toast.error("Erro ao pesquisar notícias")
        } finally {
            setPesquisando(false)
        }
    }

    async function mostraDestaques() {
        setPesquisando(true)
        
        try {
            const response = await fetch(`${apiUrl}/noticias`)
            
            if (response.ok) {
                const dados = await response.json()
                reset({ termo: "" })
                setNoticias(dados)
                toast.success("Destaques carregados")
            } else {
                toast.error("Erro ao carregar destaques")
            }
        } catch (error) {
            console.error("Erro ao carregar destaques:", error)
            toast.error("Erro ao carregar destaques")
        } finally {
            setPesquisando(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto mt-8 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4">
                    <form className="flex-1" onSubmit={handleSubmit(enviaPesquisa)}>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input 
                                type="search" 
                                className="block w-full pl-12 pr-4 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                                placeholder="🔍 Pesquisar por título, categoria ou autor..." 
                                disabled={pesquisando}
                                {...register('termo')} 
                            />
                            <button 
                                type="submit" 
                                disabled={pesquisando}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-lg text-sm px-6 py-2 transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                {pesquisando ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Buscando...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>🔍</span>
                                        <span>Pesquisar</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                    
                    <button 
                        type="button" 
                        onClick={mostraDestaques}
                        disabled={pesquisando}
                        className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-xl px-6 py-3 transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2 whitespace-nowrap"
                    >
                        <span>⭐</span>
                        <span>Destaques</span>
                    </button>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Pesquisas populares:</span>
                    {['Tecnologia', 'Esporte', 'Política', 'Entretenimento', 'Games'].map(tag => (
                        <button
                            key={tag}
                            onClick={() => {
                                reset({ termo: tag })
                                enviaPesquisa({ termo: tag })
                            }}
                            className="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full transition-colors duration-200"
                        >
                            #{tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}