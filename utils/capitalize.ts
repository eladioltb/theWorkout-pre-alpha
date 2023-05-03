export const format = ( value: string ) => {
  const capitalizeFirst = ( str: string ) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return capitalizeFirst(value);
}