import React, { useState } from "react";

const LoginPage = ({ onLogin }) => {
    const [ userId, setUserId ] = useState("");
    const [ userPw, setuserPw ] = useState("");
    const [ error, setError ] = useState("");
    
    const handleLogin = () => {
        if (userId === "" || userPw === ""){
            setError("아이디와 비밀번호를 모두 입력해주세요.");
            return;
        }

        // 로그인 성공 시 onLogin 호출
        onLogin({ userId, userPw });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                {/* 로고 및 브랜딩 */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-white text-2xl font-bold">BMI</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">SNUH BMI LAB</h1>
                    <p className="text-gray-600 text-sm">컨테이너 관리 시스템</p>
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="userPw" className="block text-sm font-medium text-gray-700 mb-2">
                                비밀번호
                            </label>
                            <input
                                id="userPw"
                                type="userPw"
                                placeholder="비밀번호를 입력하세요"
                                value={userPw}
                                onChange={(e) => setuserPw(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
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
                        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        로그인
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;