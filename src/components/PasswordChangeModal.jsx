import React, {useState} from "react";

const PasswordChangeModal = ({ onClose, onSubmit, user }) => {
    const [ currentPW, setCurrentPW ] = useState("");
    const [ newPW, setNewPW ] = useState("");
    const [ newPWCheck, setNewPWCheck ] = useState("");
    const [ error, setError ] = useState("");
    
    const handleSubmit = () => {
        if(currentPW === ""){
            setError("현재 비밀번호를 입력해 주세요.");
            return;
        }
        if(newPW === ""){
            setError("새 비밀번호를 입력해 주세요.");
            return;
        }
        if(newPWCheck === ""){
            setError("새 비밀번호 확인 란을 입력해 주세요.");
            return;
        }
        if(currentPW !== user.userPW){
            setError('현재 비밀번호가 일치하지 않습니다.');
            return;
        }
        if(newPW !== newPWCheck){
            setError('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;
        }

        setError("");

        try{
            onSubmit(newPW);
        } catch (err) {
            setError("비밀번호 변경에 실패했습니다.");
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="overflow-y-auto bg-white rounded-2xl px-10 py-8 max-h-[80vh] w-[600px] shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-blue-700 mb-6">비밀번호 변경</h2>
                <div className="mb-4">
                    <label htmlFor="userPW" className="block text-sm font-medium text-gray-700 mb-1">
                        현재 비밀번호
                    </label>
                    <input
                        id="userPW"
                        type="password"
                        placeholder="현재 비밀번호를 입력하세요"
                        value={currentPW}
                        onChange={(e) => setCurrentPW(e.target.value)}
                        className="mb-4 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 disabled:bg-gray-50"
                    />
                    <label htmlFor="userPW" className="block text-sm font-medium text-gray-700 mb-1">
                        새 비밀번호
                    </label>
                    <input
                        id="userPW"
                        type="password"
                        placeholder="변경할 비밀번호를 입력하세요"
                        value={newPW}
                        onChange={(e) => setNewPW(e.target.value)}
                        className="mb-4 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 disabled:bg-gray-50"
                    />
                    <div>
                        <label htmlFor="userPW" className="block text-sm font-medium text-gray-700 mb-1">
                            새 비밀번호 확인
                        </label>
                        <input
                            id="userPW"
                            type="password"
                            placeholder="변경할 비밀번호를 한번 더 입력하세요"
                            value={newPWCheck}
                            onChange={(e) => setNewPWCheck(e.target.value)}
                            className="mb-4 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 disabled:bg-gray-50"
                        />
                    </div>
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={onClose} className="text-sm px-5 py-2 rounded bg-gray-100 hover:bg-gray-200">
                        취소
                    </button>
                    <button onClick={handleSubmit} className="text-sm px-5 py-2 text-white rounded bg-blue-600 hover:bg-blue-700">
                        변경하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PasswordChangeModal;
