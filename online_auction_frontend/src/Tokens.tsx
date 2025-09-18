import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './Constants';

export async function refreshAccessToken() {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken) {
        throw new Error("No refresh token available");
    }
    
    const response = await axios.post('http://127.0.0.1:8000/auction/token/refresh/', {
        refresh: refreshToken,
    });
    
    const newAccessToken = response.data.access;
    localStorage.setItem('accessToken', newAccessToken);
    return newAccessToken;
};
    
export async function  getAccessToken() {
    let accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (!accessToken) {
        accessToken = await refreshAccessToken();
    }

    return accessToken;
} 



