
import { addDoc, arrayUnion, collection, deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { updateBookClubDocument } from "./firebaseBookClub";
import { firebaseDB } from "./firebaseConfig";



async function createDiscussionDocument(bookClubId: string, data: any) {
    
    var res = await addDoc(collection(firebaseDB, 'discussions'), data)
    if (res){
        var updateData = {
            discussionIds: arrayUnion(bookClubId)
        }
        updateBookClubDocument(bookClubId, updateData)
    }
}
  
async function updateDiscussionDocument(id: string, data:any ) {
    const discussionDocument = doc(firebaseDB, 'discussions', String(id))
  
    updateDoc(discussionDocument, data)
}
  
async function deleteDiscussionDocument(id: string) {
    const discussionDocument = doc(firebaseDB, 'discussions', String(id))
  
    deleteDoc(discussionDocument)
}

export { createDiscussionDocument, updateDiscussionDocument, deleteDiscussionDocument }