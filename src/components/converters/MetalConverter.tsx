 import { useState, useMemo } from "react";
 import { motion } from "framer-motion";
 import { ArrowDownUp, Gem } from "lucide-react";
 import { Input } from "@/components/ui/input";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import { Button } from "@/components/ui/button";
 import { Skeleton } from "@/components/ui/skeleton";
 import { RefreshCw, Wifi, WifiOff } from "lucide-react";
 import { useMetalPrices } from "@/hooks/useMetalPrices";
 import { useExchangeRates } from "@/hooks/useExchangeRates";
 
 const metalMeta = [
   { code: "XAU", name: "Gold", emoji: "🥇" },
   { code: "XAG", name: "Silver", emoji: "🥈" },
   { code: "XPT", name: "Platinum", emoji: "⚪" },
   { code: "XPD", name: "Palladium", emoji: "🔘" },
   { code: "XCU", name: "Copper", emoji: "🟤" },
 ];
 
 const currencyMeta = [
   { code: "USD", symbol: "$" },
   { code: "EUR", symbol: "€" },
   { code: "GBP", symbol: "£" },
   { code: "JPY", symbol: "¥" },
   { code: "INR", symbol: "₹" },
   { code: "CHF", symbol: "Fr" },
   { code: "AUD", symbol: "A$" },
   { code: "CAD", symbol: "C$" },
 ];
 
 // Fallback prices in USD per troy ounce
 const fallbackMetalPrices: Record<string, number> = {
   XAU: 2650.00,
   XAG: 31.50,
   XPT: 985.00,
   XPD: 950.00,
   XCU: 0.28,
 };
 
 // Fallback exchange rates
 const fallbackRates: Record<string, number> = {
   USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5,
   INR: 83.12, CHF: 0.88, AUD: 1.53, CAD: 1.36,
 };
 
 const weightUnits = [
   { code: "oz", name: "Troy Ounce", factor: 1 },
   { code: "g", name: "Gram", factor: 0.0321507 },
   { code: "kg", name: "Kilogram", factor: 32.1507 },
   { code: "lb", name: "Pound", factor: 14.5833 },
   { code: "tola", name: "Tola", factor: 0.375 },
 ];
 
 export const MetalConverter = () => {
   const [metal, setMetal] = useState("XAU");
   const [weight, setWeight] = useState<string>("1");
   const [weightUnit, setWeightUnit] = useState("oz");
   const [currency, setCurrency] = useState("USD");
 
   const { data: metalData, isLoading: metalsLoading, refetch: refetchMetals, isFetching: metalsFetching } = useMetalPrices();
   const { data: ratesData, isLoading: ratesLoading, refetch: refetchRates, isFetching: ratesFetching } = useExchangeRates();
 
   const metalPrices = useMemo(() => {
     if (metalData?.success && metalData.metals) {
       return metalData.metals;
     }
     return fallbackMetalPrices;
   }, [metalData]);
 
   const exchangeRates = useMemo(() => {
     if (ratesData?.success && ratesData.rates) {
       return ratesData.rates;
     }
     return fallbackRates;
   }, [ratesData]);
 
   const isLive = metalData?.source === 'live' || ratesData?.success;
   const isLoading = metalsLoading || ratesLoading;
   const isFetching = metalsFetching || ratesFetching;
 
   const lastUpdated = useMemo(() => {
     if (metalData?.lastUpdated) {
       const date = new Date(metalData.lastUpdated);
       return date.toLocaleString();
     }
     return null;
   }, [metalData]);
 
   const handleRefresh = () => {
     refetchMetals();
     refetchRates();
   };
 
   const calculatePrice = (): number => {
     const unitData = weightUnits.find((u) => u.code === weightUnit);
 
     if (!unitData) return 0;
 
     const pricePerOz = metalPrices[metal] || 0;
     const rate = exchangeRates[currency] || 1;
 
     const weightInOz = (parseFloat(weight) || 0) * unitData.factor;
     const priceInUsd = weightInOz * pricePerOz;
     return priceInUsd * rate;
   };
 
   const result = calculatePrice();
   const currencyInfo = currencyMeta.find((c) => c.code === currency);
   const metalInfo = metalMeta.find((m) => m.code === metal);
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.5, delay: 0.2 }}
       className="converter-card glow-metals"
     >
       <div className="flex items-center gap-3 mb-6">
         <div className="p-2.5 rounded-xl bg-gradient-metals">
           <Gem className="w-5 h-5 text-background" />
         </div>
         <h2 className="text-xl font-display font-semibold text-gradient-metals">
           Metal Price Calculator
         </h2>
         <Button
           variant="ghost"
           size="sm"
           onClick={handleRefresh}
           disabled={isFetching}
           className="ml-auto"
         >
           <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
         </Button>
       </div>
 
       {/* Live rate indicator */}
       <div className="flex items-center gap-2 mb-4 text-xs">
         {isLive ? (
           <span className="flex items-center gap-1 text-emerald-500">
             <Wifi className="w-3 h-3" />
             Live prices
           </span>
         ) : (
           <span className="flex items-center gap-1 text-amber-500">
             <WifiOff className="w-3 h-3" />
             Offline prices
           </span>
         )}
         {lastUpdated && (
           <span className="text-muted-foreground">
             Updated: {lastUpdated}
           </span>
         )}
       </div>
 
       <div className="space-y-4">
         <div className="grid grid-cols-2 gap-3">
           <div className="space-y-2">
             <label className="text-sm text-muted-foreground">Metal</label>
             <Select value={metal} onValueChange={setMetal}>
               <SelectTrigger className="h-14 bg-muted border-border rounded-xl">
                 <SelectValue />
               </SelectTrigger>
               <SelectContent>
                 {metalMeta.map((m) => (
                   <SelectItem key={m.code} value={m.code}>
                     <span className="mr-2">{m.emoji}</span>
                     <span className="font-medium">{m.name}</span>
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
 
           <div className="space-y-2">
             <label className="text-sm text-muted-foreground">Currency</label>
             <Select value={currency} onValueChange={setCurrency}>
               <SelectTrigger className="h-14 bg-muted border-border rounded-xl">
                 <SelectValue />
               </SelectTrigger>
               <SelectContent>
                 {currencyMeta.map((c) => (
                   <SelectItem key={c.code} value={c.code}>
                     <span className="font-medium">{c.symbol}</span>
                     <span className="text-muted-foreground ml-2 text-sm">
                       {c.code}
                     </span>
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
         </div>
 
         <div className="grid grid-cols-2 gap-3">
           <div className="space-y-2">
             <label className="text-sm text-muted-foreground">Weight</label>
             <Input
               type="number"
               value={weight}
               onChange={(e) => setWeight(e.target.value)}
               className="input-converter"
               placeholder="Enter weight"
             />
           </div>
 
           <div className="space-y-2">
             <label className="text-sm text-muted-foreground">Unit</label>
             <Select value={weightUnit} onValueChange={setWeightUnit}>
               <SelectTrigger className="h-14 bg-muted border-border rounded-xl">
                 <SelectValue />
               </SelectTrigger>
               <SelectContent>
                 {weightUnits.map((unit) => (
                   <SelectItem key={unit.code} value={unit.code}>
                     <span className="font-medium">{unit.code}</span>
                     <span className="text-muted-foreground ml-2 text-sm">
                       {unit.name}
                     </span>
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
         </div>
 
         {isLoading ? (
           <div className="mt-6 p-5 rounded-xl bg-muted/50 border border-metals/20">
             <Skeleton className="h-4 w-32 mb-2" />
             <Skeleton className="h-10 w-48 mb-2" />
             <Skeleton className="h-4 w-40" />
           </div>
         ) : (
           <motion.div
           key={`${metal}-${weight}-${weightUnit}-${currency}`}
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="mt-6 p-5 rounded-xl bg-muted/50 border border-metals/20"
         >
           <p className="text-sm text-muted-foreground mb-1">
             {metalInfo?.emoji} {metalInfo?.name} Value
           </p>
           <p className="text-3xl font-display font-bold text-metals">
             {currencyInfo?.symbol}
             {result.toLocaleString(undefined, {
               minimumFractionDigits: 2,
               maximumFractionDigits: 2,
             })}
           </p>
           <p className="text-sm text-muted-foreground mt-2">
             1 oz = {currencyInfo?.symbol}
             {(
               (metalPrices[metal] || 0) * (exchangeRates[currency] || 1)
             ).toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
             {currency}
           </p>
         </motion.div>
         )}
 
         <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 mt-4">
           {metalMeta.map((m) => {
             const pricePerOz = metalPrices[m.code] || 0;
             const rate = exchangeRates[currency] || 1;
             const price = pricePerOz * rate;
             return (
               <motion.div
                 key={m.code}
                 whileHover={{ scale: 1.02 }}
                 onClick={() => setMetal(m.code)}
                 className={`p-3 rounded-xl cursor-pointer transition-all ${
                   metal === m.code
                     ? "bg-metals/20 border border-metals/40"
                     : "bg-muted/30 border border-transparent hover:border-metals/20"
                 }`}
               >
                 <p className="text-xs text-muted-foreground flex items-center gap-1">
                   {m.emoji} {m.name}
                 </p>
                 <p className="text-sm font-semibold">
                   {currencyInfo?.symbol}
                   {price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                 </p>
               </motion.div>
             );
           })}
         </div>
       </div>
     </motion.div>
   );
 };