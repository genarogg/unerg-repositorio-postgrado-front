/* Elimina los espacios vacíos de los arreglos */
const cleanArray = (actual: any[]): any[] => {
  let newArray: any[] = [];
  for (let i = 0, j = actual.length; i < j; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
};

export { cleanArray };
