import downloadDummyData from '../data/dummyDownloadData.json';

export const getDownloadList = () => {
    return new Promise((resolve) => {
        resolve({ data: downloadDummyData }); 
    });
    // return axios.get(`${BASE_URL}/api/`)
}