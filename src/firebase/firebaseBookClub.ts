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
  const q = query(
    collection(firebaseDB, "bookClubs"),
    where(documentId(), "==", bookClubId)
  );

  var res = await getDocs(q);
  // res.forEach((doc) => {
  //   console.log(doc.id)
  //   console.log(doc.data())
  // });

  return res;
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
async function getBookClubDiscussions(id: string) {
  const q = query(
    collection(firebaseDB, "discussions"),
    where("bookClubId", "==", id)
  );

  var res = await getDocs(q);
  res.forEach((doc) => {
    console.log(doc.data());
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
};

export type {
  BookClub
}
