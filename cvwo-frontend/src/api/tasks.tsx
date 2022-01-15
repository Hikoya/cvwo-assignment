import axios from "axios";

const BASE_URL = "http://localhost:8080";
axios.defaults.withCredentials = true;

export const getTasks = (obj: any) => {
  try {
    const url = `${BASE_URL}/api/tasks`;
    return axios.post(url, obj);
  } catch (error) {
    console.log(error);
    return;
  }
};

export const addTasks = (obj: any) => {
  try {
    const url = `${BASE_URL}/api/createTask`;
    return axios.post(url, obj);
  } catch (error) {
    console.log(error);
    return;
  }
};

export const deleteTasks = (obj: any) => {
  try {
    const url = `${BASE_URL}/api/deleteTask/${obj}`;
    return axios.delete(url, obj);
  } catch (error) {
    console.log(error);
    return;
  }
};

export const updateTasks = (obj: any) => {
  try {
    const url = `${BASE_URL}/api/updateTask`;
    return axios.put(url, obj);
  } catch (error) {
    console.log(error);
    return;
  }
};
