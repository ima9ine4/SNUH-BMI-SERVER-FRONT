// const BASE_URL = process.env.REACT_APP_API_BASE_URL;


export const loginUser = ({ userId, userPw }) => {
    // 임시 로그인 테스트용
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 임시 계정 검증
            if (userId === 'admin' && userPw === 'password') {
                resolve({
                    data: {
                        userId: userId,
                        userPw: userPw,
                        success: true,
                        message: '로그인 성공'
                    }
                });
            } else {
                reject({
                    message: '아이디 또는 비밀번호가 잘못되었습니다.'
                });
            }
        }, 1000); // 1초 딜레이
    });
    
    // return axios.post(`${BASE_URL}/api/login`, { userId, userPw });
};
