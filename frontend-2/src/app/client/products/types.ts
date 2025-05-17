export interface ProductFormValues {
  productType: string;
  description: string;
  inventoryCount: string;
  price: string;
}

export interface ProductDataResponse {
  ProductID: number;
  ProductType: string;
  Description: string;
  InventoryCount: string;
  Price: string;
}

export const defaultProductFormValues = {
  productType: "",
  description: "",
  inventoryCount: "",
  price: "",
};

export type ProductProps = {
  data: {
    [key: string]: string;
  };
  modifyRecord?: boolean;
  productId?: number;
};

export type ProductsList = {
  data: ProductDataResponse[];
};
