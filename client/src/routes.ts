import { apiCaller } from "./utils";

export const apiBaseURL = import.meta.env.VITE_API_BASE_URL; 
export const chatBaseURL = `${import.meta.env.VITE_API_BASE_URL}api/gemini/chat`

export const fetchGraphNodes = async () => {
  return apiCaller(`${apiBaseURL}api/gemini/conv`);
};
