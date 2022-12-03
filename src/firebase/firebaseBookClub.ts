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

  const bookClubDocument = doc(firebaseDB, "bookClubs", String(bookClubId));

  await updateDoc(bookClubDocument, {
    memberCount: increment(incrementBy),
  });
}
async function getBookClubDocument(bookClubId: string) {
  const bookClubDocument = doc(firebaseDB, "bookClubs", String(bookClubId));
  var bookClubResultDocument = await getDoc(bookClubDocument);
  let bookClubData = bookClubResultDocument.data()

  let discussionQuery = query(
    collection(firebaseDB, "bookClubs", String(bookClubId), "discussions"),
    orderBy("title"),
    limit(100)
  );
  var discussionDocuments = await getDocs(discussionQuery);
  var discussionArray: Discussion[] = []

  discussionDocuments.forEach((doc) => { 
    let data = doc.data()
    discussionArray.push({
      chapter: data.chapter,
      participants: data.participants,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.endTime
    })
  })
  if (bookClubData) {
    return {
      id: bookClubData.id,
      name: bookClubData.name,
      moderator: bookClubData.moderator,
      participants: bookClubData.participants,
      maxParticipantsNumber: bookClubData.maxParticipantsNumber,
      book: bookClubData.book,
      discussions: discussionArray,
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
  searchBookClubs,
  addDiscussionToBookClub,
};

export type {
  BookClub, Discussion
}
