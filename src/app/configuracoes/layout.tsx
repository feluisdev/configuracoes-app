// TODO: Implementar lógica de verificação de perfil de Administrador
// Se não for admin, redirecionar ou mostrar página de acesso negado.
// Este layout aplicará a verificação a todas as rotas dentro de /configuracoes

import React from 'react';

// Exemplo de hook de autenticação (a ser definido em lib/auth.ts)
// import { useAuth } from '@/lib/auth';
// import { useRouter } from 'next/navigation';

export default function ConfiguracoesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { user, isAdmin, isLoading } = useAuth(); // Supondo que useAuth retorne esses valores
  // const router = useRouter();

  // if (isLoading) {
  //   return <div>Verificando permissões...</div>; // Ou um spinner global
  // }

  // if (!isAdmin) {
  //   // Idealmente redirecionar para uma página de "Acesso Negado" ou login
  //   // router.push('/acesso-negado');
  //   return (
  //     <div>
  //       <h1>Acesso Negado</h1>
  //       <p>Você não tem permissão para acessar esta área.</p>
  //     </div>
  //   );
  // }

  return <>{children}</>;
}
