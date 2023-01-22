import axios from "axios";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { API_URL, REQUEST_CONFIG } from "../constants";

import { firebaseDB } from "./firebaseConfig";

// Expected data format
// {
//   bookClubId : String
//   location : String
//   title : String
//   created : Date ( current Date)
// }

async function createDiscussionDocument(bookClubId: string, data: any) {
  let params =  new URLSearchParams({"bookClubId" : bookClubId})
  let url = API_URL+"bookClub/discussion?" + params
  axios.post(url, data, REQUEST_CONFIG)
    .catch(error => {
        console.log(error);
    });
}

async function updateDiscussionDocument(
  bookClubId: string,
  discussionId: string,
  data: any
) {
  let params =  new URLSearchParams({"bookClubId" : bookClubId, "discussionId":discussionId})
  let url = API_URL+"bookClub/discussion?" + params
  axios.patch(url, data, REQUEST_CONFIG)
    .catch(error => {
        console.log(error);
    });
}

async function getDiscussionDocument(bookClubId: string, discussionId: string) {
  let params =  new URLSearchParams({"bookClubId" : bookClubId, "discussionId":discussionId})
  let url = API_URL+"bookClub/discussion?" + params
  const res = await axios.get(url, REQUEST_CONFIG)
    .then(response => response.data)
    .then(data => data.result)
    .catch(error => {
        console.log(error);
    });

  if (res) {
    return {
      id: res.id,
      title: res.title,
      date: res.date,
      startTime: res.startTime,
      endTime: res.endTime,
      location: res.location,
      participants: res.participants,
      agenda: res.agenda,
      moderator: res.moderator,
      isArchived: res.isArchived
    };
  }
}
// Needs to delete the discussion document and its subcollection of comments if available
async function deleteDiscussionDocument(
  bookClubId: string,
  discussionId: string
) {
  let params =  new URLSearchParams({"bookClubId" : bookClubId, "discussionId":discussionId})
  let url = API_URL+"bookClub/discussion?" + params
  axios.delete(url, REQUEST_CONFIG)
    .catch(error => {
        console.log(error);
    });
}

async function addDiscussionParticipant(
  bookClubId: string,
  discussionId: string,
  participantId: string
) {
  let params =  new URLSearchParams({"bookClubId" : bookClubId, "discussionId":discussionId, "participantId":participantId})
  let url = API_URL+"bookClub/discussion/addParticipant?" + params
  axios.post(url, REQUEST_CONFIG)
    .catch(error => {
        console.log(error);
    });
}
async function removeDiscussionParticipant(
  bookClubId: string,
  discussionId: string,
  participantId: string
) {
  let params =  new URLSearchParams({"bookClubId" : bookClubId, "discussionId":discussionId, "participantId":participantId})
  let url = API_URL+"bookClub/discussion/removeParticipant?" + params
  axios.post(url, REQUEST_CONFIG)
    .catch(error => {
        console.log(error);
    });
}

async function addDiscussionAgenda(
  bookClubId: string,
  discussionId: string,
  data: any
) {
  let params =  new URLSearchParams({"bookClubId" : bookClubId, "discussionId":discussionId})
  let url = API_URL+"bookClub/discussion/agenda?" + params
  axios.post(url,data, REQUEST_CONFIG)
    .catch(error => {
        console.log(error);
    });
}

async function getDiscussionAgenda(bookClubId: string, discussionId: string) {
  let params =  new URLSearchParams({"bookClubId" : bookClubId, "discussionId":discussionId})
  let url = API_URL+"bookClub/discussion?" + params
  let res = await axios.post(url, REQUEST_CONFIG)
    .then(response => response.data)
    .then(data => data.result)
    .catch(error => {
        console.log(error);
    });

  if (res) {
    return res.agenda;
  }
}

async function getDiscussionMaxParticipants(bookClubId: string, discussionId: string) {
  const discussionDocument = doc(
    firebaseDB,
    "bookClubs",
    bookClubId,
    "discussions",
    discussionId
  );

  let discussionDocResult = await getDoc(discussionDocument);
  let discussionData = discussionDocResult.data();

  if (discussionData) {
    return discussionData.maxParticipants;
  }
}

async function getDiscussionTitle(bookClubId: string, discussionId: string) {
  const discussionDocument = doc(
    firebaseDB,
    "bookClubs",
    bookClubId,
    "discussions",
    discussionId
  );

  let discussionDocResult = await getDoc(discussionDocument);
  let discussionData = discussionDocResult.data();

  if (discussionData) {
    return discussionData.title;
  }
}

async function updateDiscussionAgenda(
  bookClubId: string,
  discussionId: string,
  amountOfChapter: number,
  elapsedTimes: any,
  names: any,
  timeLimits: any,
  maxParticipants: number,
  saveArchive: boolean
) {
  const discussionDocument = doc(
    firebaseDB,
    "bookClubs",
    bookClubId,
    "discussions",
    discussionId
  );
  updateDoc(discussionDocument, {agenda:{}})
  for(let i = 0; i < amountOfChapter; i++){
    updateDoc(discussionDocument, {agenda:arrayUnion({elapsedTime: elapsedTimes[i], name: names[i], timeLimit: timeLimits[i]})})
    
  }
  if(saveArchive == true){
    updateDoc(discussionDocument, {isArchived: true})
  }
  updateDoc(discussionDocument, {maxParticipants: maxParticipants})
}

async function deleteDiscussionAgenda(
  bookClubId: string,
  discussionId: string
) {
  let params =  new URLSearchParams({"bookClubId" : bookClubId, "discussionId":discussionId})
  let url = API_URL+"bookClub/discussion?" + params
  axios.delete(url, REQUEST_CONFIG)
    .catch(error => {
        console.log(error);
    });
}

async function updateElapsedTimesOfDiscussion(bookClubId: string, discussionId: string, data: any) {
  console.log(data);
  const bookClubDocument = doc(firebaseDB, "bookClubs", String(bookClubId), "discussions", String(discussionId));
  updateDoc(bookClubDocument, data);
}
  


export {
  createDiscussionDocument,
  updateDiscussionDocument,
  deleteDiscussionDocument,
  getDiscussionDocument,
  addDiscussionParticipant,
  removeDiscussionParticipant,
  addDiscussionAgenda,
  getDiscussionAgenda,
  getDiscussionMaxParticipants,
  updateDiscussionAgenda,
  getDiscussionTitle,
  deleteDiscussionAgenda,
  updateElapsedTimesOfDiscussion
};
