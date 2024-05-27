import axios from 'axios';
import axiosInstance from './axiosInstance';


export const logToTerminal = async (message) => {
  try {
    await axios.post('http://localhost:3001/log', { message });
  } catch (error) {
    console.error('Error logging to terminal:', error);
  }
};

// export const callStarted = async (userEmail) => {
//   try {
//     const res = await axios.post('http://localhost:3001/start-session', {
//       email: userEmail
//     });
//     return res;
//   } catch (error) {
//     console.error('Error in starting the session:', error);
//   }
// }

export const callStarted = async (userEmail) => {
  try {
    const res = await axiosInstance.post('/start-session', {
      email: userEmail
    });
    return res;
  } catch (error) {
    console.error('Error in starting the session:', error);
  }
}

export const callEnded = async (userEmail, sessionId) => {
  try {
    const res = await axiosInstance.post('/end-session', {
      email: userEmail,
      sessionId
    });
    return res;
  } catch (error) {
    console.error('Error in ending the session:', error);
  }
}

export const registerUser = async (userEmail) => {
  try {
    const res = await axiosInstance.post('/register',{
      email: userEmail,
      role: 'user'
    });
    return res;
  } catch (error) {
    console.error('Error registering user:', error);
  }
}

