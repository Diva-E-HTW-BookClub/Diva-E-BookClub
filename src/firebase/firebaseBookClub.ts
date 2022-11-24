import { addDoc, collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
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
// }
async function createBookClubDocument(data: any) {   
    
    addDoc(collection(firebaseDB, 'bookClubs'), data)
}

async function updateBookClubDocument(id: string, data: any) {
    const bookClubDocument = doc(firebaseDB, 'bookClubs', String(id))

    updateDoc(bookClubDocument, data);
}
  
async function deleteBookClubDocument(id: string) {
    const bookClubDocument = doc(firebaseDB, 'bookClubs', String(id))

    deleteDoc(bookClubDocument)
}

async function getBookClubDiscussions(id: string) {
    const q = query(collection(firebaseDB, "discussions"), where("bookClubId", "==", id));

    var res = await getDocs(q)
    res.forEach((doc) => {
        console.log(doc.data())
    })

}



export { createBookClubDocument, updateBookClubDocument, deleteBookClubDocument, getBookClubDiscussions }