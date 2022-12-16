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

async function getDiscussionDocument(bookClubId: string, discussionId: string) {
  const discussionDocument = doc(firebaseDB, "bookClubs", bookClubId, "discussions", discussionId);
  let discussionDocResult = await getDoc(discussionDocument);
  let discussionData = discussionDocResult.data();

  if (discussionData) {
    return {
      id: discussionData.id,
      title: discussionData.title,
      startTime: discussionData.startTime,
      endTime: discussionData.endTime,
      location: discussionData.location,
      participants: discussionData.participants,
      agenda: discussionData.agenda,
    };
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
    deleteDoc(doc.ref);
  });
}

async function addDiscussionParticipant(
  bookClubId: string,
  discussionId: string,
  participantId: string
) {
  const discussionDocument = doc(firebaseDB, "bookClubs", bookClubId, "discussions", discussionId);
  // Atomically add a new participant to the "participants" array field.
  await updateDoc(discussionDocument, {
    participants: arrayUnion(participantId),
  });
}
async function removeDiscussionParticipant(bookClubId: string, discussionId: string, participantId: string) {
  const discussionDocument = doc(firebaseDB, "bookClubs", bookClubId, "discussions", discussionId);
  // Atomically remove a participant from the "participants" array field.
  await updateDoc(discussionDocument, {
    participants: arrayRemove(participantId),
  });
}

export {
  createDiscussionDocument,
  updateDiscussionDocument,
  deleteDiscussionDocument,
  getDiscussionDocument,
  addDiscussionParticipant,
  removeDiscussionParticipant,
};
