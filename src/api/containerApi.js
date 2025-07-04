// import axios from 'axios';
import dummyData from '../data/dummyContainerData.json';

// const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// 컨테이너 목록 조회 API 호출
export const getContainerList = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                data: dummyData.data,
                time: dummyData.time
            })
        });
    }, 500);
}

// export const getContainerList = () => {
//     return axios.get(`${BASE_URL}/api/`)
// }
//

export const startContainer = ({userId, userPw, serverName}) => {
    console.log(`Start Container: ${serverName}`);
    return Promise.resolve({success : true});
    //     return axios.get(`${BASE_URL}/api/`, {
    //     params: { userId, userPw, serverName}
    // })
}

export const stopContainer = ({userId, userPw, serverName}) => {
    console.log(`Stop Container: ${serverName}`);
    return Promise.resolve({success : true});
    //     return axios.get(`${BASE_URL}/api/`, {
    //     params: { userId, userPw, serverName}
    // })
}

export const fetchLogs = ({userId, userPw, serverName}) => {
    console.log(`Stop Container: ${serverName}`);
    return Promise.resolve({logs: `${serverName} 로그 내용`});
    //     return axios.get(`${BASE_URL}/api/`, {
    //     params: { userId, userPw, serverName}
    // })
}

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
  };  