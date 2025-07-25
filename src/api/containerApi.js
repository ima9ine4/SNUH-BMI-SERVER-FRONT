import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// 컨테이너 목록 조회 API 호출
export const getContainerList = ({userId, userPW}) => {
    return axios.get(`${BASE_URL}/container_manager/list`, {
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

export const startContainer = ({userId, userPW, serverName}) => {
    return axios.get(`${BASE_URL}/container_manager/restart`, {
        params: { serverName },
        headers: {
            'accept': 'application/json',
            'userID': userId,
            'userPW': userPW
        }
    })
}

export const stopContainer = ({userId, userPW, serverName}) => {
     return axios.get(`${BASE_URL}/container_manager/stop`, {
        params: { serverName },
        headers: {
            'accept': 'application/json',
            'userID': userId,
            'userPW': userPW
        }
    })
}

// export const fetchLogs = ({userId, userPW, serverName}) => {
//     console.log(`Stop Container: ${serverName}`);
//     return Promise.resolve({logs: `${serverName} 로그 내용`});
//     //     return axios.get(`${BASE_URL}/api/`, {
//     //     params: { userId, userPW, serverName}
//     // })
// }

export const deleteContainer = ({userId, userPW, serverName}) => {
    return axios.delete(`${BASE_URL}/container_manager`, {
        params: { serverName },
        headers: {
            'accept': 'application/json',
            'userID': userId,
            'userPW': userPW
        }
    })
}

export const createContainer = ({userId, userPW, formData}) => {
    const requestBody = {};
    return axios.post(`${BASE_URL}/container_manager`, requestBody, {
        params: formData,
        headers: {
            'accept': 'application/json',
            'userID': userId,
            'userPW': userPW
        }
    });
}

export const getDockerVolume = ({userId, userPW}) => {
    return axios.get(`${BASE_URL}/container_manager`, {
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

export const getAllDockerVolumeList = () => {
    return axios.get(`${BASE_URL}/container_manager/volumes`, {
        headers: {
            'accept': 'application/json'
        }
    })
    .catch(error => {
        console.log(error.response.data.errors);
        }
    )
}