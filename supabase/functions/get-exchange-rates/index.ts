 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 
 const corsHeaders = {
   'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
 };
 
 serve(async (req) => {
   // Handle CORS preflight requests
   if (req.method === 'OPTIONS') {
     return new Response('ok', { headers: corsHeaders });
   }
 
   try {
     console.log('Fetching exchange rates from Open Exchange Rates API...');
     
     // Using exchangerate-api.com free tier (no API key required for basic rates)
     const response = await fetch('https://open.er-api.com/v6/latest/USD');
     
     if (!response.ok) {
       console.error(`Exchange rate API returned status: ${response.status}`);
       throw new Error(`Failed to fetch exchange rates: ${response.status}`);
     }
     
     const data = await response.json();
     console.log('Exchange rates fetched successfully:', Object.keys(data.rates).length, 'currencies');
     
     // Extract only the currencies we need
     const targetCurrencies = [
       'USD', 'EUR', 'GBP', 'JPY', 'INR', 'AUD', 'CAD', 'CHF', 'CNY', 'KRW',
       'SGD', 'HKD', 'NZD', 'SEK', 'MXN', 'BRL', 'ZAR', 'RUB', 'AED', 'SAR'
     ];
     
     const rates: Record<string, number> = {};
     for (const currency of targetCurrencies) {
       if (data.rates[currency]) {
         rates[currency] = data.rates[currency];
       }
     }
     
     return new Response(
       JSON.stringify({
         success: true,
         base: 'USD',
         rates,
         lastUpdated: data.time_last_update_utc || new Date().toISOString(),
       }),
       {
         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
         status: 200,
       }
     );
   } catch (error) {
     console.error('Error fetching exchange rates:', error);
     return new Response(
       JSON.stringify({
         success: false,
         error: error instanceof Error ? error.message : 'Unknown error',
       }),
       {
         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
         status: 500,
       }
     );
   }
 });