export interface PropostaType {
  id: number;
  titulo: string;
  descricao: string;
  status: string;
  data: string;
  carro: {
    id: number;
    modelo: string;
    marca: {
      id: number;
      nome: string;
    };
    ano: number;
    preco: number;
    foto: string;
  };
  resposta?: string;
  createdAt: string;
  updatedAt: string;
}