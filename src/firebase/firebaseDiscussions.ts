
import { addDoc, arrayUnion, collection, deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { updateBookClubDocument } from "./firebaseBookClub";
import { firebaseDB } from "./firebaseConfig";


// Creates a discussion object with data. The discussion object
async function createDiscussionDocument(bookClubId: string, data: any) {

    data.bookClubId = bookClubId
    var res = await addDoc(collection(firebaseDB, 'discussions'), data)
   
    if (res){
        const discussionDocument = doc(firebaseDB, 'bookClubs', String(bookClubId))
        updateBookClubDocument(discussionDocument.id, {
            discussionIds: arrayUnion(res.id)
        })
           
    };
    
}
  
async function updateDiscussionDocument(discussionId: string, data:any ) {
    const discussionDocument = doc(firebaseDB, 'discussions', String(discussionId))
  
    updateDoc(discussionDocument, data)
}
  
async function deleteDiscussionDocument(discussionId: string) {
    const discussionDocument = doc(firebaseDB, 'discussions', String(discussionId))
  
    deleteDoc(discussionDocument)
}

export { createDiscussionDocument, updateDiscussionDocument, deleteDiscussionDocument }