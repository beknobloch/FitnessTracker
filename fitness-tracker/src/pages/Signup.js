import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../config/firebase';
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";

function Signup() {
    const [birthday, setBirthday] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isCoach, setIsCoach] = useState(false);
    const [heightFeet, setHeightFeet] = useState(0);
    const [heightInches, setHeightInches] = useState(0);
    const [weight, setWeight] = useState(0);

    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const userCollectionRef = collection(db, "users");

    const createAccount = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            await addUser();
            if (isCoach) {
                navigate('/coach');
            } else {
                navigate('/select-coach');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to create an account. Please check your inputs and try again.");
        }
    };

    const addUser = async () => {
        try {
            const totalHeightInches = heightFeet * 12 + heightInches;
            const docRef = await addDoc(userCollectionRef, {
                name: name,
                uid: auth.currentUser.uid,
                birthday: birthday,
                isCoach: isCoach,
                height: totalHeightInches,
                weight: weight,
                coachId: isCoach ? "" : null // Set coachId to null if user is not a coach
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>
            <label htmlFor="birthday" style={{ fontSize: "14px" }}>Date of birth:  </label>
            <input
                id="birthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
            />
            <br />
            <label htmlFor="name" style={{ fontSize: "14px" }}>Name:  </label>
            <input
                placeholder="Your name"
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <br />
            <label htmlFor="email" style={{ fontSize: "14px" }}>Email:  </label>
            <input
                placeholder="Your email"
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <label htmlFor="password" style={{ fontSize: "14px" }}>Password:  </label>
            <input
                placeholder="Your password"
                id='password'
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <label htmlFor="weight" style={{ fontSize: "14px" }}>Weight:  </label>
            <input
                placeholder="lbs"
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value))}
            />
            <br />

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <label htmlFor="height" style={{ fontSize: "14px", marginRight: "5px" }}>Height: </label>
                <div>
                    <select value={heightFeet} onChange={(e) => setHeightFeet(parseInt(e.target.value))}>
                        {Array.from({ length: 8 }, (_, i) => i).map((value) => (
                            <option key={value} value={value}>
                                {value} ft
                            </option>
                        ))}
                    </select>
                    <select value={heightInches} onChange={(e) => setHeightInches(parseInt(e.target.value))}>
                        {Array.from({ length: 13 }, (_, i) => i).map((value) => (
                            <option key={value} value={value}>
                                {value} in
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <label htmlFor="isCoach" style={{ fontSize: "14px" }}>Are you a health coach?  </label>
            <input
                type="checkbox"
                id='isCoach'
                checked={isCoach}
                onChange={(e) => setIsCoach(e.target.checked)}
            />

            <br />
            <button className={'button'} onClick={createAccount}>Create Account</button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
}

export default Signup;
