import { Discussion } from "../firebase/firebaseBookClub";
import {compareDatesAscending, formatToTimezonedISOString, getYearValue} from "./datetimeFormatter";

function sortDiscussionsByDate(discussions: Discussion[]) {
  return discussions.sort((a, b) => {
    return a.startTime < b.startTime ? -1 : a.startTime > b.startTime ? 1 : 0;
  });
}

function getUpcomingDiscussions(discussions: Discussion[]) {
  return discussions.filter((discussion) =>
    compareDatesAscending(discussion.endTime) && discussion.isArchived != true 
  );
}

function getPastDiscussions(discussions: Discussion[]) {
  return discussions.filter(
    (discussion) => !compareDatesAscending(discussion.endTime) || discussion.isArchived == true 
  );
}

function getArchivedDiscussion(discussions: Discussion[]){
  return discussions.filter(
    (discussion) => discussion.isArchived == true
  )
}

function getDiscussionsByYear(year: string, discussions: Discussion[]) {
  discussions = sortDiscussionsByDate(discussions);
  return discussions.filter(
    (discussion) => getYearValue(discussion.date) === year
  );
}

function getYearArrayOfDiscussions(discussions: Discussion[]) {
  let yearsSet = new Set<string>();
  discussions.forEach((discussion) => {
    let year = getYearValue(discussion.date);
    yearsSet.add(year);
  });
  let years: string[] = [];
  yearsSet.forEach((year) => {
    years.push(year);
  });
  years.sort();
  return years;
}

function getNextDiscussionsUntilWeeks(discussions: Discussion[], weeks: number) {
  let upcomingDiscussions = getUpcomingDiscussions(discussions);
  let endDate = new Date();
  endDate.setDate(endDate.getDate() + (weeks * 7));
  return upcomingDiscussions.filter((discussion) => compareDatesAscending(formatToTimezonedISOString(endDate), discussion.startTime));
}

export {
  sortDiscussionsByDate,
  getUpcomingDiscussions,
  getPastDiscussions,
  getDiscussionsByYear,
  getYearArrayOfDiscussions,
    getNextDiscussionsUntilWeeks,
};
