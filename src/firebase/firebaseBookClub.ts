import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  increment,
  getDocs,
  query,
  updateDoc,
  where,
  documentId,
  limit,
  orderBy,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { firebaseDB } from "./firebaseConfig";

type Book = {
  title: string,
  authors: string[],
  imageUrl: string
}

type Discussion = {
  chapter: string,
  participants: string[],
  startTime: Date,
  endTime: Date,
  location: string
}

type BookClub = {
  id: string,
  name: string,
  moderator: string,
  participants: string[],
  maxParticipantsNumber: number,
  book: Book,
  discussions: Discussion[]
}

async function createBookClubDocument(data: BookClub) {
  addDoc(collection(firebaseDB, "bookClubs"), data);
}

async function updateBookClubDocument(bookClubId: string, data: any) {
  const bookClubDocument = doc(firebaseDB, "bookClubs", String(bookClubId));

  updateDoc(bookClubDocument, data);
}

async function deleteBookClubDocument(bookClubId: string) {
  const bookClubDocument = doc(firebaseDB, "bookClubs", String(bookClubId));

  deleteDoc(bookClubDocument);
}

//Increments a given BookClub's memberCount by incrementBy
//Supports negative numbers -> decrease count
async function incrementBookClubMemberCount(
  bookClubId: string,
  incrementBy: number
) {
  console.log("starting");
  const bookClubDocument = doc(firebaseDB, "bookClubs", String(bookClubId));

  await updateDoc(bookClubDocument, {
    memberCount: increment(incrementBy),
  });
}
async function getBookClubDocument(bookClubId: string) {
  const bookClubDocument = doc(firebaseDB, "bookClubs", String(bookClubId));

  var result_doc = await getDoc(bookClubDocument);
  let doc_data = result_doc.data()

  if (doc_data) {
    return {
      id: doc_data.id,
      name: doc_data.name,
      moderator: doc_data.moderator,
      participants: doc_data.participants,
      maxParticipantsNumber: doc_data.maxParticipantsNumber,
      book: doc_data.book,
      discussions: doc_data.discussions,
    }
  }
}

// get book clubs ordered by name and convert results to BookClub[]
async function searchBookClubs(resultLimit: number) {
  let q = query(
    collection(firebaseDB, "bookClubs"),
    orderBy("name"),
    limit(resultLimit)
  );

  var results = await getDocs(q);

  return results.docs.map(doc => {
    let data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      moderator: data.moderator,
      participants: data.participants,
      maxParticipantsNumber: data.maxParticipantsNumber,
      book: data.book,
      discussions: data.discussions
    }
  });
}

// Geht durch alle discussions, vermutlich effizienter über den BookClub auf die discussions zu kommen
async function getBookClubDiscussions(bookClubId: string) {
  const bookClubDocument = doc(firebaseDB, "bookClubs", String(bookClubId));
  
  const q = query(
    collection(firebaseDB, "discussions"),
    where("bookClubId", "==", bookClubId)
  );

  var results = await getDocs(q);

  return results.docs.map(doc => {
    let data = doc.data();  
    return {
      chapter: data.chapter,
      participants: data.participants,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location
    }
  });
}

async function addDiscussionToBookClub(bookClubId: string, discussionId: string) {
  const bookClubDocument = doc(firebaseDB, "bookClubs", String(bookClubId));
  updateBookClubDocument(bookClubDocument.id, {
    discussionIds: arrayUnion(discussionId),
  });
}

export {
  createBookClubDocument,
  updateBookClubDocument,
  deleteBookClubDocument,
  incrementBookClubMemberCount,
  getBookClubDocument,
  getBookClubDiscussions,
  searchBookClubs,
  addDiscussionToBookClub,
};

export type {
  BookClub, Discussion
}
