import axios from 'axios';

const BASE_URL = "http://localhost:8000"

export const viewPlayers = async () => {
    const response = await axios.get(`${BASE_URL}/view-players`);
    return response.data;
};

export const draftPlayer = async (playerName: string) => {
    console.log(`${BASE_URL}/draft/${encodeURIComponent(playerName)}`);
    const response = await axios.post(`${BASE_URL}/draft/${encodeURIComponent(playerName)}`);
    return response.data;
};

export const excludePlayer = async (playerName: string) => {
    console.log(`${BASE_URL}/draft/${encodeURIComponent(playerName)}`);
    const response = await axios.post(`${BASE_URL}/exclude/${encodeURIComponent(playerName)}`);
    return response.data;
};
