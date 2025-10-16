import { Outlet, useLocation } from "react-router-dom"
import { Toaster } from "sonner"
import Titulo from "./components/Titulo"
import { ClienteProvider } from "./context/ClienteContext"

function Breadcrumb() {
  const location = useLocation()
  
  const getBreadcrumbText = (pathname: string) => {
    switch (pathname) {
      case '/': return '🏠 Início'
      case '/login': return '🔐 Login'
      case '/cadastro': return '📝 Cadastro'
      case '/area-cliente': return '👤 Área do Cliente'
      case '/minhas-noticias': return '✏️ Minhas Notícias'
      case '/admin': return '🛡️ Painel Admin'
      default:
        if (pathname.startsWith('/noticia/')) return '📰 Detalhes da Notícia'
        return '📄 Página'
    }
  }

  if (location.pathname === '/') return null

  return (
    <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <nav className="text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {getBreadcrumbText(location.pathname)}
          </span>
        </nav>
      </div>
    </div>
  )
}

export default function Layout() {
  return (
    <ClienteProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Titulo />
        <Breadcrumb />
        <main className="pb-8">
          <Outlet />
        </main>
        <Toaster 
          position="top-right" 
          richColors 
          toastOptions={{
            duration: 4000,
            style: {
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '1rem',
            }
          }}
        />
      </div>
    </ClienteProvider>
  )
}
