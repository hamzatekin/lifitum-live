import { useCustomer } from "autumn-js/react";

export function useIsPro(): { isPro: boolean; isLoading: boolean } {
  const { customer } = useCustomer();

  const isLoading = customer === undefined;

  const isPro =
    customer?.products?.some((product: any) => product.product_id === "pro" && product.status === "active") ?? false;

  return {
    isPro,
    isLoading,
  };
}
