import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useClienteStore } from "./context/ClienteContext"

type NoticiaInputs = {
  titulo: string
  resumo: string
  conteudo: string
  imagemUrl: string
  autor: string
  categoria_id: number
}

type NoticiaType = {
  id: number
  titulo: string
  resumo: string
  conteudo: string
  imagemUrl: string
  autor: string
  dataPublicacao: string
  visualizacoes: number
  curtidas: number
  status: string
  motivo_rejeicao?: string
  categoria: {
    id: number
    nome: string
  }
  cliente: {
    nome: string
  }
}

type CategoriaType = {
  id: number
  nome: string
}

const apiUrl = import.meta.env.VITE_API_URL

export default function MinhasNoticias() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NoticiaInputs>()
  const { cliente } = useClienteStore()
  const [noticias, setNoticias] = useState<NoticiaType[]>([])
  const [categorias, setCategorias] = useState<CategoriaType[]>([])

  useEffect(() => {
    if (cliente?.id) {
      carregarMinhasNoticias()
      carregarCategorias()
    }
  }, [cliente])

  async function carregarMinhasNoticias() {
    if (!cliente?.id) return
    
    try {
      const response = await fetch(`${apiUrl}/noticias/minhas/${cliente.id}`)
      const dados = await response.json()
      setNoticias(dados)
    } catch (error) {
      toast.error("Erro ao carregar suas notícias")
    }
  }

  async function carregarCategorias() {
    try {
      const response = await fetch(`${apiUrl}/categorias`)
      const dados = await response.json()
      setCategorias(dados)
    } catch (error) {
      toast.error("Erro ao carregar categorias")
    }
  }

  async function criarNoticia(data: NoticiaInputs) {
    if (!cliente?.id) {
      toast.error("Você precisa estar logado")
      return
    }

    try {
      const response = await fetch(`${apiUrl}/noticias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          categoria_id: Number(data.categoria_id),
          cliente_id: cliente.id
        })
      })

      if (response.status === 201) {
        toast.success("Notícia enviada para aprovação!")
        reset()
        carregarMinhasNoticias()
      } else {
        const erro = await response.json()
        toast.error(erro.erro || "Erro ao criar notícia")
      }
    } catch (error) {
      toast.error("Erro de conexão")
    }
  }

  async function excluirNoticia(id: number) {
    if (!confirm("Tem certeza que deseja excluir esta notícia?")) return

    try {
      const response = await fetch(`${apiUrl}/noticias/${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast.success("Notícia excluída com sucesso!")
        carregarMinhasNoticias()
      } else {
        toast.error("Erro ao excluir notícia")
      }
    } catch (error) {
      toast.error("Erro de conexão")
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "pendente":
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">🕐 Pendente</span>
      case "aprovada":
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">✅ Aprovada</span>
      case "rejeitada":
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">❌ Rejeitada</span>
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-900 dark:text-gray-300">{status}</span>
    }
  }

  if (!cliente) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Você precisa estar logado para acessar esta área.
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        📰 Minhas Notícias
      </h1>

      {/* Formulário para criar notícia */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          ✏️ Nova Notícia
        </h2>
        
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
          <p className="text-blue-800 dark:text-blue-200">
            <strong>ℹ️ Importante:</strong> Suas notícias serão enviadas para moderação. 
            Após a aprovação do administrador, elas aparecerão no site.
          </p>
        </div>
        
        <form onSubmit={handleSubmit(criarNoticia)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Título *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Título da notícia"
                {...register("titulo", { 
                  required: "Título é obrigatório",
                  minLength: { value: 5, message: "Título deve ter pelo menos 5 caracteres" }
                })}
              />
              {errors.titulo && <p className="text-red-500 text-sm mt-1">{errors.titulo.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Autor *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Nome do autor"
                defaultValue={cliente.nome}
                {...register("autor", { 
                  required: "Autor é obrigatório",
                  minLength: { value: 2, message: "Nome do autor deve ter pelo menos 2 caracteres" }
                })}
              />
              {errors.autor && <p className="text-red-500 text-sm mt-1">{errors.autor.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL da Imagem *
              </label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="https://exemplo.com/imagem.jpg"
                {...register("imagemUrl", { 
                  required: "URL da imagem é obrigatória",
                  pattern: {
                    value: /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i,
                    message: "URL deve ser uma imagem válida"
                  }
                })}
              />
              {errors.imagemUrl && <p className="text-red-500 text-sm mt-1">{errors.imagemUrl.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoria *
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                {...register("categoria_id", { required: "Categoria é obrigatória" })}
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
              {errors.categoria_id && <p className="text-red-500 text-sm mt-1">{errors.categoria_id.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Resumo *
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Resumo da notícia"
              {...register("resumo", { 
                required: "Resumo é obrigatório",
                minLength: { value: 10, message: "Resumo deve ter pelo menos 10 caracteres" }
              })}
            />
            {errors.resumo && <p className="text-red-500 text-sm mt-1">{errors.resumo.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Conteúdo Completo *
            </label>
            <textarea
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Conteúdo completo da notícia"
              {...register("conteudo", { 
                required: "Conteúdo é obrigatório",
                minLength: { value: 50, message: "Conteúdo deve ter pelo menos 50 caracteres" }
              })}
            />
            {errors.conteudo && <p className="text-red-500 text-sm mt-1">{errors.conteudo.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            📤 Enviar para Moderação
          </button>
        </form>
      </div>

      {/* Lista de notícias do usuário */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          📋 Suas Notícias ({noticias.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-4 py-3">Título</th>
                <th scope="col" className="px-4 py-3">Categoria</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3">Data</th>
                <th scope="col" className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {noticias.map(noticia => (
                <tr key={noticia.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {noticia.titulo}
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                      {noticia.categoria.nome}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(noticia.status)}
                    {noticia.status === "rejeitada" && noticia.motivo_rejeicao && (
                      <div className="text-xs text-red-600 mt-1">
                        Motivo: {noticia.motivo_rejeicao}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(noticia.dataPublicacao).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      {noticia.status === "pendente" && (
                        <button
                          onClick={() => excluirNoticia(noticia.id)}
                          className="text-red-600 hover:text-red-800 font-medium text-xs"
                        >
                          🗑️ Excluir
                        </button>
                      )}
                      {noticia.status === "aprovada" && (
                        <span className="text-green-600 text-xs">👁️ {noticia.visualizacoes} views</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {noticias.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Você ainda não criou nenhuma notícia.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}