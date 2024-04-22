import { db } from "../config/firebase"
import { collection, getDocs, query, where, updateDoc, doc, limit } from 'firebase/firestore';

// given a user id and field, returns the field's value on the database
const getValue = async (uid, field) => {
    try{
        const q = query(collection(db, "users"), where("uid", "==", uid), limit(1));
        const userDoc = (await getDocs(q)).docs[0].data();

        return userDoc[field]
    }catch(e){
        if(!uid){
            console.log('no user id')
        }else{
            console.log(e)
        }
    }
}

// given a user id and field, returns the field's value on the database, multiple docs may be returned
const getMultipleValues = async (uid, field) => {
    try {
        const q = query(collection(db, "users"), where(field, "==", uid));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return data
    } catch (error) {
        console.error("Error fetching users:", error);
    }
};

// given a user id, field, and expectedValue, returns if the field's value on the database matched expectedValue
const compareValue = async (uid, field, expectedValue) => {
    try{
        const q = query(collection(db, "users"), where("uid", "==", uid), limit(1));
        const userDoc = (await getDocs(q)).docs[0].data();

        return userDoc[field] === expectedValue
    }catch(e){
        if(!uid){
            console.log('no user id')
        }else{
            console.log(e)
        }
    }
}

// given a user id, field, and value, pushes data to firebase
const pushData = async (uid, field, value) => {
    try{
        const q = query(collection(db, "users"), where("uid", "==", uid), limit(1));
        const docId = (await getDocs(q)).docs[0].id;
        const userCollectionRef = doc(db, "users", docId);

        await updateDoc(userCollectionRef, {
            [field]: value
        });


    }catch(e){
        if(!uid){
            console.log('no user id')
        }else{
            console.log(e)
        }
    }
}
const Query = {
    getValue,
    compareValue,
    pushData,
    getMultipleValues
}

export default Query