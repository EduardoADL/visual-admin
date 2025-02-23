export const maskCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };
  
  // Remove formatação e converte para número
 export const unmaskCurrency = (value: string): number => {
    const numericString = value.replace(/\D/g, ""); // Remove tudo que não for número
    return numericString ? Number(numericString) / 100 : 0; // Divide por 100 para valores decimais
  };
  
  