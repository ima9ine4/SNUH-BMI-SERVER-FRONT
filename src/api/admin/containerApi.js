import axios from 'axios';
const ADMIN_URL = process.env.REACT_APP_API_ADMIN_URL;

// 모든 컨테이너 조회
export const getAllContainersApi = ({userPW, pageNum}) => {
    return axios.get(`${ADMIN_URL}/Server/list_all`, {
        params: {
            requestPageCountNum: pageNum
        },
        headers: {
            'accept': 'application/json',
            'BMI_SWAGGER_KEY': userPW,
        }
    });
}