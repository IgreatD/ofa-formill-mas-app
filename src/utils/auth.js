import { TOKEN_KEY } from "@/enums/CacheEnum";

export const getToken = () => {
  return sessionStorage.getItem(TOKEN_KEY);
};
