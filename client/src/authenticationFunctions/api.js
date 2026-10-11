import axios from 'axios';
import { auth } from '../firebase';

const serverUrl = (import.meta.env.VITE_SERVER_URL || 'https://historia-backend-ycj7.onrender.com').replace(/\/$/, '');

export async function postAuthenticated(path, data) {
  if (!path.startsWith('/api/')) throw new Error('Expected a relative API path.');
  if (!auth) throw new Error('Account access is currently unavailable.');
  await auth.authStateReady();
  const user = auth.currentUser;
  if (!user) throw new Error('Please log in to continue.');
  // Firebase refreshes expired ID tokens. Do not cache or persist tokens here.
  const token = await user.getIdToken();
  return axios.post(`${serverUrl}${path}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
