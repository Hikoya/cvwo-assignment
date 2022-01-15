import axios from "axios";

const BASE_URL = "";
axios.defaults.withCredentials = true;

export const loginUser = (obj: any) => {
  try {
    const url = `${BASE_URL}/api/login`;
    return axios.post(url, obj);
  } catch (error) {
    console.log(error);
    return;
  }
};

export const registerUser = (obj: any) => {
  try {
    const url = `${BASE_URL}/api/register`;
    return axios.post(url, obj);
  } catch (error) {
    console.log(error);
    return;
  }
};

export const checkAuth = () => {
  try {
    const url = `${BASE_URL}/api/checkUser`;
    return axios.get(url);
  } catch (error) {
    console.log(error);
    return;
  }
};
