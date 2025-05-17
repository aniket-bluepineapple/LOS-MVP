"use client";

import { FunctionComponent } from "react";
import { ProductDataResponse, ProductsList } from "./types";

const ProductsLandingPage: FunctionComponent<ProductsList> = ({ data }) => {
  function formatIndianDigits(num: number) {
    return new Intl.NumberFormat("en-IN").format(num);
  }

  return (
    <div className="relative flex w-full flex-col items-center">
      <div className="mx-2 mt-10 flex h-16 w-[90%] max-w-7xl items-center rounded-2xl border-2 border-[#cadcfc] p-6 text-lg font-semibold shadow-lg md:mx-10">
        <div className="w-[20%]">Type</div>
        <div className="w-[30%]">Description</div>
        <div className="w-[20%]">Total Count</div>
        <div className="w-[10%]">Price</div>
      </div>
      {data?.map((product: ProductDataResponse) => (
        <div
          key={product.ProductID}
          className="mx-2 mt-2 flex w-[90%] max-w-7xl items-center rounded-lg bg-blue-100 p-4 text-base font-normal md:mx-10"
        >
          <div className="basis-[20%]">{product.ProductType}</div>{" "}
          <div className="basis-[30%]">{product.Description}</div>
          <div className="basis-[20%]">{product.InventoryCount}</div>
          <div className="basis-[10%]">
            {formatIndianDigits(Number(product.Price))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsLandingPage;
