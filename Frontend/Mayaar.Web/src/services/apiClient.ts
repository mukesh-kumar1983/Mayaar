import axios from "axios";

export const apiClient = axios.create({
    baseURL: "https://localhost:7228/api",
    headers: {
        "Content-Type": "application/json",
    },
});