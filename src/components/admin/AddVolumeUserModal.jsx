import {useState} from 'react';
import Select from 'react-select';

const AddVolumeUserModal = ({ onClose, onSubmit, userOptions }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState('');
    const [error, setError] = useState("");

    const handleSubmit = () => {
        if (!selectedUser) {
            setError("사용자를 선택해주세요.");
            return;
        }
        setError("");
        onSubmit(selectedUser.value);
    };
  
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div
                className="overflow-y-auto bg-white rounded-xl px-10 py-8 max-h-[80vh] w-[600px] shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-blue-700 mb-6">볼륨 사용자 추가</h2>
                <div className="space-y-4 px-2">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            사용자 선택
                        </label>
                        <Select
                            name="user"
                            value={selectedUser}
                            options={userOptions}
                            onChange={setSelectedUser}
                            isDisabled={loading}
                            placeholder="사용자를 선택하세요"
                            menuPortalTarget={document.body}
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                        />
                    </div>
                </div>
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

export default AddVolumeUserModal;