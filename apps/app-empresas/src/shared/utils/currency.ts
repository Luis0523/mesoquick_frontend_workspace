/**
 * Utilidades para manejo de moneda
 * El backend usa centavos (enteros), el frontend usa quetzales (decimales)
 */

/**
 * Convierte centavos a quetzales
 * 15000 centavos = 150.00 quetzales
 */
export const fromCents = (cents: number): number => {
  return cents / 100;
};

/**
 * Convierte quetzales a centavos
 * 150.00 quetzales = 15000 centavos
 */
export const toCents = (quetzales: number): number => {
  return Math.round(quetzales * 100);
};

/**
 * Formatea un precio en centavos a string con formato de moneda
 * 15000 → "Q150.00"
 */
export const formatPrice = (cents: number): string => {
  const quetzales = fromCents(cents);
  return `Q${quetzales.toFixed(2)}`;
};

/**
 * Formatea un precio en quetzales a string con formato de moneda
 * 150.50 → "Q150.50"
 */
export const formatQuetzales = (quetzales: number): string => {
  return `Q${quetzales.toFixed(2)}`;
};

/**
 * Parsea un string de precio a centavos
 * "Q150.00" → 15000
 * "150" → 15000
 */
export const parsePrice = (priceString: string): number => {
  // Remover símbolo de quetzales y espacios
  const cleaned = priceString.replace(/[Q\s]/g, '');
  const quetzales = parseFloat(cleaned);
  
  if (isNaN(quetzales)) {
    throw new Error(`Precio inválido: ${priceString}`);
  }
  
  return toCents(quetzales);
};
