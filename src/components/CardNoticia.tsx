// components/CardNoticia.tsx
import type { NoticiaType } from "../utils/NoticiaType"
import { Link } from "react-router-dom"

interface CardNoticiaProps {
  data: NoticiaType
}

export function CardNoticia({ data }: CardNoticiaProps) {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <Link to={`/noticia/${data.id}`}>
        <img className="rounded-t-lg h-48 w-full object-cover" src={data.imagemUrl} alt={data.titulo} />
      </Link>
      <div className="p-5">
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
          {data.categoria?.nome}
        </span>
        <Link to={`/noticia/${data.id}`}>
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white hover:text-blue-600">
            {data.titulo}
          </h5>
        </Link>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-3">
          {data.resumo}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Por {data.autor}</span>
          <span>{new Date(data.dataPublicacao).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
          <span>👁️ {data.visualizacoes}</span>
          <span>❤️ {data.curtidas}</span>
        </div>
        <Link 
          to={`/noticia/${data.id}`}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-3"
        >
          Ler mais
          <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
          </svg>
        </Link>
      </div>
    </div>
  )
}