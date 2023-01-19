import axios from "axios";
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
import { API_URL, REQUEST_CONFIG } from "../constants";
  import { firebaseDB } from "./firebaseConfig";

async function createCommentDocument(bookClubId: string, discussionId: string, data: any) {
  let params =  new URLSearchParams({"bookClubId" : bookClubId, "discussionId":discussionId})
  let url = API_URL+"bookClub/discussion/comment?" + params
  axios.post(url, data, REQUEST_CONFIG)
    .catch(error => {
        console.log(error);
    });
}

async function updateCommentDocument(bookClubId: string, discussionId: string, commentId:string, data:any) {
  let params =  new URLSearchParams({"bookClubId" : bookClubId, "discussionId":discussionId, "commentId":commentId})
  let url = API_URL+"bookClub/discussion/comment?" + params
  axios.patch(url, data, REQUEST_CONFIG)
    .catch(error => {
        console.log(error);
    });
}
async function deleteCommentDocument(bookClubId: string, discussionId: string, commentId: string) {
  let params =  new URLSearchParams({"bookClubId" : bookClubId, "discussionId":discussionId, "commentId":commentId})
  let url = API_URL+"bookClub/discussion/comment?" + params
  axios.delete(url, REQUEST_CONFIG)
    .catch(error => {
        console.log(error);
    });
}
async function getCommentDocument(bookClubId:string, discussionId:string, commentId:string) {
  let params =  new URLSearchParams({"bookClubId" : bookClubId, "discussionId":discussionId, "commentId":commentId})
  let url = API_URL+"bookClub/discussion/comment?" + params
  const res = await axios.get(url, REQUEST_CONFIG)
    .then(response => response.data)
    .then(data => data.result)
    .catch(error => {
        console.log(error);
    });

  if (res) {
    return {
      passage: res.passage,
      quote: res.quote,
      text: res.text,
      photo: res.photo
    }
  }
}
async function getDiscussionComments(bookClubId:string ,discussionId: string) {
  let params =  new URLSearchParams({"bookClubId" : bookClubId, "discussionId":discussionId})
  let url = API_URL+"bookClub/discussion/allComments?" + params
  const res = await axios.get(url, REQUEST_CONFIG)
    .then(response => response.data)
    .then(data => data.result)
    .catch(error => {
        console.log(error);
    });
    return res
}

export {
    createCommentDocument, getDiscussionComments, updateCommentDocument, deleteCommentDocument, getCommentDocument
}