"use client";

import { FunctionComponent, useState } from "react";
import { ProductDataResponse, ProductsList } from "./types";
import Link from "next/link";
import { BACKEND_URL } from "@/constants/layout";

const ProductsLandingPage: FunctionComponent<ProductsList> = ({ data }) => {
  const [products, setProducts] = useState<ProductDataResponse[]>(data ?? []);

  function formatIndianDigits(num: number) {
    return new Intl.NumberFormat("en-IN").format(num);
  }

  const handleDelete = async (productId: number) => {
    setProducts((prev) => prev.filter((p) => p.ProductID !== productId));

    const productResponse = await fetch(
      `${BACKEND_URL}/api/products/${productId}`,
      {
        method: "DELETE",
        mode: "cors",
      },
    );

    if (!productResponse.ok) throw new Error("Error " + productResponse.status);
  };

  return (
    <div className="relative flex w-full flex-col items-center">
      <div className="mx-2 mt-10 flex h-16 w-[90%] max-w-7xl items-center rounded-2xl border-2 border-[#cadcfc] p-6 text-lg font-semibold shadow-lg md:mx-10">
        <div className="w-[20%]">Type</div>
        <div className="w-[30%]">Description</div>
        <div className="w-[20%]">Total Count</div>
        <div className="w-[10%]">Price</div>
        <div className="flex w-[20%] justify-center">
          <Link
            href="products/add-product"
            className="flex h-full w-[80%] justify-center rounded-xl border bg-[#00246b] p-2 text-[#cadcfc] hover:border-[#00246b] hover:bg-[#cadcfc] hover:text-[#00246b]"
          >
            Add Product
          </Link>
        </div>
      </div>
      {products?.map((product: ProductDataResponse) => (
        <div
          key={product.ProductID}
          className="mx-2 mt-2 flex w-[90%] max-w-7xl items-center rounded-lg bg-blue-100 px-4 py-2 text-base font-normal md:mx-10"
        >
          <div className="basis-[20%]">{product.ProductType}</div>{" "}
          <div className="basis-[30%]">{product.Description}</div>
          <div className="basis-[20%]">{product.InventoryCount}</div>
          <div className="basis-[10%]">
            {formatIndianDigits(Number(product.Price))}
          </div>
          <div className="flex w-[15%] justify-center">
            <Link
              href={`/products/${product.ProductID}`}
              className="flex h-full w-[80%] justify-center rounded-xl border bg-[#00246b] p-2 text-[#cadcfc] hover:border-[#00246b] hover:bg-[#cadcfc] hover:text-[#00246b]"
            >
              Update
            </Link>
          </div>
          <div className="flex w-[5%] justify-center">
            <button
              onClick={() => handleDelete(product.ProductID)}
              className="flex items-center justify-center"
              aria-label="Delete product"
            >
              {/* Delete icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 hover:stroke-red-600"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsLandingPage;
