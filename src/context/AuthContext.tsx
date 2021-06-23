import { useEffect,useState,createContext,ReactNode } from "react";
import { firebase,auth } from "../services/firebase";

type User = {
    id: string;
    name: string;
    photo: string;
}

type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {

    const [user, setUser] = useState<User>();

    // Pra quando o usuário da refresh na página para recuperar as informações, sem esse useEffect se der f5 as informações são perdidas.
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
          const { displayName, photoURL, uid } = user
  
          if (!displayName || !photoURL) {
            throw new Error('Missing Information from Google Account');
          }
  
          setUser({
            id: uid,
            name: displayName,
            photo: photoURL
          })
        }
      })
  
  
      return () => {
        unsubscribe();
      }
    }, [])
  
    async function signInWithGoogle() {
  
      const provider = new firebase.auth.GoogleAuthProvider();
  
      const result = await auth.signInWithPopup(provider)
  
      if (result.user) {
        const { displayName, photoURL, uid } = result.user
  
        if (!displayName || !photoURL) {
          throw new Error('Missing Information from Google Account');
        }
  
        setUser({
          id: uid,
          name: displayName,
          photo: photoURL
        })
      }
    }

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {props.children}
        </AuthContext.Provider>
    );
}