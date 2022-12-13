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
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { firebaseDB } from "./firebaseConfig";
import { deleteDiscussionDocument } from "./firebaseDiscussions";

type Comment = {
  text: string,
  passage: string,
  commentId: string,
  owner: string,
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
  owner: string,
}

type BookClub = {
  id: string,
  name: string,
  moderator: string[],
  participants: string[],
  maxParticipantsNumber: number,
  book: Book,
  discussions: Discussion[],
  owner: string,
}

async function createBookClubDocument(data: BookClub) {
  const doc = await addDoc(collection(firebaseDB, "bookClubs"), data);
  return doc.id;
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
      owner: discussionData.owner,
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
      owner: bookClubData.owner,
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
      discussions: data.discussions,
      owner: data.owner,
    }
  });
}

// get book clubs by participant ordered by name and convert results to BookClub[]
async function searchBookClubsByParticipant(participantId: string) {
  let q = query(
    collection(firebaseDB, "bookClubs"),
    where("participants", "array-contains", participantId)
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
      discussions: data.discussions,
      owner: data.owner,
    }
  });
}

// https://firebase.google.com/docs/firestore/manage-data/add-data#update_elements_in_an_array
async function addParticipant(bookClubId: string, participantId: string) {
  const bookClubDocument = doc(firebaseDB, "bookClubs", bookClubId);
  // Atomically add a new participant to the "participants" array field.
  await updateDoc(bookClubDocument, {
      participants: arrayUnion(participantId)
  });
}

async function removeParticipant(bookClubId: string, participantId: string) {
  const bookClubDocument = doc(firebaseDB, "bookClubs", bookClubId);
  // Atomically remove a participant from the "participants" array field.
  await updateDoc(bookClubDocument, {
      participants: arrayRemove(participantId)
  });
}

export {
  createBookClubDocument,
  updateBookClubDocument,
  deleteBookClubDocument,
  getBookClubDocument,
  searchBookClubs,
  searchBookClubsByParticipant,
  addParticipant,
  removeParticipant
};

export type {
  BookClub, Discussion, Comment
}
