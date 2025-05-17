import { notFound } from "next/navigation";
import { BACKEND_URL } from "@/constants/layout";
import ProductsLandingPage from "../client/products";

export default async function ProductsListPage() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products/`, {
      method: "GET",
      mode: "cors",
    });

    const data = await res.json();

    console.log("data", data);

    return <ProductsLandingPage data={data} />;
  } catch (error) {
    console.log("Error fetching product:", error);
    return notFound();
  }
}
