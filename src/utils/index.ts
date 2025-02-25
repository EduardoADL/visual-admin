export const maskCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };
  
  // Remove formatação e converte para número
 export const unmaskCurrency = (value: string): number => {
    const numericString = value.replace(/\D/g, ""); // Remove tudo que não for número
    return numericString ? Number(numericString) / 100 : 0; // Divide por 100 para valores decimais
  };
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const removeRequiredProperty = <T extends Record<string, any>, K extends keyof T>(obj: T, key: K): T => {
    if (key in obj && obj[key] !== undefined) {
        delete obj[key];
    }
    return obj;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasEmptyOrZero(obj: { [key: string]: any }): boolean {
  return Object.values(obj).some((value) => {
    // Verifica strings vazias
    if (typeof value === 'string' && value.trim() === '') return true;
    
    // Verifica números zero
    if (typeof value === 'number' && value === 0) return true;
    
    // Outros tipos são ignorados
    return false;
  });
}

  