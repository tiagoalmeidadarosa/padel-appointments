import { httpClient } from "@/httpClient";

export class LoginService {
  static login(username: string, password: string) {
    return httpClient.post(`/login`, { username, password });
  }
}
