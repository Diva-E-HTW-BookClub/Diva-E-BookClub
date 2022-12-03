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
  var res = await addDoc(collection(firebaseDB, "bookClubs", bookClubId, "discussions"), data);
}

async function updateDiscussionDocument(bookClubId: string, discussionId: string, data: any) {
  const discussionDocument = doc(firebaseDB, "bookClubs", bookClubId, "discussions", discussionId);

  updateDoc(discussionDocument, data);
}

async function deleteDiscussionDocument(bookClubId: string, discussionId: string) {
  const discussionDocument = doc(firebaseDB, "bookClubs", bookClubId, "discussions", discussionId);

  deleteDoc(discussionDocument);
}

export {
  createDiscussionDocument,
  updateDiscussionDocument,
  deleteDiscussionDocument,
};
