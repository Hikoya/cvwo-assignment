import axios from "axios";

const BASE_URL = "http://localhost:8080";
axios.defaults.withCredentials = true;

export const getTasks = (obj) => {
  try {
    const url = `${BASE_URL}/api/tasks`;
    return axios.post(url, obj);
  } catch (error) {
    console.log(error);
  }
};

export const addTasks = (obj) => {
  try {
    const url = `${BASE_URL}/api/createTask`;
    return axios.post(url, obj);
  } catch (error) {
    console.log(error);
  }
};

export const deleteTasks = (obj) => {
  try {
    const url = `${BASE_URL}/api/deleteTask/${obj}`;
    return axios.delete(url, obj);
  } catch (error) {
    console.log(error);
  }
};

export const updateTasks = (obj) => {
  try {
    const url = `${BASE_URL}/api/updateTask`;
    return axios.put(url, obj);
  } catch (error) {
    console.log(error);
  }
};
