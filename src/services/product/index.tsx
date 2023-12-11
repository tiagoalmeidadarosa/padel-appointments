import { httpClient } from "@/httpClient";
import { Product } from "../../shared/interfaces";

export class ProductService {
  static getProducts() {
    return httpClient.get<Product[]>(`/products`);
  }
}
