import React from "react";
import { useRef, useState } from "react";
import "./App.css";

import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

import Header from './components/header';

firebase.initializeApp({
  apiKey: "AIzaSyARJGxiyIUFDyJr-MpNKvzw-wI350eYXfU",
  authDomain: "react-chat-bb0a1.firebaseapp.com",
  projectId: "react-chat-bb0a1",
  storageBucket: "react-chat-bb0a1.appspot.com",
  messagingSenderId: "328047872648",
  appId: "1:328047872648:web:6f011653f9f50720e8ed3d",
  measurementId: "G-YQG4Y44M0H",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

const SignIn = () => {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return <div className="signIn" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
      <button className="auth-button" onClick={signInWithGoogle}>Sign In with Google</button>
      <br />
      <span style={{textAlign: 'center'}}>Managed by Google <br />___ <br /> We are only storing your name and display picture.</span>
    </div>;
};

const SignOut = () => {
  return (
    auth.currentUser && <button className="auth-button" onClick={() => auth.signOut()}>Sign Out</button>
  );
};

const getAllPeopleInChat = (messages) => {
  const people = [];
  if (messages) {
    const map = new Map();
    for (const item of messages) {
      if (!(map.has(item.uid) && map.has(item.displayName))) {
        map.set(item.uid, true);
        map.set(item.displayName, true);
        if (item.displayName) { // because earlier version don't have names
          people.push({
            uid: item.uid,
            displayName: item.displayName,
            photoURL: item.photoURL,
          });
        }
      }
    }
    console.log(people);
  }
  const peopleList = people.map((p, index) => {
    return <img
      height="32"
      width="32"
      src={p.photoURL}
      alt={p.displayName}
      title={p.displayName}
      className="people__img"
      key={index}/>
  })
  return <div className="people__list">{peopleList}</div>;
}

const scrollToBottom = () => {
  var objDiv = document.querySelector(".App");
  window.scrollTo(0, objDiv.scrollHeight);
}

const ChatMessage = (props) => {
  const { text, uid, photoURL, createdAt, displayName } = props.message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  const date =
    createdAt && createdAt.seconds ? new Date(createdAt.seconds * 1000) : "";
  return (
    <div className={`message ${messageClass}`}>
      <figure className="figure">
        <img src={photoURL} alt={displayName} />
      </figure>
      <div className="message__wrapper">
        <span className="message__name">{displayName}</span>
        <p>{text}</p>
        <span className="message__time">
          {createdAt && createdAt.seconds
            ? `${date
                .getHours()
                .toString()
                .padStart(2, "0")}:${date
                .getMinutes()
                .toString()
                .padStart(2, "0")}`
            : ""}
        </span>
      </div>
    </div>
  );
};

const ChatRoom = () => {
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(2500);
  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");
  const sendMessage = async (e) => {
    if (formValue !== "") {
      e.preventDefault();
      const { uid, photoURL, displayName } = auth.currentUser;
      console.log(auth.currentUser);

      await messagesRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL,
        displayName,
      });

      setFormValue("");
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages])

  return (
    <React.Fragment>
      {getAllPeopleInChat(messages)}
      <div>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
      </div>
      <form className="submit__wrapper" onSubmit={sendMessage}>
        <input
          className="submit__input"
          value={formValue}
          onChange={(e) => {
            setFormValue(e.target.value);
          }}
        />
        <button
          type="submit"
          className={formValue === "" ? "submit disabled" : "submit"}
        >
          send
        </button>
      </form>
    </React.Fragment>
  );
};

const App = () => {
  React.useEffect(() => {
    const msg = firebase.messaging();
    msg.requestPermission().then(() => {
      return msg.getToken();
    }).then(data => {
      console.warn("token", data)
    });
  }, []);

  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <Header auth="auth">
        <SignOut />
      </Header>
      <section
        style={{
          background: "#fddd96",
          boxShadow: "inset -1px -8px 14px 6px rgb(0 0 0 / 20%)",
          paddingTop: "16px",
          flexGrow: "1",
        }}
      >
        {user ? <ChatRoom /> : <SignIn />}
      </section>
      {auth.currentUser && (
        <button className="scroll-to-bottom" onClick={scrollToBottom}></button>
      )}
    </div>
  );
};

export default App;
