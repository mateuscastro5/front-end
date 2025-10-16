import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.tsx'
import Login from './Login.tsx'
import Detalhes from './Detalhes.tsx'
import MinhasNoticias from './MinhasNoticias.tsx'
import MinhasPropostas from './MinhasPropostas.tsx'
import PainelAdmin from './PainelAdmin.tsx'
import AreaCliente from './AreaCliente.tsx'
import Dashboard from './Dashboard.tsx'

import Layout from './Layout.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Cadastro from './Cadastro.tsx'

const rotas = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: 'login', element: <Login /> },
      { path: 'cadastro', element: <Cadastro /> },
      { path: 'noticia/:id', element: <Detalhes /> },
      { path: 'minhas-noticias', element: <MinhasNoticias /> },
      { path: 'minhas-propostas', element: <MinhasPropostas /> },
      { path: 'area-cliente', element: <AreaCliente /> },
      { path: 'admin', element: <PainelAdmin /> },
      { path: 'dashboard', element: <Dashboard /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>,
)