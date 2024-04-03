import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";

interface User {
    name: string,
    email: string,
    accessToken: string | null,
    photoUrl: string | null,
    verified: boolean,
    uid: string
}


export async function signInWithGoogle(): Promise<User | null> {

    try {
        const result = await signInWithPopup(auth, provider)
        console.log("RESULT", result)
        const credential = GoogleAuthProvider.credentialFromResult(result)

        const token = credential?.accessToken;

        const user: User = {
            name: result.user.displayName === null ? "" : result.user.displayName,
            email: result.user.email === null ? "" : result.user.email,
            accessToken: token === undefined ? "" : token,
            photoUrl: result.user.photoURL,
            verified: result.user.emailVerified,
            uid: result.user.uid
        }

        return user
    } catch (error) {
        console.log(error);
        return null;
    }
}

