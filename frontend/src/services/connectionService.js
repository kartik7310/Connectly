import { baseUrl } from "../utils/constants";
import axios from "axios";
class ConnectionService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  async reviewRequest({status,requestId}) {
    try {
     const url = `${this.baseUrl}/connections/request/review/${requestId}/${status}`;

        const res = await axios.post(url,{},{
          withCredentials:true
        })
      return res.data;
    } catch (err) {
      const serverMsg =
        err?.response?.data?.message || err?.response?.data?.error;
      throw new Error(serverMsg || "something went wrong");
    }
  }
  
  async sendConnectionRequest({status,userId}) {
    try {
     const url = `${this.baseUrl}/connections/request/send/${status}/${userId}`;

        const res = await axios.post(url,{},{
          withCredentials:true
        })
      return res.data;
    } catch (err) {
      const serverMsg =
        err?.response?.data?.message || err?.response?.data?.error;
      throw new Error(serverMsg || "something went wrong");
    }
  }
  
}
export default new ConnectionService(baseUrl);
