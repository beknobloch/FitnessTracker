import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, CircularProgress, TextField } from "@mui/material";
import { auth, db } from "../config/firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import SignOut from "../components/SignOut";

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
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
  const [coachDetails, setCoachDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedBirthday, setEditedBirthday] = useState("");
  const [editedHeight, setEditedHeight] = useState("");
  const [editedWeight, setEditedWeight] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure there is a current user logged in
    if (auth.currentUser) {
      fetchData();
    } else {
      navigate("/login"); // Redirect to login if not logged in
    }
  }, );
  const fetchCoachData = async (coachId) => {
    const usersCollectionRef = collection(db, "users");
    const q = query(usersCollectionRef, where("uid", "==", coachId));
    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // Assuming each UID only corresponds to one coach
        const coachData = querySnapshot.docs[0].data();
        setCoachDetails(coachData); // Set the fetched data to state
        setLoading(false);
      } else {
        console.log("No such document! Check Firestore for correct user UID.");
      }
    } catch (error) {
      console.error("Error fetching coach details:", error);
    }
  };
  const handleEdit = async () => {
    try {
    const userQuery = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      console.error("No matching documents.");
      return;
    }
    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, "users", userDoc.id);

    const newData = {};

      if (editedName !== "") newData.name = editedName;
      if (editedBirthday !== "") newData.birthday = editedBirthday;
      if (editedHeight !== "") newData.height = parseInt(editedHeight, 10);
      if (editedWeight !== "") newData.weight = parseInt(editedWeight, 10);;
      await updateDoc(userRef, newData);
      setEditMode(false);
      fetchData();

       // Clear the input fields
      setEditedName("");
      setEditedBirthday("");
      setEditedHeight("");
      setEditedWeight("");

      navigate("/settings");
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const fetchData = async () => {
    try {
      const usersCollectionRef = collection(db, "users");
      const q = query(usersCollectionRef, where("uid", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // Assuming each UID only corresponds to one document
        const userData = querySnapshot.docs[0].data();
        setUserDetails(userData); // Set the fetched data to state
        fetchCoachData(userData.coachId);
        setLoading(false);
      } else {
        console.log("No such document! Check Firestore for correct user UID.");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  return (
    <div style={containerStyle}>
      <Typography variant="h2" style={headerStyle}>
        Account Settings
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : userDetails ? (
        <div>
        {editMode ? (
          <div>
            <TextField
              label="Name"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            />
            <TextField
              label="Birthday"
              value={editedBirthday}
              onChange={(e) => setEditedBirthday(e.target.value)}
            />
            <TextField
              label="Height"
              value={editedHeight}
              onChange={(e) => setEditedHeight(e.target.value)}
            />
            <TextField
              label="Weight"
              value={editedWeight}
              onChange={(e) => setEditedWeight(e.target.value)}
            />
            <Button variant="contained" onClick={handleEdit}>Save Changes</Button>
          </div>
        ) : (
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
          <Typography variant="body1" style={userInfoStyle}>
            Coach: {userDetails.coachId && coachDetails ? `${coachDetails.name} `: "Not specified"}
          </Typography>
          <Button variant="contained" sx={{ backgroundColor: '#F45D01', '&:hover': { backgroundColor: '#F45D01', color: '#333' } }} onClick={() => setEditMode(true)}>Edit</Button>
          <div style={{ marginTop: "20px" }}> {/* Adjust the margin as needed */}
          <SignOut loggedIn={!!auth.currentUser} />
          </div>
        </div>
        )}
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
