import { compareAsc, intervalToDuration } from "date-fns";
import { format, utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";

let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

function getTimezonedDate(datetime: string) {
  const dateTz = utcToZonedTime(datetime, timezone);
  return format(dateTz, "dd.MM.yyyy", { timeZone: timezone });
}

function getTimezonedTime(datetime: string) {
  const dateTz = utcToZonedTime(datetime, timezone);
  return format(dateTz, "HH:mm", { timeZone: timezone });
}

function formatToTimezonedISOString(date: Date, time?: string) {
  let timezonedDate = utcToZonedTime(date, timezone);
  let formattedDate = format(timezonedDate, "yyyy-MM-dd HH:mm:ss", {
    timeZone: timezone,
  });
  if (time !== undefined) {
    return formattedDate.slice(0, 10) + "T" + time;
  } else {
    return formattedDate.slice(0, 10) + "T" + formattedDate.slice(11);
  }
}

function mergeISODateAndISOTime(date: string, time: string) {
  let datePart = date.substring(0, 10);
  let timePart = time.substring(10);
  return datePart + timePart;
}

function datetimeToUtcISOString(datetime: string) {
  const utcDatetime = zonedTimeToUtc(datetime, timezone);
  return utcDatetime.toISOString();
}

function getDistanceInterval(firstDate: string, lastDate: string) {
  let first = new Date(firstDate);
  let last = new Date(lastDate);
  return intervalToDuration({ start: first, end: last });
  // => { years: y, months: M, days: d, hours: H, minutes: m, seconds: s }
}

function getDistanceInMinutes(firstDate: string, lastDate: string) {
  let interval = getDistanceInterval(firstDate, lastDate);
  let distance = interval.minutes || 0;
  if (interval.hours) {
    distance = distance + interval.hours * 60;
  }
  return distance;
}

function getTimeSlotString(firstDate: string, lastDate: string) {
  let startTime = getTimezonedTime(firstDate);
  let endTime = getTimezonedTime(lastDate);
  return startTime + " - " + endTime;
}

function getMonthName(datetime: string) {
  const date = utcToZonedTime(datetime, timezone);
  return format(date, "MMM", { timeZone: timezone });
}

function getDayValue(datetime: string) {
  const date = utcToZonedTime(datetime, timezone);
  return format(date, "d", { timeZone: timezone });
}

function getYearValue(datetime: string) {
  const date = utcToZonedTime(datetime, timezone);
  return format(date, "y", { timeZone: timezone });
}

function compareDatesAscending(firstDate: string, lastDate?: string) {
  let result: number;
  if (lastDate) {
    result = compareAsc(new Date(firstDate), new Date(lastDate));
  } else {
    result = compareAsc(new Date(firstDate), new Date());
  }

  if (result === 1) {
    return true;
  }
  if (result === 0) {
    return true;
  }
  if (result === -1) {
    return false;
  }
}

export {
  getTimezonedDate,
  getTimezonedTime,
  formatToTimezonedISOString,
  mergeISODateAndISOTime,
  datetimeToUtcISOString,
  getDistanceInterval,
  getDistanceInMinutes,
  getTimeSlotString,
  getMonthName,
  getDayValue,
  getYearValue,
  compareDatesAscending,
};
