import axios from 'axios';
const ADMIN_URL = process.env.REACT_APP_API_ADMIN_URL;

export const getAllUsers = (userPW) => {
    return axios.get(`${ADMIN_URL}/Users/list`, {
        headers: {
            'accept': 'application/json',
            'BMI_SWAGGER_KEY': userPW,
        }
    });
}