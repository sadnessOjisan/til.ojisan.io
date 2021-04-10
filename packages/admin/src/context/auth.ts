import { createContext } from "preact";
import { useContext } from "preact/hooks";

export const AuthTokenContext = createContext<
  firebase.default.User | undefined
>(undefined);
export const useAuthTokenContext = () => useContext(AuthTokenContext);
