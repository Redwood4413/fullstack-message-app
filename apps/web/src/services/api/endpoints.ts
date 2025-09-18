const modules = {
  AUTH: '/auth',
  USER: '/user',
  CHAT: '/chat',
};

export const AUTH_SIGNUP = `${modules.AUTH}/signup`;
export const AUTH_SIGNIN = `${modules.AUTH}/signin`;
export const AUTH_GET_PROFILE = `${modules.AUTH}/profile`;
export const AUTH_REFRESH = `${modules.AUTH}/refresh`;

export const CHAT_CREATE = `${modules.CHAT}/create`;
export const CHATS_GET = `${modules.CHAT}/get`;
export const CHAT_JOIN_VIA_CODE = `${modules.CHAT}/join`;
