import { auth, provider } from "../firebase-config"
import {signInWithPopup} from "firebase/auth"

//to keep the user logged in, we are using cookies
import Cookies from "universal-cookie";


const cookies = new Cookies()

export const Auth = (props) => {

    const {setIsAuth} = props;

    const signInWithGoogle = async () => {

        try {
            const result = await signInWithPopup(auth, provider);
            //go to the performance tab-> cookies-> localhost, you can see this token in that when you log in 
            cookies.set("auth-token", result.user.refreshToken);  
            setIsAuth(true);
            
        } catch (err) {
            console.log(err);
        }
        
    };


    return (
        <div className="auth">
            <p>Sign in with google to continue</p>
            <button onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
    )
}