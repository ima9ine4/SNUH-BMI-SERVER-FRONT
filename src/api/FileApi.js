import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getFileList = ({ userId, userPW }) => {
    return axios.get(`${BASE_URL}/file_io/client_file_list`, {
        headers: {
            'accept': 'application/json',
            'userID': userId,
            'userPW': userPW
            }
        })
        .catch(error => {
            console.log(error.response.data.errors);
            }
        )
}