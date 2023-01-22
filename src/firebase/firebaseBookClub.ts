import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  limit,
  orderBy,
  getDoc,
  arrayUnion,
  arrayRemove,
  FieldPath,
  startAfter,
} from "firebase/firestore";
import { API_URL, REQUEST_CONFIG } from "../constants";
import axios from 'axios';
import { getCurrentUser } from "./firebaseAuth";
import { deleteDiscussionDocument } from "./firebaseDiscussions";
import { deleteResourceDocument } from "./firebaseResource";
import {getNextDiscussionsUntilWeeks} from "../helpers/discussionSort";

type Comment = {
  id: string,
  text: string;
  passage: string;
  photo: string;
  owner: string;
};
type Book = {
  title: string;
  authors: string[];
  imageUrl: string;
};

type Discussion = {
  id: string;
  title: string;
  participants: string[];
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  agenda: [];
  moderator: string;
  isArchived: boolean;
  bookClubId?: string;
  bookClubName?: string;
};

type Resource = {
  id: string;
  title: string;
  content: string;
  moderator: string;
};

type BookClub = {
  id: string;
  name: string;
  moderator: string[];
  members: string[];
  maxMemberNumber: number;
  book: Book;
  discussions: Discussion[];
  resources: Resource[];
  owner: string;
};

async function createBookClubDocument(data: BookClub) {
  let user_uid 
  await getCurrentUser().then((user: any) => {user_uid = user.uid})
  let url = API_URL+"bookClub"
  const res = await axios.post(url, data, REQUEST_CONFIG)
    .then(response => response.data)
    .then(data => data.result)
    .catch(error => {
      console.log(error);
    });
  return res;
}


async function updateBookClubDocument(bookClubId: string, data: any) {
  let params =  new URLSearchParams({"bookClubId" : bookClubId})
  let url = API_URL+"bookClub?" + params

  axios.patch(url, data, REQUEST_CONFIG)
    .catch(error => {
        console.log(error);
    });

}

//Needs to delete the BookClub, its discussions and all of their comments
async function deleteBookClubDocument(bookClubId: string) {
  let params =  new URLSearchParams({"bookClubId" : bookClubId})
  let url = API_URL+"bookClub?" + params
  axios.delete(url, REQUEST_CONFIG)
    .then(response => {
      console.log(response.headers)
      console.log(response.data);
    })
    .catch(error => {
        console.log(error);
    });
}

async function getBookClubDocument(bookClubId: string) {
  let params =  new URLSearchParams({"bookClubId" : bookClubId})
  let url = API_URL+"bookClub?" + params

  const res = await axios.get(url, REQUEST_CONFIG)
    .then(response => response.data)
    .then(data => data.result)
    .catch(error => {
      console.log(error);
    });

  return {
    id: res.id,
    name: res.name,
    moderator: res.moderator,
    members: res.members,
    maxMemberNumber: res.maxMemberNumber,
    book: res.book,
    discussions: res.discussions,
    resources: res.resources,
    owner: res.owner,
  };    
}

async function getBookClubsByModerator(moderatorId: string){
  let queryConstraints = [where("moderator", "array-contains", moderatorId)];
  let q = query(collection(firebaseDB, "bookClubs"), ...queryConstraints);
  var results = await getDocs(q);
  return results.docs.map(docToBookClub);
}

async function getBookClubsByJoinedMember(memberId: string){
  let queryConstraints = [
      where("members", "array-contains", memberId),
  ];
  let q = query(collection(firebaseDB, "bookClubs"), ...queryConstraints);
  var results = await getDocs(q);
  return (
      results.docs
          .map(docToBookClub)
          // remove clubs where our user is a moderator
          .filter((bookClub) => !bookClub.moderator.includes(memberId))
  );
}

async function getAllDiscussionsOfBookClubsByUser(userId: string){
  let queryConstraints = [where("members", "array-contains", userId)];
  let q = query(collection(firebaseDB, "bookClubs"), ...queryConstraints);
  var results = await getDocs(q);
  let resultsArray = results.docs.map(docToBookClub);
  let nextDiscussionArray: Discussion[] = [];
  for await (const bookClub of resultsArray){
    await getBookClubDocument(bookClub.id).then((fullBookClub) => {
      if(fullBookClub) {
        nextDiscussionArray.push(...getNextDiscussionsUntilWeeks(fullBookClub, 2))
      }
    })
  }
  return nextDiscussionArray;
}

// serch book clubs by their name, book title
// and where members contains and not contains given member id
// (needed to find clubs where user is a member and where not)
async function searchBookClubs(
  filter: string,
  inputText: string,
  memberId: string,
  includeMember: boolean,
  resultsLimit: number,
  lastBookClubId?: string
) {
  let params =  new URLSearchParams({
    "filter" : filter,
    "inputText" : inputText,
    "memberId" : memberId,
    "includeMember" : String(includeMember),
    "resultsLimit" : String(resultsLimit),
  })
  if (lastBookClubId){
    params.append("lastBookClubId", String(lastBookClubId))
  }
  let url = API_URL+"bookClub/search?" + params
  let res = await axios.get(url, REQUEST_CONFIG)
    .then(response => response.data)
    .then(data => data.result)
    .catch(error => {
      console.log(error);
    });


  return res

}

// convert document from firestore to book club
function docToBookClub(doc: any) {
  let data = doc;
  return {
    id: doc.id,
    name: data.name,
    moderator: data.moderator,
    members: data.members,
    maxMemberNumber: data.maxMemberNumber,
    book: data.book,
    discussions: data.discussions,
    resources: data.resources,
    owner: data.owner,
  };
}

// https://firebase.google.com/docs/firestore/manage-data/add-data#update_elements_in_an_array
async function addMember(bookClubId: string, memberId: string) {
  let params =  new URLSearchParams({"bookClubId" : bookClubId, "memberId": memberId})
  let url = API_URL+"bookClub/addMember?" + params

  const res = await axios.post(url, REQUEST_CONFIG)
    .catch(error => {
      console.log(error);
    });
}

async function removeMember(bookClubId: string, memberId: string) {
  let params =  new URLSearchParams({"bookClubId" : bookClubId, "memberId": memberId})
  let url = API_URL+"bookClub/removeMember?" + params

  const res = await axios.post(url, REQUEST_CONFIG)
    .catch(error => {
      console.log(error);
    });
}

export {
  createBookClubDocument,
  updateBookClubDocument,
  deleteBookClubDocument,
  getBookClubDocument,
  searchBookClubs,
  addMember,
  removeMember,
    getBookClubsByModerator,
    getBookClubsByJoinedMember,
    getAllDiscussionsOfBookClubsByUser,
};

export type { BookClub, Discussion, Comment, Resource };
