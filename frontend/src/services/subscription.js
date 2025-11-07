import { apiEndpoints,baseUrl } from "../utils/constants";
import axios from "axios";
class SubscriptionService {
  constructor(baseUrl){
    this.baseUrl = baseUrl
  }
   async createOrder({planType}){
        try {
            const res = await axios.post(this.baseUrl + apiEndpoints.createOrder,{planType},{
                    withCredentials: true,
                })
            return res.data
        } catch (err) {
             const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
    throw new Error(serverMsg || "Invalid credentials"); 
        }
    }

   async checkPremium(){
        try {
            const res = await axios.get(this.baseUrl + apiEndpoints.isPremium,{
                    withCredentials: true,
                })
            return res.data
        } catch (err) {
             const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
    throw new Error(serverMsg || "Invalid credentials"); 
        }
    }
  
}
export default new SubscriptionService(baseUrl);