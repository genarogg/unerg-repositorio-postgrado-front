/* devuelve un numero aleatorio | el primer valor que recibe es el numero minimo que puede devolver y el segundo sera el maximo valor que podra regresar */
const random = (iniciaEn: number, terminaEn: number): number => {
  return Math.floor(Math.random() * (terminaEn - iniciaEn + 1) + iniciaEn);
};

/* organizar un arreglo numerico de menor a mayor */
const sortNumbers = (numbers: number[]): number[] => {
  return numbers.sort((a, b) => {
    return a - b;
  });
};

/* Genera un id unico */
const generateUUID = () => {
  let uuid = "xxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
  return uuid;
};

export { random, sortNumbers, generateUUID };
