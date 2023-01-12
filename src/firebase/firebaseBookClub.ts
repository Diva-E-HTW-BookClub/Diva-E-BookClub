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
import { firebaseDB } from "./firebaseConfig";
import { deleteDiscussionDocument } from "./firebaseDiscussions";
import { deleteResourceDocument } from "./firebaseResource";

type Comment = {
  text: string;
  passage: string;
  commentId: string;
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
  const doc = await addDoc(collection(firebaseDB, "bookClubs"), data);
  return doc.id;
}

async function updateBookClubDocument(bookClubId: string, data: any) {
  console.log(data);
  const bookClubDocument = doc(firebaseDB, "bookClubs", String(bookClubId));

  updateDoc(bookClubDocument, data);
}

//Needs to delete the BookClub, its discussions and all of their comments
async function deleteBookClubDocument(bookClubId: string) {
  const bookClubDocument = doc(firebaseDB, "bookClubs", String(bookClubId));
  deleteDoc(bookClubDocument);

  //delete Discussions
  let discussionQuery = query(
    collection(firebaseDB, "bookClubs", String(bookClubId), "discussions")
  );

  var discussionDocuments = await getDocs(discussionQuery);
  discussionDocuments.forEach((doc) => {
    deleteDiscussionDocument(bookClubId, doc.id);
  });

  let resourceQuery = query(
    collection(firebaseDB, "bookClubs", String(bookClubId), "resources")
  );

  var resourceDocuments = await getDocs(resourceQuery);
  resourceDocuments.forEach((doc) => {
    deleteResourceDocument(bookClubId, doc.id);
  });
}

async function getBookClubDocument(bookClubId: string) {
  const bookClubDocument = doc(firebaseDB, "bookClubs", String(bookClubId));
  var bookClubResultDocument = await getDoc(bookClubDocument);
  let bookClubData = bookClubResultDocument.data();

  let discussionQuery = query(
    collection(firebaseDB, "bookClubs", String(bookClubId), "discussions"),
    orderBy("title"),
    limit(100)
  );
  var discussionDocuments = await getDocs(discussionQuery);
  var discussionArray: Discussion[] = [];

  discussionDocuments.forEach((doc) => {
    let discussionData = doc.data();
    discussionArray.push({
      id: doc.id,
      title: discussionData.title,
      participants: discussionData.participants,
      date: discussionData.date,
      startTime: discussionData.startTime,
      endTime: discussionData.endTime,
      location: discussionData.location,
      agenda: discussionData.agenda,
      moderator: discussionData.moderator,
      isArchived: discussionData.isArchived
    });
  });

  let resourceQuery = query(
    collection(firebaseDB, "bookClubs", String(bookClubId), "resources"),
    orderBy("title"),
    limit(100)
  );
  var resourceDocuments = await getDocs(resourceQuery);
  var resourceArray: Resource[] = [];

  resourceDocuments.forEach((doc) => {
    let resourceData = doc.data();
    resourceArray.push({
      id: doc.id,
      title: resourceData.title,
      content: resourceData.content,
      moderator: resourceData.moderator,
    });
  });

  if (bookClubData) {
    return {
      id: bookClubData.id,
      name: bookClubData.name,
      moderator: bookClubData.moderator,
      members: bookClubData.members,
      maxMemberNumber: bookClubData.maxMemberNumber,
      book: bookClubData.book,
      discussions: discussionArray,
      resources: resourceArray,
      owner: bookClubData.owner,
    };
  }
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
    where(fieldPath, ">=", inputText),
    where(fieldPath, "<=", inputText + "~"),
    orderBy(fieldPath),
    limit(resultsLimit),
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
  if (includeMember) {
    // find documents where user is in the list of members
    // to search by members and club name/book title a corresponding index is needed
    // https://console.firebase.google.com/project/diva-e-htw-bookclub/firestore/indexes
    queryConstraints.push(where("members", "array-contains", memberId));
    let q = query(collection(firebaseDB, "bookClubs"), ...queryConstraints);
    // returns documents from bookClubs collection matching all query constraints
    var results = await getDocs(q);
    return results.docs.map(docToBookClub);
  } else {
    // find all documents from bookClubs collection matching the search query
    // regardles of their members
    let q = query(collection(firebaseDB, "bookClubs"), ...queryConstraints);
    var results = await getDocs(q);
    return (
      results.docs
        .map(docToBookClub)
        // remove clubs where our user is a member
        .filter((bookClub) => !bookClub.members.includes(memberId))
    );
  }
}

// convert document from firestore to book club
function docToBookClub(doc: any) {
  let data = doc.data();
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
  const bookClubDocument = doc(firebaseDB, "bookClubs", bookClubId);
  // Atomically add a new member to the "members" array field.
  await updateDoc(bookClubDocument, {
    members: arrayUnion(memberId),
  });
}

async function removeMember(bookClubId: string, memberId: string) {
  const bookClubDocument = doc(firebaseDB, "bookClubs", bookClubId);
  // Atomically remove a member from the "members" array field.
  await updateDoc(bookClubDocument, {
    members: arrayRemove(memberId),
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
};

export type { BookClub, Discussion, Comment, Resource };
