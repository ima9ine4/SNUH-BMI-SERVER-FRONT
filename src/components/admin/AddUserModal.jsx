import {useState} from 'react';

const NewVolumeModal = ({ onClose, onSubmit }) => {
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [userPassword, setUserPassword] = useState('test1234');
    const [loading, setLoading] = useState('');
    const [error, setError] = useState("");

    const handleSubmit = () => {
        if (!userId.trim() || !userName.trim() || !userPassword.trim()) {
           setError("사용자 ID와 사용자 이름, 비밀번호를 모두 입력해주세요.");
            return;
        }
        
        setError(""); // 에러 초기화
        onSubmit({
            user_id: userId.trim(),
            user_name: userName.trim(),
            user_password: userPassword.trim()
        })
    };
  
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div
                className="overflow-y-auto bg-white rounded-xl px-10 py-8 max-h-[80vh] w-[600px] shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-blue-700 mb-6">새 사용자 생성</h2>

                <form onSubmit={handleSubmit} className='px-2'>
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-700'>
                                사용자 ID <span className="text-red-500">*</span>
                            </label>
                            <input
                                type='text'
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-transparent'
                                placeholder='예: sunahyang_961011'
                                disabled={loading}
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-700'>
                                사용자 이름 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type='text'
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-transparent'
                                placeholder='예: sunahyang'
                                disabled={loading}
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-700'>
                                사용자 비밀번호 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type='text'
                                value={userPassword}
                                onChange={(e) => setUserPassword(e.target.value)}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-transparent'
                                placeholder='예: test123'
                                disabled={loading}
                            />
                        </div>
                    </div>
                </form>
                {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={onClose} className="text-sm px-5 py-2 rounded bg-gray-100 hover:bg-gray-200">
                        취소
                    </button>
                    <button onClick={handleSubmit} className="text-sm px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                        생성하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewVolumeModal;