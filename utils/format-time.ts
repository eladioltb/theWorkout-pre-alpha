import dayjs from "dayjs";

export const format = (timer: number): string => {
  let value = '00'
  value = timer.toString();
  if (timer < 10) {
    value = `0${timer.toString()}`;
  }

  if(value === '0-1') {
    value = '00';
  }

  
  return value;
}

export const numberToTimer = (number: number): string => {
  const date = new Date(number);
  const locale = date.toLocaleTimeString();
  const sliced = locale.split(":");
  return `0000-00-00T00:${sliced[1]}:${sliced[2]}`
}

export const numberToString = (number: number): string => {
  
  const date = new Date(number);
  const locale = date.toLocaleTimeString();
  
  const sliced = locale.split(":");
  const hours = format(parseInt(sliced[0]) - 1);
  const minutes = sliced[1];
  const seconds = sliced[2];

  return `${hours}:${minutes}:${seconds}`
}

export const timerToNumber = (timer: string): number => {
  return dayjs(`0000-00-00T00:${timer}`).toDate().getTime()
}

export const basicTimerNumber: number = dayjs(`0000-00-00T00:00:30`).toDate().getTime();