export const wait = (msTime: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, msTime);
  });
};

export const padNumber = (num: number): string => {
  return num > 9 ? `${num}` : `0${num}`;
};

export const dateToString = (date: Date = new Date()): string => {
  return `${padNumber(date.getFullYear())}/${padNumber(
    date.getMonth()
  )}/${padNumber(date.getDay())} ${padNumber(date.getHours())}:${padNumber(
    date.getMinutes()
  )}`;
};
