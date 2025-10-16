export interface NoticiaType {
    id: number
    titulo: string
    resumo: string
    conteudo: string
    imagemUrl: string
    dataPublicacao: string
    autor: string
    visualizacoes: number
    curtidas: number
    categoria_id: number
    categoria?: {
      id: number
      nome: string
    }
  }