import { apiEndpoints, baseUrl } from "../utils/constants";
import axios from "axios";
class UserService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  async getConnections() {
    try {
      const res = await axios.get(this.baseUrl + apiEndpoints.connections, {
        withCredentials: true,
      });

      return res.data;
    } catch (err) {
      const serverMsg =
        err?.response?.data?.message || err?.response?.data?.error;
      throw new Error(serverMsg || "something went wrong");
    }
  }
  async fetchRequest() {
    try {
      const res = await axios.get(this.baseUrl + apiEndpoints.request, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      const serverMsg =
        err?.response?.data?.message || err?.response?.data?.error;
      throw new Error(serverMsg || "something went wrong");
    }
  }
}
export default new UserService(baseUrl);
