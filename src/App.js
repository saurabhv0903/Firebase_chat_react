import { useState, useRef} from 'react';
import './App.css';
import { Auth } from './components/Auth';
import { Chat } from './components/Chat';

//to keep the user logged in, we are using cookies
import Cookies from "universal-cookie";

import {signOut} from 'firebase/auth';
import { auth } from './firebase-config';

const cookies = new Cookies()


function App() {

  //returns true or false based on login status
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [room, setRoom] = useState(null);

  const roomInputRef = useRef(null);

  const signUserOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
    setRoom(null);
  }

  if(!isAuth){
  return (
    <div className="App">
      <Auth setIsAuth={setIsAuth}/>
    </div>
  );
  }

  return (
    <>

      {room ? (
        <Chat room={room}/>
        ) : (
          <div className='room'> 
            
            <label>Enter Room Name:</label>
            <input ref={roomInputRef}/>

            <button onClick={() => setRoom(roomInputRef.current.value)}>
              Enter Chat
            </button>

          </div>
          )}

      <div className='sign-out'>
        <button onClick={signUserOut}>Sign out</button>
      </div>
    </>
  )
}

export default App;
