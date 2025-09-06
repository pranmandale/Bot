import {jwtDecode} from "jwt-decode"

export const decodedToken = (token) => {
    if(!token) return null;
    try{
        const decoded = jwtDecode(token);
        return decoded;
    } catch(error) {
        console.log("Error decoding token", error);
        return null;
    }

}