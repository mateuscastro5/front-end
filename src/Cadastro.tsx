import { useForm } from "react-hook-form"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "sonner"

type Inputs = {
    nome: string
    email: string
    senha: string
    confirmarSenha: string
    telefone: string
    cidade: string
}

const apiUrl = import.meta.env.VITE_API_URL

export default function Cadastro() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>()    
    const navigate = useNavigate()

    const senha = watch("senha")

    async function cadastrarCliente(data: Inputs) {
        if (data.senha !== data.confirmarSenha) {
            toast.error("As senhas não coincidem")
            return
        }

        try {
            const response = await fetch(`${apiUrl}/clientes`, {
                headers: {"Content-Type": "application/json"},
                method: "POST",
                body: JSON.stringify({
                    nome: data.nome,
                    email: data.email,
                    senha: data.senha,
                    telefone: data.telefone,
                    cidade: data.cidade
                })
            })

            if (response.status === 201) {
                toast.success("Cadastro realizado com sucesso!")
                navigate("/login")
            } else {
                const erro = await response.json()
                toast.error(erro.erro || "Erro ao realizar cadastro")
            }
        } catch (error) {
            toast.error("Erro de conexão com o servidor")
        }
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <p style={{ height: 48 }}></p>
            <div className="flex flex-col items-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Criar Conta de Leitor
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(cadastrarCliente)}>
                            <div>
                                <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Nome Completo
                                </label>
                                <input 
                                    type="text" 
                                    id="nome" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    placeholder="João da Silva"
                                    required 
                                    {...register("nome", { 
                                        required: "Nome é obrigatório",
                                        minLength: { value: 2, message: "Nome deve ter pelo menos 2 caracteres" }
                                    })} 
                                />
                                {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    E-mail
                                </label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    placeholder="joao@email.com"
                                    required 
                                    {...register("email", { 
                                        required: "E-mail é obrigatório",
                                        pattern: { 
                                            value: /^\S+@\S+$/i, 
                                            message: "E-mail inválido" 
                                        }
                                    })} 
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="telefone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Telefone
                                </label>
                                <input 
                                    type="tel" 
                                    id="telefone" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    placeholder="(11) 99999-9999"
                                    required 
                                    {...register("telefone", { 
                                        required: "Telefone é obrigatório",
                                        minLength: { value: 10, message: "Telefone deve ter pelo menos 10 dígitos" }
                                    })} 
                                />
                                {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="cidade" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Cidade
                                </label>
                                <input 
                                    type="text" 
                                    id="cidade" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    placeholder="São Paulo"
                                    required 
                                    {...register("cidade", { 
                                        required: "Cidade é obrigatória",
                                        minLength: { value: 2, message: "Cidade deve ter pelo menos 2 caracteres" }
                                    })} 
                                />
                                {errors.cidade && <p className="text-red-500 text-sm mt-1">{errors.cidade.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="senha" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Senha
                                </label>
                                <input 
                                    type="password" 
                                    id="senha" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    required 
                                    {...register("senha", { 
                                        required: "Senha é obrigatória",
                                        minLength: { value: 6, message: "Senha deve ter pelo menos 6 caracteres" }
                                    })} 
                                />
                                {errors.senha && <p className="text-red-500 text-sm mt-1">{errors.senha.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="confirmarSenha" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Confirmar Senha
                                </label>
                                <input 
                                    type="password" 
                                    id="confirmarSenha" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    required 
                                    {...register("confirmarSenha", { 
                                        required: "Confirmação de senha é obrigatória",
                                        validate: value => value === senha || "As senhas não coincidem"
                                    })} 
                                />
                                {errors.confirmarSenha && <p className="text-red-500 text-sm mt-1">{errors.confirmarSenha.message}</p>}
                            </div>

                            <button 
                                type="submit" 
                                className="w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Criar Conta
                            </button>

                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Já possui conta? 
                                <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500 ml-1">
                                    Faça login
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}