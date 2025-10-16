import { createContext, useContext, useState, type ReactNode } from "react"

type ClienteType = {
  id: string
  nome: string
  email: string
  telefone: string
  cidade: string
  admin: boolean
}

type ClienteContextType = {
  cliente: ClienteType
  logaCliente: (cliente: ClienteType) => void
  deslogaCliente: () => void
}

const ClienteContext = createContext({} as ClienteContextType)

export function ClienteProvider({ children }: { children: ReactNode }) {
  const [cliente, setCliente] = useState<ClienteType>({} as ClienteType)

  function logaCliente(dadosCliente: ClienteType) {
    setCliente(dadosCliente)
  }

  function deslogaCliente() {
    setCliente({} as ClienteType)
  }

  return (
    <ClienteContext.Provider value={{ cliente, logaCliente, deslogaCliente }}>
      {children}
    </ClienteContext.Provider>
  )
}

export const useClienteStore = () => useContext(ClienteContext)