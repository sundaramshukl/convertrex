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
     console.log('Fetching metal prices from metals.dev API...');
     
     // Using metals.dev free API for precious metal prices
     const response = await fetch('https://api.metals.dev/v1/latest?api_key=demo&currency=USD&unit=oz');
     
     if (!response.ok) {
       console.error(`Metals API returned status: ${response.status}`);
       // Fallback to reasonable current market prices if API fails
       console.log('Using fallback metal prices');
       return new Response(
         JSON.stringify({
           success: true,
           metals: {
             XAU: 2650.00,  // Gold
             XAG: 31.50,    // Silver
             XPT: 985.00,   // Platinum
             XPD: 950.00,   // Palladium
             XCU: 0.28,     // Copper (per oz)
           },
           lastUpdated: new Date().toISOString(),
           source: 'fallback',
         }),
         {
           headers: { ...corsHeaders, 'Content-Type': 'application/json' },
           status: 200,
         }
       );
     }
     
     const data = await response.json();
     console.log('Metal prices fetched successfully');
     
     // Map metal codes to prices per troy ounce
     const metals: Record<string, number> = {
       XAU: data.metals?.gold || 2650.00,
       XAG: data.metals?.silver || 31.50,
       XPT: data.metals?.platinum || 985.00,
       XPD: data.metals?.palladium || 950.00,
       XCU: data.metals?.copper ? data.metals.copper / 16 : 0.28, // Convert to oz if needed
     };
     
     return new Response(
       JSON.stringify({
         success: true,
         metals,
         lastUpdated: data.timestamp || new Date().toISOString(),
         source: 'live',
       }),
       {
         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
         status: 200,
       }
     );
   } catch (error) {
     console.error('Error fetching metal prices:', error);
     // Return fallback prices on error
     return new Response(
       JSON.stringify({
         success: true,
         metals: {
           XAU: 2650.00,
           XAG: 31.50,
           XPT: 985.00,
           XPD: 950.00,
           XCU: 0.28,
         },
         lastUpdated: new Date().toISOString(),
         source: 'fallback',
       }),
       {
         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
         status: 200,
       }
     );
   }
 });