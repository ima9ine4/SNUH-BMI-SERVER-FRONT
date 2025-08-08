import {useState} from 'react';
import Select from 'react-select';

const NewVolumeModal = ({ onClose, onSubmit, userOptions }) => {
    const [volumeName, setVolumename] = useState('');
    const [absolutePath, setAbsolutePath] = useState('');
    const [readwrite, setReadwrite] = useState('1');
    const [loading, setLoading] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [error, setError] = useState("");

    const handleSubmit = () => {
        if (!volumeName.trim() || !absolutePath.trim()) {
           setError("볼륨 이름과 절대 경로를 모두 입력해주세요.");
            return;
        }
        
        setError(""); // 에러 초기화
        onSubmit({
            vol_name: volumeName.trim(),
            abs_path: absolutePath.trim(),
            readwrite: readwrite,
            users: selectedUsers,
        })
    };
  
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div
                className="overflow-y-auto bg-white rounded-xl px-10 py-8 max-h-[80vh] w-[600px] shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-blue-700 mb-6">새 볼륨 생성</h2>

                <form onSubmit={handleSubmit} className='px-2'>
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-700'>
                                볼륨 이름 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type='text'
                                value={volumeName}
                                onChange={(e) => setVolumename(e.target.value)}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-transparent'
                                placeholder='예: my-volume'
                                disabled={loading}
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-700'>
                                절대 경로 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type='text'
                                value={absolutePath}
                                onChange={(e) => setAbsolutePath(e.target.value)}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-transparent'
                                placeholder='예: /nas2/bmi'
                                disabled={loading}
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-700'>
                                권한 <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={readwrite}
                                onChange={(e) => setReadwrite(e.target.value)}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-transparent'
                                placeholder='예: my-volume'
                                disabled={loading}
                            >
                                <option value={1}>readwrite</option>
                                <option value={0}>readonly</option>
                            </select>
                        </div>
                        <div className='space-y-2'>
                            <label className='block text-sm font-medium text-gray-700'>
                                사용자 선택
                            </label>
                            <Select
                                isMulti
                                name="users"
                                menuPortalTarget={document.body}
                                styles={{
                                    menuPortal: (base) => ({ ...base, zIndex: 9999})
                                }
                                }
                                value={selectedUsers.map(u => ({ value: u, label: u }))}
                                options={userOptions}
                                onChange={selectedOptions => {
                                    const selected = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
                                    setSelectedUsers(selected);
                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                isDisabled={loading}
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