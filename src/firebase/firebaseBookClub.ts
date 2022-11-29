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
} from "firebase/firestore";
import { useState } from "react";
import { firebaseDB } from "./firebaseConfig";

// Expected data format
// {
//   Book : String
//   description : String
//   discussionIds : [number]
//   location : String
//   memberCount : number
//   time : Date
//   title : String
//   created : Date ( current Date)
// }
async function createBookClubDocument(data: any) {
  addDoc(collection(firebaseDB, "bookClubs"), data);
}

async function updateBookClubDocument(bookClubId: string, data: any) {
  const bookClubDocument = doc(firebaseDB, "bookClubs", String(bookClubId));

  updateDoc(bookClubDocument, data);
}

async function deleteBookClubDocument(bookClubId: string) {
  const bookClubDocument = doc(firebaseDB, "bookClubs", String(bookClubId));

  deleteDoc(bookClubDocument);
}

//Increments a given BookClub's memberCount by incrementBy
//Supports negative numbers -> decrease count
async function incrementBookClubMemberCount(
  bookClubId: string,
  incrementBy: number
) {
  console.log("starting");
  const bookClubDocument = doc(firebaseDB, "bookClubs", String(bookClubId));

  await updateDoc(bookClubDocument, {
    memberCount: increment(incrementBy),
  });
}
async function getBookClubDocument(bookClubId: string) {
  const q = query(
    collection(firebaseDB, "bookClubs"),
    where(documentId(), "==", bookClubId)
  );

  var res = await getDocs(q);
  // res.forEach((doc) => {
  //   console.log(doc.id)
  //   console.log(doc.data())
  // });

  return res;
}
interface jsonObj {
  id: string;
  data: object;
}

async function searchBookClubs(resultLimit: number) {
  var q: any;
  q = query(
    collection(firebaseDB, "bookClubs"),
    orderBy("title"),
    limit(resultLimit)
  );

  var res = await getDocs(q);

  var resultArray: any[] = [];

  res.forEach((doc) => {
    var jsonObj: {} = {
      id: doc.id,
      data: doc.data(),
    };
    resultArray.push(jsonObj);
  });

  return resultArray;
}

// Geht durch alle discussions, vermutlich effizienter über den BookClub auf die discussions zu kommen
async function getBookClubDiscussions(id: string) {
  const q = query(
    collection(firebaseDB, "discussions"),
    where("bookClubId", "==", id)
  );

  var res = await getDocs(q);
  res.forEach((doc) => {
    console.log(doc.data());
  });
}

export {
  createBookClubDocument,
  updateBookClubDocument,
  deleteBookClubDocument,
  incrementBookClubMemberCount,
  getBookClubDocument,
  getBookClubDiscussions,
  searchBookClubs,
};
