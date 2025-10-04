import axios from "axios";

// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Alter defaults after instance has been created
// instance.defaults.headers.common["Authorization"] = AUTH_TOKEN;

export default instance;
