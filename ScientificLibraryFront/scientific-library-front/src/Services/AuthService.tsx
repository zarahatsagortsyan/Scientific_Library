import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";
import { UserProfileToken } from "../Models/UserProfileToken";

const api = "http://localhost:8001/api/";

export const loginAPI = async (email: string, password: string) => {
  try {
    const data = await axios.post<UserProfileToken>(api + "Auth/login", {
      email: email,
      password: password,
    });

    return data;
  } catch (error) {
    handleError(error);
  }
};

export const registerReaderAPI = async (email: string, password: string) => {
  try {
    const data = await axios.post<UserProfileToken>(
      api + "Auth/register/reader",
      {
        email: email,
        password: password,
      }
    );

    return data;
  } catch (error) {
    handleError(error);
  }
};
