import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;


export const loginUser = ({ userId, userPw }) => {
    const requestBody = {
        userId: userId,
        userPW: userPw
    }
    console.log("Request Body: ", requestBody);
    return axios.post(`${BASE_URL}/container_manager/login`, requestBody, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(response => {
            return response;
        });
};