import { useEffect, useState } from "react";
import {addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where} from 'firebase/firestore';
import { auth, db } from "../firebase-config";

import '../styles/Chat.css';

export const Chat = (props) => {

    const {room} = props;
    
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);

    //refers to the collection messages in the firebase database
    const messageRef = collection(db, "messages");


    useEffect(() => {
    
        //query to retrieve the chats in a room order by createdAt. orderby is enabled after you create an index
        const queryMessages = query(
            messageRef, 
            where("room", "==", room), 
            orderBy("createdAt")
        );

        //onSnapshot function allows us to listen to the changes in the database. 
        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
            let messages = [];
            snapshot.forEach((doc) => {
                messages.push({...doc.data(), id: doc.id});
            });

            setMessages(messages);

        });

        //cleaning the useeffect which is important
        return () => unsubscribe();

    },[])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(newMessage === "") return;

        await addDoc(messageRef, {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth.currentUser.displayName,
            room: room
        });

        setNewMessage("");
    };

    return (
    
        <div className="chat-app">

            <div className="header">
                <h1>
                    Welcome to {room.toUpperCase()}
                </h1>
            </div>

            <div className="messages">
                {messages.map((message) => (
                    <div className="message" key = {message.id}>
                        <span className="user">{message.user}</span>
                        {message.text}
                    </div>
                     
                ))}
            </div>
        
            <form onSubmit={handleSubmit} className="new-message-form">
        
                <input 
                    className="new-message-input" 
                    placeholder="Type your message here"
                    onChange={(e) => setNewMessage(e.target.value)}
                    value = {newMessage}
                />
        
                <button type = "submit" className="send-button">
                    Send
                </button>
        
            </form>
        
        </div>
    )
};