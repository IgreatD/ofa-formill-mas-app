import http from "@/utils/request";

class AuthApi {
  static login(data) {
    return http.post("/login", data);
  }
}

export default AuthApi;
