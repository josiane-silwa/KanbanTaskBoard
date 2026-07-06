//import axios from 'axios'
import ApiAxios from "./ApiAxios";

export const getTasks = () => ApiAxios.get(`/`);

export const createTasks = ( formData ) => ApiAxios.post(`/`, formData);
console.log('passei pela api post')

export const updateTasks = ({ id, data }) => {
//   const newData = transformData(data);
//   console.log("Passei na api update...", id, data);
  return ApiAxios.patch(`/${id}/`, data);
};

export const deleteTasks = ({ id }) => ApiAxios.delete(`/${id}/`);
// console.log('passei pela api delete')
