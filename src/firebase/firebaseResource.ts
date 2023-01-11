import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { updateBookClubDocument } from "./firebaseBookClub";
import { firebaseDB } from "./firebaseConfig";

async function createResourceDocument(bookClubId: string, data: any) {
  var res = await addDoc(
    collection(firebaseDB, "bookClubs", bookClubId, "resources"),
    data
  );
}

async function updateResourceDocument(
  bookClubId: string,
  resourceId: string,
  data: any
) {
  const resourceDocument = doc(
    firebaseDB,
    "bookClubs",
    bookClubId,
    "resources",
    resourceId
  );
  updateDoc(resourceDocument, data);
}

async function getResourceDocument(bookClubId: string, resourceId: string) {
  const resourceDocument = doc(
    firebaseDB,
    "bookClubs",
    bookClubId,
    "resources",
    resourceId
  );
  let resourceDocResult = await getDoc(resourceDocument);
  let resourceData = resourceDocResult.data();

  if (resourceData) {
    return {
      id: resourceData.id,
      title: resourceData.title,
      content: resourceData.content,
      moderator: resourceData.moderator,
    };
  }
}

async function deleteResourceDocument(bookClubId: string, resourceId: string) {
  //delete resource
  const resourceDocument = doc(
    firebaseDB,
    "bookClubs",
    bookClubId,
    "resources",
    resourceId
  );
  deleteDoc(resourceDocument);
}

export {
  getResourceDocument,
  updateResourceDocument,
  createResourceDocument,
  deleteResourceDocument,
};
