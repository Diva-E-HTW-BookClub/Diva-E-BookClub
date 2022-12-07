import {
  addDoc,
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
import {  updateBookClubDocument } from "./firebaseBookClub";
import { firebaseDB } from "./firebaseConfig";

// Expected data format
// {
//   bookClubId : String
//   location : String
//   title : String
//   created : Date ( current Date)
// }

async function createDiscussionDocument(bookClubId: string, data: any) {
  console.log(data)
  var res = await addDoc(collection(firebaseDB, "bookClubs", bookClubId, "discussions"), data);
}

async function updateDiscussionDocument(bookClubId: string, discussionId: string, data: any) {
  const discussionDocument = doc(firebaseDB, "bookClubs", bookClubId, "discussions", discussionId);

  updateDoc(discussionDocument, data);
}

async function getDiscussionDocument(bookClubId:string, discussionId:string) {
  const discussionDocument = doc(firebaseDB, "bookClubs", bookClubId, "discussions", discussionId);
  let discussionDocResult = await getDoc(discussionDocument)
  let discussionData = discussionDocResult.data()

  if (discussionData) {
    return {
      title: discussionData.title,
      startTime: discussionData.startTime,
      endTime: discussionData.endTime,
      location: discussionData.location
    }
  }
}
// Needs to delete the discussion document and its subcollection of comments if available
async function deleteDiscussionDocument(bookClubId: string, discussionId: string) {
  //delete discussion
  const discussionDocument = doc(firebaseDB, "bookClubs", bookClubId, "discussions", discussionId);
  deleteDoc(discussionDocument);

  //delete comments
  let commentsQuery = query(
    collection(firebaseDB, "bookClubs", String(bookClubId), "discussions", String(discussionId), "comments"),
  );
  
  var commentDocuments = await getDocs(commentsQuery);
  commentDocuments.forEach((doc) => {
      deleteDoc(doc.ref)
  })
}

export {
  createDiscussionDocument,
  updateDiscussionDocument,
  deleteDiscussionDocument,
  getDiscussionDocument,
};
