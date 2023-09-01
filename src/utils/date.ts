import format from "date-fns/format";
import { zeroPad } from "./number";

export const addDays = (date: Date, days: number) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getHours = (xInterval: number, yInterval: number) => {
  let hours: string[] = [];
  for (let i = xInterval; i < yInterval; i++) {
    let hour = zeroPad(i);
    hours.push(`${hour}:00:00`, `${hour}:30:00`);
  }
  return hours;
};

export const getUTCString = (date: Date | null) => {
  if (!date) return null;
  return format(date, "yyyy-MM-dd");
};
