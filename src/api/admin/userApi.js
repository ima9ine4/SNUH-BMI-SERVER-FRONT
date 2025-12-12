import axios from 'axios';
const ADMIN_URL = process.env.REACT_APP_API_ADMIN_URL;

// 사용자 조회
export const getAllUsers = (userPW) => {
    return axios.get(`${ADMIN_URL}/Users/list`, {
        headers: {
            'accept': 'application/json',
            'BMI_SWAGGER_KEY': userPW,
        }
    });
}

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

// 파일 다운로드 신청 허가
export const approveDownloadRequest = ({userPW, user_id, file_name}) => {
    return axios.post(`${ADMIN_URL}/Client_Download/move_file/`, {}, {
        params: { 
            userID: user_id,
            fileName: file_name
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

// 사용자 추가 
export const addUserApi = ({ userPW, user_id, user_name, user_password, user_phone, user_email, user_department, user_research })=> {
    console.log('userPw', userPW);
    console.log('user_id', user_id);
    console.log('user_name', user_name);
    console.log('user_password', user_password);
    console.log('user_phone', user_phone);
    console.log('user_email', user_email);
    console.log('user_department', user_department);
    console.log('user_research', user_research);
    const requestBody = '';
    return axios.post(`${ADMIN_URL}/Users/v2`, requestBody, {
        params: { 
            userID: user_id,
            userName: user_name,
            userPassword: user_password,
            phone: user_phone,
            email: user_email,
            department: user_department,
            research: user_research,
        },
        headers: {
            'accept': 'application/json',
            'BMI_SWAGGER_KEY': userPW,
        }
    });
}