 import { useQuery } from "@tanstack/react-query";
 import { supabase } from "@/integrations/supabase/client";
 
 interface ExchangeRatesResponse {
   success: boolean;
   base: string;
   rates: Record<string, number>;
   lastUpdated: string;
   error?: string;
 }
 
 export const useExchangeRates = () => {
   return useQuery({
     queryKey: ["exchange-rates"],
     queryFn: async (): Promise<ExchangeRatesResponse> => {
       console.log("Fetching live exchange rates...");
       
       const { data, error } = await supabase.functions.invoke("get-exchange-rates");
       
       if (error) {
         console.error("Error fetching exchange rates:", error);
         throw error;
       }
       
       return data as ExchangeRatesResponse;
     },
     staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
     refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
     retry: 2,
   });
 };