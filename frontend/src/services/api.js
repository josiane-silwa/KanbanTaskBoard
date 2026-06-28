//import axios from 'axios'
import ApiAxios from './ApiAxios'

export const getTasks = () => ApiAxios.get(`/`)

export const createTasks = () => ApiAxios.post(`/`)

export const updateTasks = ({ id }) => ApiAxios.patch(`/${id}`)

export const deleteTasks = ({ id }) => ApiAxios.delete(`/${id}`)
//console.log(getTasks)