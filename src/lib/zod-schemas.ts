import { z } from 'zod';

// --- CATEGORIAS DE SERVIÇOS (CUF14) ---
// Schema para o formulário, pode ser usado tanto para criação quanto para edição no frontend.
// Os campos correspondem a CriarCategoriasServicosDTO do backend.
export const CategoriaServicoFormSchema = z.object({
  nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." })
    .max(100, { message: "O nome não pode ter mais de 100 caracteres." }),
  codigo: z.string().min(1, { message: "O código é obrigatório." })
    .max(50, { message: "O código não pode ter mais de 50 caracteres." }),
  descricao: z.string().max(255, { message: "A descrição não pode ter mais de 255 caracteres." }).optional().or(z.literal('')),
  icone: z.string().max(100, { message: "O ícone não pode ter mais de 100 caracteres." }).optional().or(z.literal('')),
  cor: z.string()
    .regex(/^#([0-9A-Fa-f]{3}){1,2}$/, { message: "Formato de cor hexadecimal inválido (ex: #RRGGBB ou #RGB)." })
    .optional().or(z.literal('')),
  ordem: z.number().int().min(0, { message: "A ordem deve ser um número positivo." }).optional(),
  ativo: z.boolean().optional(),
});
export type CategoriaServicoFormValues = z.infer<typeof CategoriaServicoFormSchema>;


// --- TIPOS DE SERVIÇOS (CUF15) ---
// Baseado em CriarTiposServicosDTO e UpdateTipoServicoCommand do backend
export const TipoServicoFormSchema = z.object({
  nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." })
    .max(100, { message: "O nome não pode ter mais de 100 caracteres." }),
  idCategoria: z.string().uuid({ message: "Selecione uma categoria válida." }), // Supondo que o ID da categoria seja UUID
  codigo: z.string().min(1, { message: "O código é obrigatório." })
    .max(50, { message: "O código não pode ter mais de 50 caracteres." }).optional().or(z.literal('')),
  descricao: z.string().max(255, { message: "A descrição não pode ter mais de 255 caracteres." }).optional().or(z.literal('')),
  ativo: z.boolean().optional(),
});
export type TipoServicoFormValues = z.infer<typeof TipoServicoFormSchema>;


// --- STATUS DE PEDIDOS (CUF16) ---
// Baseado em CreateStatusPedidoDTO e UpdateStatusPedidoCommand do backend
export const StatusPedidoFormSchema = z.object({
  nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." })
    .max(100, { message: "O nome não pode ter mais de 100 caracteres." }),
  cor: z.string()
    .regex(/^#([0-9A-Fa-f]{3}){1,2}$/, { message: "Formato de cor hexadecimal inválido." }),
  ordem: z.number().int().min(0, { message: "A ordem deve ser um número positivo." }),
  codigo: z.string().min(1, { message: "O código é obrigatório." })
    .max(50, { message: "O código não pode ter mais de 50 caracteres." }).optional().or(z.literal('')),
  descricao: z.string().max(255, { message: "A descrição não pode ter mais de 255 caracteres." }).optional().or(z.literal('')),
  ativo: z.boolean().optional(),
});
export type StatusPedidoFormValues = z.infer<typeof StatusPedidoFormSchema>;


// --- PERFIL DE USUÁRIO (CUF_USER_PROFILE) ---
export const UpdateUserProfileSchema = z.object({
  nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  telefone: z.string().optional().refine(val => !val || /^\d{9,15}$/.test(val), {
    message: "Número de telefone inválido.",
  }),
  // Outros campos editáveis do perfil
});
export type UpdateUserProfileFormValues = z.infer<typeof UpdateUserProfileSchema>;

export const AlterarSenhaSchema = z.object({
  senhaAtual: z.string().min(1, { message: "A senha atual é obrigatória." }),
  novaSenha: z.string().min(8, { message: "A nova senha deve ter pelo menos 8 caracteres." }),
  confirmacaoNovaSenha: z.string(),
}).refine(data => data.novaSenha === data.confirmacaoNovaSenha, {
  message: "As novas senhas não conferem.",
  path: ["confirmacaoNovaSenha"], // Campo onde o erro será exibido
});
export type AlterarSenhaFormValues = z.infer<typeof AlterarSenhaSchema>;
