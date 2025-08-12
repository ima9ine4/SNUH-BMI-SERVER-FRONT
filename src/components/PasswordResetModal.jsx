import {useState} from "react";

const PasswordChangeModal = ({ onClose, onSubmit, user }) => {
    const [ userId, setuserId ] = useState("");
    const [ error, setError ] = useState("");
    
    const handleSubmit = () => {
        if(userId === ""){
            setError("아이디를 입력해 주세요.");
            return;
        }
        setError("");
        try{
            onSubmit(userId);
        } catch (err) {
            setError("비밀번호 초기화에 실패했습니다. 다시 시도해주세요.");
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
                <h2 className="text-xl font-bold text-blue-700 mb-6">비밀번호 초기화</h2>
                <div class="mb-4">
                    <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                        아이디 <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="userId"
                        placeholder="아이디를 입력하세요"
                        value={userId}
                        onChange={(e) => setuserId(e.target.value)}
                        className="mb-4 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 disabled:bg-gray-50"
                    />
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
                        초기화하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PasswordChangeModal;
