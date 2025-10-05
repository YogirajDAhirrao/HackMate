import { io } from "socket.io-client";

const development = import.meta.env.DEV || import.meta.env.DEVELOPMENT;

const SOCKET_URL = development
  ? "http://localhost:5000"
  : import.meta.env.VITE_API_URL;

const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true, // Required if backend sets cookies
});

export default socket;
