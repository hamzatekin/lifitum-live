import { useCustomer } from "autumn-js/react";

export function useIsPro(): boolean {
  const { customer } = useCustomer();

  return (
    customer?.products?.some((product: any) => product.product_id === "pro" && product.status === "active") ?? false
  );
}
