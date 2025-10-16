import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useClienteStore } from "./context/ClienteContext"
import { useNavigate, Link } from "react-router-dom"

type InteracaoType = {
  id: number
  tipo: string
  conteudo?: string
  nota?: number
  data: string
  resposta?: string
  noticia: {
    id: number
    titulo: string
    imagemUrl: string
  }
}

type NoticiaType = {
  id: number
  titulo: string
  resumo: string
  imagemUrl: string
  status: string
  motivo_rejeicao?: string
  dataPublicacao: string
  visualizacoes: number
  curtidas: number
  categoria: {
    nome: string
  }
}

const apiUrl = import.meta.env.VITE_API_URL

export default function AreaCliente() {
  const { cliente } = useClienteStore()
  const navigate = useNavigate()
  const [interacoes, setInteracoes] = useState<InteracaoType[]>([])
  const [minhasNoticias, setMinhasNoticias] = useState<NoticiaType[]>([])
  const [loading, setLoading] = useState(true)
  const [abaAtiva, setAbaAtiva] = useState<'interacoes' | 'noticias'>('interacoes')

  useEffect(() => {
    if (!cliente?.id) {
      toast.error("Você precisa estar logado")
      navigate("/login")
      return
    }
    carregarDados()
  }, [cliente, navigate])

  async function carregarDados() {
    await Promise.all([
      carregarInteracoes(),
      carregarMinhasNoticias()
    ])
    setLoading(false)
  }

  async function carregarInteracoes() {
    if (!cliente?.id) return
    
    try {
      const response = await fetch(`${apiUrl}/interacoes/cliente/${cliente.id}`)
      if (response.ok) {
        const dados = await response.json()
        setInteracoes(dados)
      } else {
        toast.error("Erro ao carregar interações")
      }
    } catch (error) {
      console.error("Erro ao carregar interações:", error)
      toast.error("Erro de conexão")
    }
  }

  async function carregarMinhasNoticias() {
    if (!cliente?.id) return
    
    try {
      const response = await fetch(`${apiUrl}/noticias/minhas/${cliente.id}`)
      if (response.ok) {
        const dados = await response.json()
        setMinhasNoticias(dados)
      } else {
        toast.error("Erro ao carregar suas notícias")
      }
    } catch (error) {
      console.error("Erro ao carregar notícias:", error)
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
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">{status}</span>
    }
  }

  function getInteracaoIcon(tipo: string) {
    switch (tipo) {
      case "curtida": return "❤️"
      case "comentario": return "💬"
      case "avaliacao": return "⭐"
      default: return "📝"
    }
  }

  if (!cliente?.id) {
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          👤 Área do Cliente
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Olá, <strong>{cliente.nome}</strong>! Aqui você pode acompanhar suas atividades.
        </p>
      </div>

      {/* Abas de navegação */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setAbaAtiva('interacoes')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                abaAtiva === 'interacoes'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
              }`}
            >
              💬 Minhas Interações ({interacoes.length})
            </button>
            <button
              onClick={() => setAbaAtiva('noticias')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                abaAtiva === 'noticias'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
              }`}
            >
              📰 Minhas Notícias ({minhasNoticias.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Conteúdo das abas */}
      {abaAtiva === 'interacoes' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            💬 Suas Interações e Respostas
          </h2>

          {interacoes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-lg mb-2">Você ainda não fez nenhuma interação</p>
              <p className="text-sm">Curta ou comente em alguma notícia para aparecer aqui!</p>
              <Link 
                to="/" 
                className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Ver Notícias
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {interacoes.map(interacao => (
                <div key={interacao.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={interacao.noticia.imagemUrl} 
                      alt={interacao.noticia.titulo}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          <Link 
                            to={`/noticia/${interacao.noticia.id}`}
                            className="hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            {interacao.noticia.titulo}
                          </Link>
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {new Date(interacao.data).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">{getInteracaoIcon(interacao.tipo)}</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {interacao.tipo === 'curtida' && 'Você curtiu esta notícia'}
                          {interacao.tipo === 'comentario' && 'Você comentou:'}
                          {interacao.tipo === 'avaliacao' && `Você avaliou com ${interacao.nota} estrelas`}
                        </span>
                      </div>
                      
                      {interacao.conteudo && (
                        <div className="bg-gray-100 dark:bg-gray-600 rounded-lg p-3 mb-3">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            "{interacao.conteudo}"
                          </p>
                        </div>
                      )}
                      
                      {interacao.resposta ? (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-lg p-3">
                          <div className="flex items-center mb-1">
                            <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                              📢 Resposta da Equipe:
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {interacao.resposta}
                          </p>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {abaAtiva === 'noticias' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              📰 Suas Notícias Enviadas
            </h2>
            <Link 
              to="/minhas-noticias"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm"
            >
              ✏️ Criar Nova Notícia
            </Link>
          </div>

          {minhasNoticias.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-6xl mb-4">📰</div>
              <p className="text-lg mb-2">Você ainda não criou nenhuma notícia</p>
              <p className="text-sm mb-4">Que tal compartilhar algo interessante?</p>
              <Link 
                to="/minhas-noticias"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Criar Primeira Notícia
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {minhasNoticias.map(noticia => (
                <div key={noticia.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <img 
                    src={noticia.imagemUrl} 
                    alt={noticia.titulo}
                    className="w-full h-32 object-cover"
                  />
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-300">
                        {noticia.categoria.nome}
                      </span>
                      {getStatusBadge(noticia.status)}
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {noticia.titulo}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {noticia.resumo}
                    </p>
                    
                    {noticia.status === "rejeitada" && noticia.motivo_rejeicao && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2 mb-3">
                        <p className="text-red-800 dark:text-red-200 text-xs">
                          <strong>Motivo da rejeição:</strong> {noticia.motivo_rejeicao}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{new Date(noticia.dataPublicacao).toLocaleDateString('pt-BR')}</span>
                      {noticia.status === "aprovada" && (
                        <div className="flex items-center space-x-2">
                          <span>👁️ {noticia.visualizacoes}</span>
                          <span>❤️ {noticia.curtidas}</span>
                        </div>
                      )}
                    </div>
                    
                    {noticia.status === "aprovada" && (
                      <Link 
                        to={`/noticia/${noticia.id}`}
                        className="block w-full text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 mt-3 text-sm font-medium"
                      >
                        👁️ Ver Notícia
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Estatísticas resumidas */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {interacoes.length}
          </div>
          <div className="text-sm text-blue-800 dark:text-blue-300 font-medium">
            Total de Interações
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {minhasNoticias.filter(n => n.status === 'aprovada').length}
          </div>
          <div className="text-sm text-green-800 dark:text-green-300 font-medium">
            Notícias Aprovadas
          </div>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {interacoes.filter(i => i.resposta).length}
          </div>
          <div className="text-sm text-purple-800 dark:text-purple-300 font-medium">
            Respostas Recebidas
          </div>
        </div>
      </div>
    </div>
  )
}