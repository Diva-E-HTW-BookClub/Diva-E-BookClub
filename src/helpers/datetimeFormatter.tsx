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

export {
  getTimezonedDate,
  getTimezonedTime,
  formatToTimezonedISOString,
  mergeISODateAndISOTime,
  datetimeToUtcISOString,
};
