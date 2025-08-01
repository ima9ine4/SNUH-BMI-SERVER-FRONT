import React, { useState } from "react";
import { ReactComponent as BMILogo } from "./../snuh-bmi-lab-logo.svg";
import { loginUser } from "../api/loginApi";

const LoginPage = ({ onLogin }) => {
    const [ userId, setUserId ] = useState("");
    const [ userPW, setuserPW ] = useState("");
    const [ error, setError ] = useState("");
    const [ loading, setLoading ] = useState(false);
    
    const handleLogin = async () => {
        if (userId === "" || userPW === ""){
            setError("아이디와 비밀번호를 모두 입력해주세요.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await loginUser({ userId, userPW });
            const responseData = response.data;
            
            if(responseData.status === "로그인 성공"){
                onLogin(
                    {
                        userId: responseData.userId,
                        userPW: responseData.userPW
                    }
                );
                
            }else{
                setError("로그인에 실패했습니다.")
            }
        } catch (err) {
            setError("로그인에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                {/* 로고 및 브랜딩 */}
                <div className="text-center mb-8">
                    <BMILogo className="mx-auto mb-4" />
                    {/* <h1 className="text-2xl font-bold text-gray-900 mb-2">SNUH BMI LAB</h1> */}
                    <p className="text-gray-600 text-sm">BMI Server Controller</p>
                </div>

                {/* 로그인 폼 */}
                <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                                아이디
                            </label>
                            <input
                                id="userId"
                                type="text"
                                placeholder="아이디를 입력하세요"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 disabled:bg-gray-50"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="userPW" className="block text-sm font-medium text-gray-700 mb-2">
                                비밀번호
                            </label>
                            <input
                                id="userPW"
                                type="password"
                                placeholder="비밀번호를 입력하세요"
                                value={userPW}
                                onChange={(e) => setuserPW(e.target.value)}
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 disabled:bg-gray-50"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        로그인
                    </button>
                </form>

                {loading && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white bg-opacity-50 rounded-2xl p-6 flex flex-col items-center gap-4">
                        <div className='flex flex-col items-center gap-4'>
                            <div className='flex space-x-2'>
                                <div className='w-3 h-3 bg-blue-600 rounded-full animate-bounce'></div>
                                <div className='w-3 h-3 bg-blue-600 rounded-full animate-bounce' style={{animationDelay: '0.1s'}}></div>
                                <div className='w-3 h-3 bg-blue-600 rounded-full animate-bounce' style={{animationDelay: '0.2s'}}></div>
                            </div>
                            <p className='text-xl text-gray-700 font-bold'>로그인 중...</p>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;