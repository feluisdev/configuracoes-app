import { useEffect, useState } from 'react';

/**
 * Hook para aplicar debounce a um valor
 * @param value O valor a ser debounced
 * @param delay O tempo de espera em milissegundos
 * @returns Um array com o valor debounced
 */
export function useDebounce<T>(value: T, delay: number): [T] {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configurar o timer para atualizar o valor debounced após o delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpar o timer se o valor ou delay mudar
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return [debouncedValue];
}