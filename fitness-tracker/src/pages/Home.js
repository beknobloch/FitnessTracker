import React, {useState, useEffect} from "react";
import { auth } from '../config/firebase'
import SignOut from '../components/SignOut';

// Home screen user can see after logging in or creating an account
function Home(props){
    //const userCollectionRef = collection(db, "users")
    const [loggedIn, setLoggedIn] = useState(false)

        //listens for if user signs in/out
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((state) => {
            setLoggedIn(state);
        }); 
        return () => unsubscribe();
    }, []);

    return(
        <div>
            <p>Home screen p!</p>

            {/* This button can also be removed in future prototypes */}
            <button title="Go back to starting page" onPress={() => props.navigation.navigate('Start')}/>

            {loggedIn ? (
              <p>Logged in, hello {auth?.currentUser.email}</p>
            ):(
              <p>Not logged in</p>
            )}
            <SignOut loggedIn={loggedIn} />
        </div>
    )
}
export default Home;