import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { addDiscussionToBookClub, updateBookClubDocument } from "./firebaseBookClub";
import { firebaseDB } from "./firebaseConfig";

// Expected data format
// {
//   bookClubId : String
//   location : String
//   title : String
//   created : Date ( current Date)
// }

async function createDiscussionDocument(bookClubId: string, data: any) {
  data.bookClubId = bookClubId;
  var res = await addDoc(collection(firebaseDB, "bookClubs", "discussions"), data);
}

async function updateDiscussionDocument(discussionId: string, data: any) {
  const discussionDocument = doc(
    firebaseDB,
    "discussions",
    String(discussionId)
  );

  updateDoc(discussionDocument, data);
}

async function deleteDiscussionDocument(discussionId: string) {
  const discussionDocument = doc(
    firebaseDB,
    "discussions",
    String(discussionId)
  );

  deleteDoc(discussionDocument);
}

export {
  createDiscussionDocument,
  updateDiscussionDocument,
  deleteDiscussionDocument,
};
