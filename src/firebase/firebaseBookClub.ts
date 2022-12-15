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
  startAfter
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

// serch book clubs by their name, book title
// and where participants contains and not contains given participant id
// (needed to find clubs where user is a participant and where not)
async function searchBookClubs(filter: string, inputText: string, participantId: string, includeParticipant: boolean, resultsLimit: number, lastBookClubId?: string) {
  let fieldPath;
  if (filter === "name") {
    fieldPath = new FieldPath("name");
  } else if (filter === "book") {
    // field path is more complex for nested documents
    // to search by title field within the book field we need to use this FieldPath
    fieldPath = new FieldPath("book", "title");
  } else {
    console.log(`unknown field ${filter}`);
    return [];
  }
  let queryConstraints = [
    // https://stackoverflow.com/a/61516548
    // search documents in which the field by field path starts with input text
    where(fieldPath, '>=', inputText),
    where(fieldPath, '<=', inputText + '~'),
    orderBy(fieldPath),
    limit(resultsLimit)
  ];
  if (lastBookClubId != null) {
    // https://firebase.google.com/docs/firestore/query-data/query-cursors#use_a_document_snapshot_to_define_the_query_cursor
    // this is needed for pagination
    // we get the last found book club document by id
    // and tell firebase to return new results starting after that document
    const lastBookClubDocument = doc(firebaseDB, "bookClubs", lastBookClubId);
    let lastBookClubDocumentResult = await getDoc(lastBookClubDocument);
    queryConstraints.push(startAfter(lastBookClubDocumentResult));
  }
  if (includeParticipant) {
    // find documents where user is in the list of participants
    // to search by participants and club name/book title a corresponding index is needed
    // https://console.firebase.google.com/project/diva-e-htw-bookclub/firestore/indexes
    queryConstraints.push(where("participants", "array-contains", participantId));
    let q = query(
      collection(firebaseDB, "bookClubs"),
      ...queryConstraints
    );
    // returns documents from bookClubs collection matching all query constraints
    var results = await getDocs(q);
    return results.docs.map(docToBookClub);
  } else {
    // find all documents from bookClubs collection matching the search query
    // regardles of their participants
    let q = query(
      collection(firebaseDB, "bookClubs"),
      ...queryConstraints
    );
    var results = await getDocs(q);
    return results.docs.map(docToBookClub)
      // remove clubs where our user is a participant
      .filter(bookClub => !bookClub.participants.includes(participantId));
  }
}

// convert document from firestore to book club
function docToBookClub(doc: any) {
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
  addParticipant,
  removeParticipant
};

export type {
  BookClub, Discussion, Comment
}
