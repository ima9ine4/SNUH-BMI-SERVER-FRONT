import axios from 'axios';
const ADMIN_URL = process.env.REACT_APP_API_ADMIN_URL;

export const getAllUsers = (userPW) => {
    return axios.get(`${ADMIN_URL}/Users/list`, {
        headers: {
            'accept': 'application/json',
            'BMI_SWAGGER_KEY': userPW,
        }
    });

// 특정 사용자의 파일 다운로드 신청 목록 조회
export const getUserDownloadRequests = ({userPW, user_id}) => {
    return axios.get(`${ADMIN_URL}/Client_Download/client_file_list`, {
        params: {
            'userID': user_id
        },
        headers: {
            'accept': 'application/json',
            'BMI_SWAGGER_KEY': userPW,
        }
    });
}

// 사용자 삭제
export const deleteUserApi = ({userPW, user_id}) => {
    return axios.delete(`${ADMIN_URL}/Users`, {
        params: { 
            userID: user_id 
        },
        headers: {
            'accept': 'application/json',
            'BMI_SWAGGER_KEY': userPW
        }
    })
}

}