import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useClienteStore } from "./context/ClienteContext"
import { toast } from "sonner"

type NoticiaCompleta = {
  id: number
  titulo: string
  resumo: string
  conteudo: string
  imagemUrl: string
  autor: string
  dataPublicacao: string
  visualizacoes: number
  curtidas: number
  categoria: {
    id: number
    nome: string
  }
  interacoes: {
    id: number
    tipo: string
    conteudo: string
    data: string
    cliente: {
      nome: string
    }
  }[]
}

const apiUrl = import.meta.env.VITE_API_URL

export default function Detalhes() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { cliente } = useClienteStore()
  const [noticia, setNoticia] = useState<NoticiaCompleta | null>(null)
  const [comentario, setComentario] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarNoticia()
  }, [id])

  async function carregarNoticia() {
    try {
      const response = await fetch(`${apiUrl}/noticias/${id}`)
      if (response.ok) {
        const dados = await response.json()
        setNoticia(dados)
      } else {
        toast.error("Notícia não encontrada")
        navigate("/")
      }
    } catch (error) {
      toast.error("Erro ao carregar notícia")
      navigate("/")
    } finally {
      setLoading(false)
    }
  }

  async function curtirNoticia() {
    if (!cliente) {
      toast.error("Faça login para curtir")
      return
    }

    try {
      const response = await fetch(`${apiUrl}/interacoes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "curtida",
          cliente_id: cliente.id,
          noticia_id: Number(id)
        })
      })

      if (response.ok) {
        toast.success("Notícia curtida!")
        carregarNoticia()
      }
    } catch (error) {
      toast.error("Erro ao curtir")
    }
  }

  async function enviarComentario() {
    if (!cliente) {
      toast.error("Faça login para comentar")
      return
    }

    if (!comentario.trim()) {
      toast.error("Digite um comentário")
      return
    }

    const dadosEnvio = {
      tipo: "comentario",
      conteudo: comentario,
      cliente_id: cliente.id,
      noticia_id: Number(id)
    }


    try {
      const response = await fetch(`${apiUrl}/interacoes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosEnvio)
      })


      if (response.ok) {
        toast.success("Comentário enviado!")
        setComentario("")
        carregarNoticia()
      } else {
        const erro = await response.json()
        toast.error(erro.erro || "Erro ao enviar comentário")
      }
    } catch (error) {
      console.error("Erro ao comentar:", error)
      toast.error("Erro ao enviar comentário")
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-300 rounded mb-4"></div>
          <div className="h-8 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
        </div>
      </div>
    )
  }

  if (!noticia) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Notícia não encontrada</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header da notícia */}
      <div className="mb-6">
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded dark:bg-blue-900 dark:text-blue-300">
          {noticia.categoria.nome}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
          {noticia.titulo}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
          <span>Por <strong>{noticia.autor}</strong></span>
          <span>{new Date(noticia.dataPublicacao).toLocaleDateString('pt-BR')}</span>
          <span>👁️ {noticia.visualizacoes} visualizações</span>
          <span>❤️ {noticia.curtidas} curtidas</span>
        </div>
      </div>

      {/* Imagem da notícia */}
      <div className="mb-6">
        <img 
          src={noticia.imagemUrl} 
          alt={noticia.titulo}
          className="w-full h-64 md:h-96 object-cover rounded-lg"
        />
      </div>

      {/* Resumo */}
      <div className="mb-6">
        <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
          {noticia.resumo}
        </p>
      </div>

      {/* Conteúdo */}
      <div className="mb-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
            {noticia.conteudo.split('\n').map((paragrafo, idx) => (
              <span key={idx}>
                {paragrafo}
                <br /><br />
              </span>
            ))}
          </p>
          <p className="text-gray-500 text-sm mt-4">
            Atualizado em {new Date(noticia.dataPublicacao).toLocaleDateString('pt-BR')}
          </p>
      </div>

      {/* Ações */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-8">
        <div className="flex gap-4">
          <button
            onClick={curtirNoticia}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            disabled={!cliente}
          >
            ❤️ Curtir ({noticia.curtidas})
          </button>
          
          {!cliente && (
            <p className="text-gray-500 py-2">
              <span className="cursor-pointer text-blue-600 hover:underline" onClick={() => navigate('/login')}>
                Faça login
              </span> para interagir
            </p>
          )}
        </div>
      </div>

      {/* Seção de comentários */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Comentários ({noticia.interacoes.filter(i => i.tipo === 'comentario').length})
        </h3>

        {/* Formulário de comentário */}
        {cliente && (
          <div className="mb-6">
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={3}
              placeholder="Escreva seu comentário..."
            />
            <button
              onClick={enviarComentario}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              💬 Comentar
            </button>
          </div>
        )}

        {/* Lista de comentários */}
        <div className="space-y-4">
          {noticia.interacoes
            .filter(interacao => interacao.tipo === 'comentario')
            .map(comentario => (
              <div key={comentario.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {comentario.cliente.nome}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(comentario.data).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {comentario.conteudo}
                </p>
              </div>
            ))}
        </div>

        {noticia.interacoes.filter(i => i.tipo === 'comentario').length === 0 && (
          <p className="text-gray-500 text-center py-8">
            Seja o primeiro a comentar!
          </p>
        )}
      </div>
    </div>
  )
}