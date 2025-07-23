import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;


export const loginUser = ({ userId, userPW }) => {
    const requestBody = {
        userId: userId,
        userPW: userPW
    }
    return axios.post(`${BASE_URL}/container_manager/login`, requestBody, {
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        }
    })
        .then(response => {
            return response;
        });
};

export const changePassword = ({ userId, userPW, new_password })=> {
    const requestBody = {
        'new_password': new_password
    };
    return axios.put(`${BASE_URL}/container_manager/password`, requestBody, {
        headers: {
            'accept': 'application/json',
            'userID': userId,
            'userPW': userPW
        }
    });
}