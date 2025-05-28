import axios from 'axios';

export const getBestAvailablePlayers = async () => {
    const response = await axios.get('http://localhost:8000/view-players');
    return response.data;
};
