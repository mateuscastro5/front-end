import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useClienteStore } from "./context/ClienteContext"
import { useNavigate, Link } from "react-router-dom"
import { VictoryPie, VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryLine } from 'victory'

type EstatisticasType = {
  totalNoticias: number
  noticiasPendentes: number
  noticiasAprovadas: number
  noticiasRejeitadas: number
  totalClientes: number
  totalInteracoes: number
  totalCurtidas: number
  totalComentarios: number
  noticiasPorCategoria: {
    categoria: string
    total: number
  }[]
  noticiasRecentes: {
    id: number
    titulo: string
    status: string
    dataPublicacao: string
    categoria: { nome: string }
    cliente: { nome: string }
  }[]
  interacoesPorDia: {
    dia: Date
    total: number
  }[]
}

const apiUrl = import.meta.env.VITE_API_URL

export default function Dashboard() {
  const { cliente } = useClienteStore()
  const navigate = useNavigate()
  const [stats, setStats] = useState<EstatisticasType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!cliente?.admin) {
      toast.error("Acesso negado - Apenas administradores")
      navigate("/")
      return
    }
    carregarEstatisticas()
  }, [cliente, navigate])

  async function carregarEstatisticas() {
    try {
      const response = await fetch(`${apiUrl}/dashboard/stats`)
      if (response.ok) {
        const dados = await response.json()
        setStats(dados)
      } else {
        toast.error("Erro ao carregar estatísticas")
      }
    } catch (error) {
      toast.error("Erro de conexão")
    } finally {
      setLoading(false)
    }
  }

  if (!cliente?.admin) return null

  if (loading || !stats) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const dadosStatus = [
    { x: "Aprovadas", y: stats.noticiasAprovadas },
    { x: "Pendentes", y: stats.noticiasPendentes },
    { x: "Rejeitadas", y: stats.noticiasRejeitadas }
  ]

  const dadosCategorias = stats.noticiasPorCategoria.map(cat => ({
    x: cat.categoria,
    y: cat.total
  }))

  const dadosInteracoesPorDia = stats.interacoesPorDia.map(item => ({
    x: new Date(item.dia).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    y: Number(item.total)
  }))

  // Calcular max para o gráfico
  const maxInteracoes = Math.max(...dadosInteracoesPorDia.map(d => d.y), 10)

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            📊 Dashboard Administrativo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visão geral do sistema
          </p>
        </div>
        <div className="flex space-x-2">
          <Link 
            to="/admin"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium text-sm"
          >
            🛡️ Moderação
          </Link>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total de Notícias</p>
              <p className="text-3xl font-bold mt-2">{stats.totalNoticias}</p>
            </div>
            <div className="bg-blue-400 rounded-full p-3">
              <span className="text-3xl">📰</span>
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-blue-100">
              {stats.noticiasAprovadas} aprovadas • {stats.noticiasPendentes} pendentes
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total de Clientes</p>
              <p className="text-3xl font-bold mt-2">{stats.totalClientes}</p>
            </div>
            <div className="bg-green-400 rounded-full p-3">
              <span className="text-3xl">👥</span>
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-green-100">Usuários cadastrados</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total de Interações</p>
              <p className="text-3xl font-bold mt-2">{stats.totalInteracoes}</p>
            </div>
            <div className="bg-purple-400 rounded-full p-3">
              <span className="text-3xl">💬</span>
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-purple-100">
              {stats.totalCurtidas} curtidas • {stats.totalComentarios} comentários
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Pendentes</p>
              <p className="text-3xl font-bold mt-2">{stats.noticiasPendentes}</p>
            </div>
            <div className="bg-orange-400 rounded-full p-3">
              <span className="text-3xl">⏳</span>
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-orange-100">Aguardando moderação</span>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gráfico de Pizza - Status das Notícias */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            📊 Status das Notícias
          </h2>
          <VictoryPie
            data={dadosStatus}
            colorScale={["#10b981", "#f59e0b", "#ef4444"]}
            labels={({ datum }) => `${datum.x}: ${datum.y}`}
            style={{
              labels: { fontSize: 14, fill: "#374151" }
            }}
            padding={{ top: 50, bottom: 50, left: 100, right: 100 }}
          />
        </div>

        {/* Gráfico de Barras - Notícias por Categoria */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            📚 Notícias por Categoria
          </h2>
          <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
            <VictoryAxis
              style={{
                tickLabels: { fontSize: 10, angle: -45, textAnchor: 'end' }
              }}
            />
            <VictoryAxis dependentAxis />
            <VictoryBar
              data={dadosCategorias}
              style={{ data: { fill: "#3b82f6" } }}
            />
          </VictoryChart>
        </div>
      </div>

      {/* Gráfico de Linha - Interações nos últimos 7 dias */}
      {dadosInteracoesPorDia.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            📈 Interações nos Últimos 7 Dias
          </h2>
          <VictoryChart
            theme={VictoryTheme.material}
            height={300}
            padding={{ top: 40, bottom: 60, left: 60, right: 40 }}
            domain={{ y: [0, maxInteracoes + 5] }}
          >
            <VictoryAxis
              style={{
                tickLabels: { fontSize: 12, angle: 0 }
              }}
            />
            <VictoryAxis
              dependentAxis
              style={{
                tickLabels: { fontSize: 12 }
              }}
            />
            <VictoryLine
              data={dadosInteracoesPorDia}
              style={{
                data: { 
                  stroke: "#3b82f6",
                  strokeWidth: 3
                }
              }}
              interpolation="monotoneX"
            />
          </VictoryChart>
        </div>
      )}

      {/* Notícias Recentes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          🆕 Notícias Recentes
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Autor</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {stats.noticiasRecentes.map(noticia => (
                <tr key={noticia.id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-3 font-medium">{noticia.titulo}</td>
                  <td className="px-4 py-3">{noticia.cliente.nome}</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {noticia.categoria.nome}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {noticia.status === "aprovada" && <span className="text-green-600">✅ Aprovada</span>}
                    {noticia.status === "pendente" && <span className="text-yellow-600">🕐 Pendente</span>}
                    {noticia.status === "rejeitada" && <span className="text-red-600">❌ Rejeitada</span>}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(noticia.dataPublicacao).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}