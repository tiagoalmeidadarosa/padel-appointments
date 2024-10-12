"use client";
import { ProductService } from "@/services/product";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Product } from "@/shared/interfaces";
import { Spin } from "antd";

export default function ProductsView() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setIsLoading(true);
    ProductService.getProducts()
      .then((response: AxiosResponse<Product[]>) => {
        setProducts(response.data);
      })
      .catch((err) => {
        console.log(err);
        setProducts([] as Product[]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      {isLoading && <Spin style={{ marginTop: "1rem" }} />}
      {!isLoading && (
        <>
          {products.map((product) => (
            <div key={product.id}>
              <p>{product.name}</p>
            </div>
          ))}
        </>
      )}
    </>
  );
}
