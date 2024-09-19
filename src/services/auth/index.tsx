import { httpClient } from "@/httpClient";

export class AuthService {
  static login(username: string, password: string) {
    return httpClient.post(`/api/auth/login`, { username, password });
  }
}
