import axios from 'axios';
const ADMIN_URL = process.env.REACT_APP_API_ADMIN_URL;

export const CreateVolumeApi = ({ userPW, volumeData })=> {
    let vol_name = volumeData.vol_name;
    const requestBody = {
        'abs_path': volumeData.abs_path,
        'readwrite' : volumeData.readwrite,
        'users': volumeData.users
    };
    return axios.post(`${ADMIN_URL}/volume_control/volumes/${vol_name}`, requestBody, {
        headers: {
            'accept': 'application/json',
            'BMI_SWAGGER_KEY': userPW,
            'Content-Type' : 'application/json'
        }
    });
}

export const AddVolumeUserApi = ({ userPW, vol_name, user_name })=> {
    const requestBody = '';
    return axios.post(`${ADMIN_URL}/volume_control/volumes/${vol_name}/users/${user_name}`, requestBody,{
        headers: {
            'accept': 'application/json',
            'BMI_SWAGGER_KEY': userPW,
        }
    });
}
}