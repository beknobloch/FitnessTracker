import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, CircularProgress, TextField, Card, CardContent, Grid } from "@mui/material";
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

const boldTextStyle = {
  fontWeight: "bold",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "center", // Center the button
  marginTop: "20px",
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
        <Card variant="outlined">
          <CardContent>
            {editMode ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Name"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Birthday"
                    value={editedBirthday}
                    onChange={(e) => setEditedBirthday(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Height"
                    value={editedHeight}
                    onChange={(e) => setEditedHeight(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Weight"
                    value={editedWeight}
                    onChange={(e) => setEditedWeight(e.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>
            ) : (
              <div>
                <Typography variant="body1" style={userInfoStyle}>
                  <span style={boldTextStyle}>Email:</span> {auth.currentUser.email}
                </Typography>
                <Typography variant="body1" style={userInfoStyle}>
                  <span style={boldTextStyle}>Name:</span> {userDetails.name}
                </Typography>
                <Typography variant="body1" style={userInfoStyle}>
                  <span style={boldTextStyle}>Birthday:</span> {userDetails.birthday}
                </Typography>
                <Typography variant="body1" style={userInfoStyle}>
                  <span style={boldTextStyle}>Height:</span> {userDetails.height ? `${userDetails.height} inches` : "Not specified"}
                </Typography>
                <Typography variant="body1" style={userInfoStyle}>
                  <span style={boldTextStyle}>Weight:</span> {userDetails.weight ? `${userDetails.weight} lbs` : "Not specified"}
                </Typography>
                <Typography variant="body1" style={userInfoStyle}>
                  <span style={boldTextStyle}>Coach:</span> {userDetails.coachId && coachDetails ? `${coachDetails.name} ` : "Not specified"}
                </Typography>
              </div>
            )}
            <div style={buttonContainerStyle}>
              {editMode ? (
                <div>
                {!userDetails.isCoach && ( // Check if user is not a coach
                  <Button
                    variant="contained"
                    onClick={() => navigate("/select-coach", { isCoach: false })} // Navigate to SelectCoach if not a coach
                  >
                    Edit Coach
                  </Button>
                )}
                <Button variant="contained" onClick={handleEdit}>Save Changes</Button>
                </div>
              ) : (
                <Button variant="contained" onClick={() => setEditMode(true)}>Edit</Button>
              )}
              
            </div>
          </CardContent>
          
        </Card>
      ) : (
        <Typography variant="body1">Loading...</Typography>
      )}
      <br></br>
      <SignOut loggedIn={!!auth.currentUser} />
      <Button variant="contained" sx={{ backgroundColor: '#F45D01', '&:hover': { backgroundColor: '#F45D01', color: '#333' }, marginTop: '20px' }} onClick={() => navigate("/home")}>
        Go to Home
      </Button>
    </div>
  );
}

export default Settings;
