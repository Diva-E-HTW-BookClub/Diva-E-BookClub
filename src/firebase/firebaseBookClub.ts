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
import { deleteDiscussionDocument } from "./firebaseDiscussions";

type Comment = {
  text: string,
  passage: string,
  commentId: string,
}
type Book = {
  title: string,
  authors: string[],
  imageUrl: string
}

type Discussion = {
  id: string,
  title: string,
  participants: string[],
  startTime: string,
  endTime: string,
  location: string,
  agenda: string,
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
  console.log(data)
  const bookClubDocument = doc(firebaseDB, "bookClubs", String(bookClubId));

  updateDoc(bookClubDocument, data);
}

//Needs to delete the BookClub, its discussions and all of their comments
async function deleteBookClubDocument(bookClubId: string) {
  const bookClubDocument = doc(firebaseDB, "bookClubs", String(bookClubId));
  deleteDoc(bookClubDocument);

   //delete Discussions
   let discussionQuery = query(
    collection(firebaseDB, "bookClubs", String(bookClubId), "discussions"),
  );
  
  var discussionDocuments = await getDocs(discussionQuery);
  discussionDocuments.forEach((doc) => {
      deleteDiscussionDocument(bookClubId, doc.id)
  })
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
    let discussionData = doc.data()
    discussionArray.push({
      id: doc.id,
      title: discussionData.title,
      participants: discussionData.participants,
      startTime: discussionData.startTime,
      endTime: discussionData.endTime,
      location: discussionData.location,
      agenda: discussionData.agenda,
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

export {
  createBookClubDocument,
  updateBookClubDocument,
  deleteBookClubDocument,
  getBookClubDocument,
  searchBookClubs,
};

export type {
  BookClub, Discussion, Comment
}
