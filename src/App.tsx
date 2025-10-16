import { CardNoticia } from "./components/CardNoticia";
import { InputPesquisa } from "./components/InputPesquisa";
import type { NoticiaType } from "./utils/NoticiaType";
import { useEffect, useState } from "react";
import { useClienteStore } from "./context/ClienteContext"

const apiUrl = import.meta.env.VITE_API_URL

export default function App() {
  const [noticias, setNoticias] = useState<NoticiaType[]>([])
  const { logaCliente } = useClienteStore()  

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${apiUrl}/noticias`)
      const dados = await response.json()
      setNoticias(dados)
    }
    buscaDados()

    async function buscaCliente(id: string) {
      const response = await fetch(`${apiUrl}/clientes/${id}`)
      const dados = await response.json()
      logaCliente(dados)
    }
    if (localStorage.getItem("clienteKey")) {
      const idCliente = localStorage.getItem("clienteKey")
      buscaCliente(idCliente as string)
    }    
  }, [])

  const listaNoticias = noticias.map( noticia => (
    <CardNoticia data={noticia} key={noticia.id} />
  ))

  return (
    <>
      <InputPesquisa setNoticias={setNoticias} />
      <div className="max-w-7xl mx-auto">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Notícias <span className="underline underline-offset-3 decoration-8 decoration-blue-400 dark:decoration-blue-600">em destaque</span>
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {listaNoticias}
        </div>
      </div>
    </>
  );
}
