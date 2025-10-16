import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useClienteStore } from "./context/ClienteContext"
import { useNavigate, Link } from "react-router-dom"

type NoticiaType = {
  id: number
  titulo: string
  resumo: string
  conteudo: string
  imagemUrl: string
  autor: string
  dataPublicacao: string
  status: string
  categoria: {
    id: number
    nome: string
  }
  cliente: {
    nome: string
    email: string
  }
}

const apiUrl = import.meta.env.VITE_API_URL

export default function PainelAdmin() {
  const { cliente } = useClienteStore()
  const navigate = useNavigate()
  const [noticiasPendentes, setNoticiasPendentes] = useState<NoticiaType[]>([])
  const [noticiaDetalhes, setNoticiaDetalhes] = useState<NoticiaType | null>(null)
  const [motivoRejeicao, setMotivoRejeicao] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!cliente?.admin) {
      toast.error("Acesso negado - Apenas administradores")
      navigate("/")
      return
    }
    carregarNoticiasPendentes()
  }, [cliente, navigate])

  async function carregarNoticiasPendentes() {
    try {
      const response = await fetch(`${apiUrl}/noticias/pendentes`)
      const dados = await response.json()
      setNoticiasPendentes(dados)
    } catch (error) {
      toast.error("Erro ao carregar notícias pendentes")
    } finally {
      setLoading(false)
    }
  }

  async function aprovarNoticia(id: number) {
    if (!confirm("Tem certeza que deseja aprovar esta notícia?")) return

    try {
      const response = await fetch(`${apiUrl}/noticias/${id}/aprovar`, {
        method: "PUT"
      })

      if (response.ok) {
        toast.success("Notícia aprovada com sucesso!")
        carregarNoticiasPendentes()
        setNoticiaDetalhes(null)
      } else {
        toast.error("Erro ao aprovar notícia")
      }
    } catch (error) {
      toast.error("Erro de conexão")
    }
  }

  async function rejeitarNoticia(id: number) {
    if (!motivoRejeicao.trim()) {
      toast.error("Informe o motivo da rejeição")
      return
    }

    if (!confirm("Tem certeza que deseja rejeitar esta notícia?")) return

    try {
      const response = await fetch(`${apiUrl}/noticias/${id}/rejeitar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motivo: motivoRejeicao })
      })

      if (response.ok) {
        toast.success("Notícia rejeitada")
        carregarNoticiasPendentes()
        setNoticiaDetalhes(null)
        setMotivoRejeicao("")
      } else {
        toast.error("Erro ao rejeitar notícia")
      }
    } catch (error) {
      toast.error("Erro de conexão")
    }
  }

  if (!cliente?.admin) {
    return null
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-4"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        🛡️ Painel Administrativo
      </h1>

      <Link 
        to="/dashboard"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm"
      >
        📊 Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de notícias pendentes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            📋 Notícias Pendentes ({noticiasPendentes.length})
          </h2>

          {noticiasPendentes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-6xl mb-4">✅</div>
              <p>Nenhuma notícia pendente para moderação!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {noticiasPendentes.map(noticia => (
                <div key={noticia.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {noticia.titulo}
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Por: <strong>{noticia.autor}</strong> ({noticia.cliente.email})
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Categoria: <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {noticia.categoria.nome}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                    {noticia.resumo}
                  </p>
                  <button
                    onClick={() => setNoticiaDetalhes(noticia)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    👁️ Ver Detalhes
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detalhes da notícia selecionada */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            🔍 Detalhes da Notícia
          </h2>

          {!noticiaDetalhes ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-6xl mb-4">📰</div>
              <p>Selecione uma notícia para ver os detalhes</p>
            </div>
          ) : (
            <div>
              <img 
                src={noticiaDetalhes.imagemUrl} 
                alt={noticiaDetalhes.titulo}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {noticiaDetalhes.titulo}
              </h3>
              
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <strong>Autor:</strong> {noticiaDetalhes.autor}
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <strong>Email do criador:</strong> {noticiaDetalhes.cliente.email}
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <strong>Categoria:</strong> {noticiaDetalhes.categoria.nome}
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                <strong>Data:</strong> {new Date(noticiaDetalhes.dataPublicacao).toLocaleDateString()}
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Resumo:</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {noticiaDetalhes.resumo}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Conteúdo:</h4>
                <div className="max-h-48 overflow-y-auto text-gray-700 dark:text-gray-300 text-sm">
                  {noticiaDetalhes.conteudo.split('\n').map((paragrafo, index) => (
                    <p key={index} className="mb-2">{paragrafo}</p>
                  ))}
                </div>
              </div>

              {/* Ações de moderação */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Ações de Moderação:</h4>
                
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => aprovarNoticia(noticiaDetalhes.id)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 font-medium"
                  >
                    ✅ Aprovar
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Motivo da rejeição:
                  </label>
                  <textarea
                    value={motivoRejeicao}
                    onChange={(e) => setMotivoRejeicao(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows={2}
                    placeholder="Explique o motivo da rejeição..."
                  />
                  <button
                    onClick={() => rejeitarNoticia(noticiaDetalhes.id)}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 font-medium mt-2"
                  >
                    ❌ Rejeitar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}