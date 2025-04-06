import { apiCaller } from "./utils";

const apiBaseURL = import.meta.env.VITE_API_BASE_URL; 

export const fetchGraphNodes = async () => {
  return apiCaller(`${apiBaseURL}api/gemini/conv`);
};
