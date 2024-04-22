import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, CircularProgress } from "@mui/material";
import { auth, db } from "../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import SignOut from "../components/SignOut";

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
};

const buttonStyle = {
  marginTop: "20px",
  backgroundColor: "#F45D01",
};

const headerStyle = {
  fontSize: "50px",
  marginBottom: "20px",
};

const userInfoStyle = {
  fontSize: "20px",
  marginBottom: "10px",
};

function Settings() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure there is a current user logged in
    if (auth.currentUser) {
      const usersCollectionRef = collection(db, "users");
      const q = query(usersCollectionRef, where("uid", "==", auth.currentUser.uid)); // Query to find user document by uid

      const fetchData = async () => {
        try {
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            // Assuming each UID only corresponds to one document
            const userData = querySnapshot.docs[0].data();
            setUserDetails(userData); // Set the fetched data to state
            setLoading(false);
          } else {
            console.log("No such document! Check Firestore for correct user UID.");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };
      fetchData();
    } else {
      navigate("/login"); // Redirect to login if not logged in
    }
  }, [navigate]);

  return (
    <div style={containerStyle}>
      <Typography variant="h2" style={headerStyle}>
        Account Settings
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : userDetails ? (
        <div>
          <Typography variant="body1" style={userInfoStyle}>
            Email: {auth.currentUser.email}
          </Typography>
          <Typography variant="body1" style={userInfoStyle}>
            Name: {userDetails.name}
          </Typography>
          <Typography variant="body1" style={userInfoStyle}>
            Birthday: {userDetails.birthday}
          </Typography>
          <Typography variant="body1" style={userInfoStyle}>
            Height: {userDetails.height ? `${userDetails.height} inches` : "Not specified"}
          </Typography>
          <Typography variant="body1" style={userInfoStyle}>
            Weight: {userDetails.weight ? `${userDetails.weight} lbs` : "Not specified"}
          </Typography>
          <SignOut loggedIn={!!auth.currentUser} />
        </div>
      ) : (
        <Typography variant="body1">Loading...</Typography>
      )}
      <br></br>
      <Button variant="contained" sx={{ backgroundColor: '#F45D01', '&:hover': { backgroundColor: '#F45D01', color: '#333' } }} onClick={() => navigate("/home")}>
        Go to Home
      </Button>
    </div>
  );
}

export default Settings;
