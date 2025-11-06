import { apiEndpoints,baseUrl } from "../utils/constants";
import axios from "axios";
class AuthService {
  constructor(baseUrl){
    this.baseUrl = baseUrl
  }

   async createAccount({ firstName, lastName, email, password }) {
        try {
            const res = await axios.post(
                this.baseUrl + apiEndpoints.signUp,
                {
                    firstName,
                    lastName,
                    email,
                    password,
                },
                {
                    withCredentials: true,
                }
            );

            return res;
        } catch (err) {
           const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
    throw new Error(serverMsg || "Invalid credentials"); // <-- key change  
        }
    }
     async loginAccount({ email, password }) {
        try {
            const res = await axios.post(
                this.baseUrl + apiEndpoints.login,
                {
                    email,
                    password,
                },
                {
                    withCredentials: true,
                }
            );

            return res;
        } catch (err) {
           const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
    throw new Error(serverMsg || "Invalid credentials");  
        }
    }

   
    async logout(){
        try {
            const {data} = await axios.post(this.baseUrl + apiEndpoints.logout,   {}, {
                    withCredentials: true,
                })
                console.log("data",data);
                
            return data
            
        } catch (err) {
             const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
    throw new Error(serverMsg || "Invalid credentials"); 
        }
    }
}
export default new AuthService(baseUrl);