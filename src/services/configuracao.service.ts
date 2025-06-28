import { CategoriaServico, CreateCategoriasServicosCommand, UpdateCategoriasServicosCommand, WrapperListaCategoriaServicoDTO } from '@/models/configuracoes.models';
// import { TipoServico, CreateTiposServicosCommand, UpdateTiposServicosCommand, WrapperListaTipoServicoDTO } from '@/models/configuracoes.models';
// import { StatusPedido, CreateStatusPedidoCommand, UpdateStatusPedidoCommand, WrapperListaStatusPedidoDTO } from '@/models/configuracoes.models';

// TODO: Configurar um cliente HTTP centralizado (ex: axiosInstance em api-client.ts)
// que inclua o baseURL, headers (como Authorization para JWT), e tratamento de erros.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'; // Usar /api para proxy do Next.js ou URL direta

// === CATEGORIAS DE SERVIÇOS ===

/**
 * Busca a lista paginada de categorias de serviços.
 * O backend espera query params: nome, codigo, pagina, tamanho.
 */
export async function getCategoriasServicos(
  nome?: string,
  codigo?: string,
  pagina: number = 0,
  tamanho: number = 20
): Promise<WrapperListaCategoriaServicoDTO> { // Ajustado para retornar o Wrapper
  const queryParams = new URLSearchParams();
  if (nome) queryParams.append('nome', nome);
  if (codigo) queryParams.append('codigo', codigo);
  queryParams.append('pagina', pagina.toString());
  queryParams.append('tamanho', tamanho.toString());

  const response = await fetch(`${API_BASE_URL}/configuracoes/v1/categoriaservico?${queryParams.toString()}`);
  if (!response.ok) {
    // TODO: Melhorar tratamento de erro, talvez lendo corpo do erro
    throw new Error('Falha ao buscar categorias de serviços');
  }
  return response.json();
}

/**
 * Busca uma categoria de serviço pelo seu ID.
 * O backend espera o ID como path variable (String).
 */
export async function getCategoriaServicoById(categoriaServicoId: string): Promise<CategoriaServico> { // Retorna CategoriaServicosResponseDTO do backend
  const response = await fetch(`${API_BASE_URL}/configuracoes/v1/categoriaservico/${categoriaServicoId}`);
  if (!response.ok) {
    throw new Error(`Falha ao buscar categoria de serviço com ID ${categoriaServicoId}`);
  }
  // O backend retorna CategoriasServicosResponseDTO que tem 'id' (Integer) e 'ativo' (boolean)
  // A interface CategoriaServico no frontend precisa ser compatível.
  // A interface já tem id (number) e ativo (boolean) opcionais, e categoriaId (string)
  const dto: any = await response.json();
  return { // Mapeamento para a interface do frontend
      ...dto,
      categoriaId: dto.id?.toString(), // ou o campo que for o UUID string
      estado: dto.ativo ? "ATIVO" : "INATIVO",
  } as CategoriaServico;
}

/**
 * Cria uma nova categoria de serviço.
 * Backend espera CriarCategoriasServicosDTO no corpo.
 */
export async function createCategoriaServico(data: CreateCategoriasServicosCommand): Promise<any> { // Backend retorna Map<String, ?>
  const response = await fetch(`${API_BASE_URL}/configuracoes/v1/categoriaservico`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // TODO: Adicionar Authorization header se necessário
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) { // Status 201 é OK para POST
    const errorBody = await response.json().catch(() => ({ message: 'Erro desconhecido ao criar categoria.' }));
    throw new Error(errorBody.message || `Falha ao criar categoria de serviço. Status: ${response.status}`);
  }
  return response.json(); // Retorna Map<String, ?> ou void dependendo do backend
}

/**
 * Atualiza uma categoria de serviço existente.
 * Backend espera CriarCategoriasServicosDTO no corpo e ID na URL.
 * O UpdateCategoriaServicoCommand do backend encapsula CriarCategoriasServicosDTO e categoriaServicoId.
 */
export async function updateCategoriaServico(
  categoriaServicoId: string,
  commandData: UpdateCategoriasServicosCommand // CommandData aqui deve ser o que o controller espera no corpo, que é CriarCategoriasServicosDTO
): Promise<CategoriaServico> { // Backend retorna CategoriasServicosResponseDTO
  const response = await fetch(`${API_BASE_URL}/configuracoes/v1/categoriaservico/${categoriaServicoId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    // O controller espera CriarCategoriasServicosDTO no corpo.
    // A UpdateCategoriasServicosCommand no frontend já tem a estrutura correta com `criarcategoriasservicos`.
    body: JSON.stringify(commandData.criarcategoriasservicos),
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Erro desconhecido ao atualizar categoria.' }));
    throw new Error(errorBody.message || `Falha ao atualizar categoria de serviço. Status: ${response.status}`);
  }
  const dto: any = await response.json();
   return { // Mapeamento para a interface do frontend
      ...dto,
      categoriaId: dto.id?.toString(),
      estado: dto.ativo ? "ATIVO" : "INATIVO",
  } as CategoriaServico;
}

/**
 * Inativa (ou "deleta logicamente") uma categoria de serviço.
 * O backend usa DELETE para esta operação.
 */
export async function inativarCategoriaServico(categoriaServicoId: string): Promise<any> { // Backend retorna Map<String, ?>
  const response = await fetch(`${API_BASE_URL}/configuracoes/v1/categoriaservico/${categoriaServicoId}`, {
    method: 'DELETE',
    headers: {
      // Authorization header se necessário
    },
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Erro desconhecido ao inativar categoria.' }));
    throw new Error(errorBody.message || `Falha ao inativar categoria de serviço. Status: ${response.status}`);
  }
  return response.json(); // Ou void
}


// === TIPOS DE SERVIÇOS (CUF15) - Placeholders ===
// === TIPOS DE SERVIÇOS (CUF15) ===

export async function getTiposServicos(
  nome?: string,
  codigo?: string,
  categoriaId?: string,
  pagina: number = 0,
  tamanho: number = 20
): Promise<WrapperListaTipoServicoDTO> {
  const queryParams = new URLSearchParams();
  if (nome) queryParams.append('nome', nome);
  if (codigo) queryParams.append('codigo', codigo);
  if (categoriaId) queryParams.append('categoriaId', categoriaId);
  queryParams.append('pagina', pagina.toString());
  queryParams.append('tamanho', tamanho.toString());

  const response = await fetch(`${API_BASE_URL}/configuracoes/v1/tiposervico?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error('Falha ao buscar tipos de serviços');
  }
  return response.json();
}

export async function getTipoServicoById(tipoServicoId: string): Promise<TipoServico> {
  const response = await fetch(`${API_BASE_URL}/configuracoes/v1/tiposervico/${tipoServicoId}`);
  if (!response.ok) {
    throw new Error(`Falha ao buscar tipo de serviço com ID ${tipoServicoId}`);
  }
  const dto: any = await response.json();
  // Mapear para a interface TipoServico do frontend, especialmente o campo 'categoria' e 'estado'
  return {
    ...dto,
    tipoServicoId: dto.id?.toString(), // Assumindo que o ID principal para URLs é o 'id' convertido para string
    idCategoria: dto.categoriaId, // O backend TiposServicosResponseDTO já tem categoriaId (String)
                                  // ListaTipoServicoDTO tem 'categoria' (String nome).
                                  // Precisamos garantir que o formulário use 'categoriaId' (String).
    estado: dto.ativo ? "ATIVO" : "INATIVO",
    // O backend TiposServicosResponseDTO não tem o nome da categoria, apenas o ID.
    // Se precisarmos do nome da categoria no formulário de edição (ex: para exibir),
    // teremos que buscar as categorias separadamente ou o backend teria que incluir o nome.
    // ListaTipoServicoDTO tem `categoria` (nome), então para a tabela está ok.
  } as TipoServico;
}

export async function createTipoServico(data: CreateTiposServicosCommand): Promise<any> { // Backend retorna Map<String, ?>
  const response = await fetch(`${API_BASE_URL}/configuracoes/v1/tiposervico`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) { // 201 é OK
    const errorBody = await response.json().catch(() => ({ message: 'Erro desconhecido ao criar tipo de serviço.' }));
    throw new Error(errorBody.message || `Falha ao criar tipo de serviço. Status: ${response.status}`);
  }
  return response.json();
}

export async function updateTipoServico(
  tipoServicoId: string,
  commandData: UpdateTiposServicosCommand
): Promise<TipoServico> { // Backend retorna TiposServicosResponseDTO
  const response = await fetch(`${API_BASE_URL}/configuracoes/v1/tiposervico/${tipoServicoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commandData.criartiposservicos), // Controller espera CriarTiposServicosDTO
  });
  if (!response.ok) { // Backend retorna 201 para PUT neste controller
    const errorBody = await response.json().catch(() => ({ message: 'Erro desconhecido ao atualizar tipo de serviço.' }));
    throw new Error(errorBody.message || `Falha ao atualizar tipo de serviço. Status: ${response.status}`);
  }
  const dto: any = await response.json();
   return {
    ...dto,
    tipoServicoId: dto.id?.toString(),
    idCategoria: dto.categoriaId,
    estado: dto.ativo ? "ATIVO" : "INATIVO",
  } as TipoServico;
}

export async function inativarTipoServico(tipoServicoId: string): Promise<any> { // Backend retorna Map<String, ?>
  const response = await fetch(`${API_BASE_URL}/configuracoes/v1/tiposervico/${tipoServicoId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Erro desconhecido ao inativar tipo de serviço.' }));
    throw new Error(errorBody.message || `Falha ao inativar tipo de serviço. Status: ${response.status}`);
  }
  return response.json();
}


// === STATUS DE PEDIDOS (CUF16) - Placeholders ===
// export async function getStatusPedidos(params): Promise<WrapperListaStatusPedidoDTO> {}
// export async function getStatusPedidoById(id: string): Promise<StatusPedido> {}
// export async function createStatusPedido(data: CreateStatusPedidoCommand): Promise<StatusPedido> {}
// export async function updateStatusPedido(id: string, data: UpdateStatusPedidoCommand): Promise<StatusPedido> {}
// export async function deleteStatusPedido(id: string): Promise<void> {} // Ou inativar
