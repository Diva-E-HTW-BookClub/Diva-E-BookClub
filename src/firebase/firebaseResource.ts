import axios from "axios";
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
import { API_URL, REQUEST_CONFIG } from "../constants";
  
  import {  updateBookClubDocument } from "./firebaseBookClub";
  import { firebaseDB } from "./firebaseConfig";
  
  async function createResourceDocument(bookClubId: string, data: any) {
    let params =  new URLSearchParams({"bookClubId" : bookClubId})
    let url = API_URL+"bookClub/resource?" + params
    axios.post(url,data, REQUEST_CONFIG)
      .catch(error => {
          console.log(error);
      });
  }
  
  async function updateResourceDocument(bookClubId: string, resourceId: string, data: any) {
    let params =  new URLSearchParams({"bookClubId" : bookClubId, "resourceId" : resourceId})
    let url = API_URL+"bookClub/resource?" + params
    axios.patch(url,data, REQUEST_CONFIG)
      .catch(error => {
          console.log(error);
      });
  }
  
  async function getResourceDocument(bookClubId: string, resourceId: string) {
    let params =  new URLSearchParams({"bookClubId" : bookClubId, "resourceId" : resourceId})
    let url = API_URL+"bookClub/resource?" + params
    let res = await axios.get(url, REQUEST_CONFIG)
      .then(response => response.data)
      .then(data => data.result)
      .catch(error => {
          console.log(error);
      });
  
    if (res) {
      return {
        id: res.id,
        title: res.title,
        content: res.content,
        moderator: res.moderator
      };
    }
  }

  async function deleteResourceDocument(bookClubId: string, resourceId: string) {
    let params =  new URLSearchParams({"bookClubId" : bookClubId, "resourceId" : resourceId})
    let url = API_URL+"bookClub/resource?" + params
    axios.delete(url, REQUEST_CONFIG)
      .catch(error => {
          console.log(error);
      });
  }

export {
  getResourceDocument,
  updateResourceDocument,
  createResourceDocument,
  deleteResourceDocument,
};
