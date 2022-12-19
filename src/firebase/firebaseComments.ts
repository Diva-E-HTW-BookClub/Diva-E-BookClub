import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
  } from "firebase/firestore";
  import { firebaseDB } from "./firebaseConfig";

async function createCommentDocument(bookClubId: string, discussionId: string, data: any) {
    var res = await addDoc(collection(firebaseDB, "bookClubs", bookClubId, "discussions", discussionId, "comments"), data);
  }

async function updateCommentDocument(bookClubId: string, discussionId: string, commentId:string, data:any) {
  const commentDocument = doc(firebaseDB, "bookClubs", bookClubId, "discussions", discussionId, "comments", commentId);

  updateDoc(commentDocument, data);
}
async function deleteCommentDocument(bookClubId: string, discussionId: string, commentId: string) {
  const commentDocument = doc(firebaseDB, "bookClubs", bookClubId, "discussions", discussionId, "comments", commentId);

  deleteDoc(commentDocument)
}
async function getCommentDocument(bookClubId:string, discussionId:string, commentId:string) {
  const commentDocument = doc(firebaseDB, "bookClubs", bookClubId, "discussions", discussionId, "comments", commentId);
  let commentDocResult = await getDoc(commentDocument)
  let commentData = commentDocResult.data()

  if (commentData) {
    return {
      passage: commentData.passage,
      quote: commentData.quote,
      text: commentData.text,
    }
  }
}
async function getDiscussionComments(bookClubId:string ,discussionId: string) {
    let q = query(
        collection(firebaseDB, "bookClubs", bookClubId, "discussions", discussionId, "comments")
      );
    var results = await getDocs(q);

    return results.docs.map(doc => {
    let data = doc.data();
    return {
        commentId: doc.id,
        text: data.text,
        quote: data.quote,
        passage: data.passage,
        moderator: data.moderator,
    }
    });
}

export {
    createCommentDocument, getDiscussionComments, updateCommentDocument, deleteCommentDocument, getCommentDocument
}