import axios from 'axios';
const ADMIN_URL = process.env.REACT_APP_API_ADMIN_URL;

export const CreateVolumeApi = ({ userPW, abs_path, readwrite, users })=> {
    const requestBody = {
        'abs_path': abs_path,
        'readwrite' : readwrite,
        'users' : users
    };
    return axios.post(`${ADMIN_URL}/volume_control/volumes/{volume_name}`, requestBody, {
        headers: {
            'accept': 'application/json',
            'BMI_SWAGGER_KEY': userPW,
            'Content-Type' : 'application/json'
        }
    });
}