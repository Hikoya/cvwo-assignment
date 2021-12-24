import axios from "axios";

const BASE_URL = "http://localhost:8080";
axios.defaults.withCredentials = true;

export const loginUser = (obj) => {
  try {
    const url = `${BASE_URL}/api/login`;
    return axios.post(url, obj);
  } catch (error) {
    console.log(error);
  }
};

export const registerUser = (obj) => {
  try {
    const url = `${BASE_URL}/api/register`;
    return axios.post(url, obj);
  } catch (error) {
    console.log(error);
  }
};

export const checkAuth = () => {
  try {
    const url = `${BASE_URL}/api/checkUser`;
    return axios.get(url);
  } catch (error) {
    console.log(error);
  }
};
