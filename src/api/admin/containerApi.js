import axios from 'axios';
const ADMIN_URL = process.env.REACT_APP_API_ADMIN_URL;

// 모든 컨테이너 조회
export const getAllContainersApi = ({userPW, pageNum}) => {
    return axios.get(`${ADMIN_URL}/Users/container`, {
        params: {
            requestPageCountNum: pageNum
        },
        headers: {
            'accept': 'application/json',
            'BMI_SWAGGER_KEY': userPW,
        }
    });
}

// 컨테이너 검색
export const searchContainerApi = ({userPW, keyword, pageNum}) => {
    return axios.get(`${ADMIN_URL}/Users/container/search`, {
        params: {
            keyword,
            requestPageCountNum: pageNum
        },
        headers: {
            'accept': 'application/json',
            'BMI_SWAGGER_KEY': userPW,
        }
    });
}

// 컨테이너 삭제
export const deleteContainerApi = ({userPW, container_name}) => {
    return axios.delete(`${ADMIN_URL}/Users/container`, {
        params: {
            serverName: container_name,
        },
        headers: {
            'accept': 'application/json',
            'BMI_SWAGGER_KEY': userPW
        }
    })
}