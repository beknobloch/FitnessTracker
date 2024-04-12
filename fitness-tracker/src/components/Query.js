import { db } from "../config/firebase"
import { collection, getDocs, query, where } from 'firebase/firestore';

// given a user id, field, and expectedValue, returns if the field's value on the database matched expectedValue
const getValue = async (uid, field, expectedValue) => {
    try{
        const q = query(collection(db, "users"), where("uid", "==", uid));
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

const Query = {
    getValue
}

export default Query