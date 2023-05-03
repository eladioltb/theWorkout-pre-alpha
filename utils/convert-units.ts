
export const convert = (value: number, unit: string) => {

  switch(unit) {
  case 'kg':
    return value / 2.205;
  case 'lbs':
    return value * 2.205;
  case 'in':
    return value / 30.48;
  case 'cm':
    return value * 30.48;
  default:
    return value;
  }

};
