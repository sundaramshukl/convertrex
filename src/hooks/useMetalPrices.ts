 import { useQuery } from "@tanstack/react-query";
 import { supabase } from "@/integrations/supabase/client";
 
 interface MetalPricesResponse {
   success: boolean;
   metals: Record<string, number>;
   lastUpdated: string;
   source: "live" | "fallback";
   error?: string;
 }
 
 export const useMetalPrices = () => {
   return useQuery({
     queryKey: ["metal-prices"],
     queryFn: async (): Promise<MetalPricesResponse> => {
       console.log("Fetching live metal prices...");
       
       const { data, error } = await supabase.functions.invoke("get-metal-prices");
       
       if (error) {
         console.error("Error fetching metal prices:", error);
         throw error;
       }
       
       return data as MetalPricesResponse;
     },
     staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
     refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
     retry: 2,
   });
 };