import format from "date-fns/format";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

export const addDays = (date: Date, days: number) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getHours = (
  startsAt: string,
  endsAt: string,
  interval: number
) => {
  dayjs.extend(utc);
  let hours: string[] = [];

  const startDate = dayjs.utc(startsAt, "HH:mm:ss");
  const endDate = dayjs.utc(endsAt, "HH:mm:ss");

  if (startDate === endDate || startDate > endDate) {
    return hours;
  }

  let currentDate = startDate;
  while (currentDate < endDate) {
    hours.push(currentDate.format("HH:mm"));
    currentDate = currentDate.add(interval, "minutes");
  }

  return hours;
};

export const getUTCString = (date: Date | null) => {
  if (!date) return null;
  return format(date, "yyyy-MM-dd");
};
