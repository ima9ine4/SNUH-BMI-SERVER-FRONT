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

export const UploadFile = ({ userId, userPW, files }) => {
    const formData = new FormData();
    files.forEach((files) => {
        formData.append("files", files);
    })

    return axios.post(`${BASE_URL}/file_io/upload_file`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
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

export const DownloadFile = ({ userId, userPW, fileName}) => {
    return axios.get(`${BASE_URL}/file_io/download_file`, {
        responseType: 'blob',
        params: { fileName },
        headers: {
            'accept': 'application/json',
            'userID': userId,
            'userPW': userPW
            }
        })
        .catch(error => {
            console.log(error.response);
            }
        )
}