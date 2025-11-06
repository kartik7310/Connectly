import { apiEndpoints,baseUrl } from "../utils/constants";
import axios from "axios";
class ProfileService {
  constructor(baseUrl){
    this.baseUrl = baseUrl
  }
   async getProfile(){
        try {
            const res = await axios.get(this.baseUrl + apiEndpoints.Profile,{
                    withCredentials: true,
                })
            return res
        } catch (err) {
             const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
    throw new Error(serverMsg || "Invalid credentials"); 
        }
    }
   async updateProfile(values){
        try {
            const res = await axios.patch(this.baseUrl + apiEndpoints.updateProfile,
                values, 
                {
                    withCredentials: true,
                })
            return res
        } catch (err) {
             const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
    throw new Error(serverMsg || "Invalid credentials"); 
        }
    }
}
export default new ProfileService(baseUrl);