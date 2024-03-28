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
            <Text>Home screen text!</Text>

            {/* This button can also be removed in future prototypes */}
            <Button title="Go back to starting page" onPress={() => props.navigation.navigate('Start')}/>

            {loggedIn ? (
              <Text>Logged in, hello {auth?.currentUser.email}</Text>
            ):(
              <Text>Not logged in</Text>
            )}
            <SignOut loggedIn={loggedIn} />
        </div>
    )
}
export default Home;