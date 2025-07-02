import axios from 'axios';
import dummyData from '../data/dummyContainerData.json';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

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

