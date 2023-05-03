import axios from "axios";

const gymApi = axios.create({
  baseURL: `/api`
});


export default gymApi;