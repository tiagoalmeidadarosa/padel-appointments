import { httpClient } from "@/httpClient";

export class AuthService {
  static login(username: string, password: string) {
    return httpClient.post(`/auth/login`, { username, password });
  }
}
