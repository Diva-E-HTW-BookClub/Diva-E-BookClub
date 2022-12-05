import {
    addDoc,
    collection,
    getDocs,
    query,
  } from "firebase/firestore";
  import { firebaseDB } from "./firebaseConfig";

async function createCommentDocument(bookClubId: string, discussionId: string, data: any) {
    var res = await addDoc(collection(firebaseDB, "bookClubs", bookClubId, "discussions", discussionId, "comments"), data);
  }

async function getComments(bookClubId:string ,discussionId: string) {
    let q = query(
        collection(firebaseDB, "bookClubs", bookClubId, "discussions", discussionId, "comments")
      );
    var results = await getDocs(q);

    return results.docs.map(doc => {
    let data = doc.data();
    return {
        id: doc.id,
        text: data.text,
        passage: data.passage
    }
    });
}

export {
    createCommentDocument, getComments
}