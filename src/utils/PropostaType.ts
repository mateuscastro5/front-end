export interface PropostaType {
  id: number;
  titulo: string;
  descricao: string;
  status: string;
  data: string;
  carro: {
    id: number;
    modelo: string;
    marca: string;
    ano: number;
  };
  resposta?: string;
  createdAt: string;
  updatedAt: string;
}