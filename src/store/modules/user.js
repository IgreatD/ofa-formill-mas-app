import AuthApi from "@/apis/login";
import { TOKEN_KEY } from "@/enums/CacheEnum";

export const useUserStore = defineStore("user", () => {
  const isLogin = computed(() => {
    return !!sessionStorage.getItem(TOKEN_KEY);
  });

  const roles = ref([]);

  const readRole = computed(() => {
    return roles.value.includes("REPORT_READ");
  });

  const writeRole = computed(() => {
    console.log(roles.value.includes("WRITE"));
    return roles.value.includes("WRITE");
  });

  const login = () => {
    return new Promise((resolve, reject) => {
      AuthApi.login()
        .then((res) => {
          const data = res.data.data;
          roles.value = data.roles;
          sessionStorage.setItem(TOKEN_KEY, data.token);
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  return {
    readRole,
    writeRole,
    roles,
    isLogin,
    login,
  };
});

export function useUserStoreHook() {
  return useUserStore(store);
}
