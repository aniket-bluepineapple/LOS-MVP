import ProductsForm from "@/app/client/products/product-form";
import { BACKEND_URL } from "@/constants/layout";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductUpdatePage({ params }: PageProps) {
  const { slug } = await params;

  try {
    const res = await fetch(`${BACKEND_URL}/api/products/${slug}`, {
      method: "GET",
      mode: "cors",
    });

    if (!res.ok) {
      return notFound();
    }

    const data = await res.json();

    return (
      <ProductsForm data={data} modifyRecord={true} productId={Number(slug)} />
    );
  } catch (error) {
    console.log("Error fetching product:", error);
    return notFound();
  }
}
