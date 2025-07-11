import axios from 'axios';
import containerDummyData from '../data/dummyContainerData.json';
import dockerVolumeDummyData from '../data/dummyDockerVolumeData.json'

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
    console.log(`Start Container: ${serverName}`);
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
    console.log(`Stop Container: ${serverName}`);
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

export const deleteContainer = ({userId, userPw, serverName}) => {
    console.log(`Delete Container: ${serverName}`);
    return Promise.resolve({success : true});
    //     return axios.delete(`${BASE_URL}/api/`, {
    //     data: { userId, userPw, serverName}
    // })
}

export const createContainer = (params) => {
    return;
    // return axios.post(`${BASE_URL}/api/`, null, {
    //   params: params
    // });
}

export const getDockerVolume = ({userId, userPw}) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const volumeNames = Object.keys(dockerVolumeDummyData);
            resolve(volumeNames);
        }
        );
    }, 500);
    // return;
}