import axios from 'axios'

const isDevelopment = import.meta.env.MODE === 'development'
const myBaseUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_DEPLOY

// export default axios.create({
//     baseURL:'http://127.0.0.1:8000/api/tasks/'
// })
export default axios.create({
    baseURL: myBaseUrl
})