 import { useState, useMemo } from "react";
 import { motion } from "framer-motion";
 import { ArrowDownUp, DollarSign } from "lucide-react";
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
 import { Alert, AlertDescription } from "@/components/ui/alert";
 import { RefreshCw, Wifi, WifiOff } from "lucide-react";
 import { useExchangeRates } from "@/hooks/useExchangeRates";
 
 const currencyMeta = [
   { code: "USD", name: "US Dollar", symbol: "$" },
   { code: "EUR", name: "Euro", symbol: "€" },
   { code: "GBP", name: "British Pound", symbol: "£" },
   { code: "JPY", name: "Japanese Yen", symbol: "¥" },
   { code: "INR", name: "Indian Rupee", symbol: "₹" },
   { code: "AUD", name: "Australian Dollar", symbol: "A$" },
   { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
   { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
   { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
   { code: "KRW", name: "South Korean Won", symbol: "₩" },
   { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
   { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
   { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
   { code: "SEK", name: "Swedish Krona", symbol: "kr" },
   { code: "MXN", name: "Mexican Peso", symbol: "$" },
   { code: "BRL", name: "Brazilian Real", symbol: "R$" },
   { code: "ZAR", name: "South African Rand", symbol: "R" },
   { code: "RUB", name: "Russian Ruble", symbol: "₽" },
   { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
   { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
 ];
 
 // Fallback rates in case API fails
 const fallbackRates: Record<string, number> = {
   USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, INR: 83.12,
   AUD: 1.53, CAD: 1.36, CHF: 0.88, CNY: 7.24, KRW: 1320,
   SGD: 1.34, HKD: 7.82, NZD: 1.64, SEK: 10.42, MXN: 17.15,
   BRL: 4.97, ZAR: 18.65, RUB: 89.5, AED: 3.67, SAR: 3.75,
 };
 
 export const CurrencyConverter = () => {
   const [amount, setAmount] = useState<string>("1000");
   const [fromCurrency, setFromCurrency] = useState("USD");
   const [toCurrency, setToCurrency] = useState("EUR");
   const [isSwapping, setIsSwapping] = useState(false);
 
   const { data: ratesData, isLoading, error, refetch, isFetching } = useExchangeRates();
   
   const rates = useMemo(() => {
     if (ratesData?.success && ratesData.rates) {
       return ratesData.rates;
     }
     return fallbackRates;
   }, [ratesData]);
 
   const isLive = ratesData?.success && ratesData.rates;
 
   const lastUpdated = useMemo(() => {
     if (ratesData?.lastUpdated) {
       const date = new Date(ratesData.lastUpdated);
       return date.toLocaleString();
     }
     return null;
   }, [ratesData]);
 
   const convert = (value: number, from: string, to: string): number => {
     const fromRate = rates[from] || 1;
     const toRate = rates[to] || 1;
     return (value / fromRate) * toRate;
   };
 
   const result = convert(parseFloat(amount) || 0, fromCurrency, toCurrency);
   const fromCurrencyData = currencyMeta.find((c) => c.code === fromCurrency);
   const toCurrencyData = currencyMeta.find((c) => c.code === toCurrency);
 
   const handleSwap = () => {
     setIsSwapping(true);
     setTimeout(() => {
       setFromCurrency(toCurrency);
       setToCurrency(fromCurrency);
       setIsSwapping(false);
     }, 150);
   };
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.5 }}
       className="converter-card glow-currency"
     >
       <div className="flex items-center gap-3 mb-6">
         <div className="p-2.5 rounded-xl bg-gradient-currency">
           <DollarSign className="w-5 h-5 text-background" />
         </div>
         <h2 className="text-xl font-display font-semibold text-gradient-currency">
           Currency Converter
         </h2>
         <Button
           variant="ghost"
           size="sm"
           onClick={() => refetch()}
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
             Live rates
           </span>
         ) : (
           <span className="flex items-center gap-1 text-amber-500">
             <WifiOff className="w-3 h-3" />
             Offline rates
           </span>
         )}
         {lastUpdated && (
           <span className="text-muted-foreground">
             Updated: {lastUpdated}
           </span>
         )}
       </div>
 
       <div className="space-y-4">
         <div className="space-y-2">
           <label className="text-sm text-muted-foreground">Amount</label>
           <Input
             type="number"
             value={amount}
             onChange={(e) => setAmount(e.target.value)}
             className="input-converter"
             placeholder="Enter amount"
           />
         </div>
 
         <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-end">
           <div className="space-y-2">
             <label className="text-sm text-muted-foreground">From</label>
             <Select value={fromCurrency} onValueChange={setFromCurrency}>
               <SelectTrigger className="h-14 bg-muted border-border rounded-xl">
                 <SelectValue />
               </SelectTrigger>
               <SelectContent className="max-h-64">
                 {currencyMeta.map((currency) => (
                   <SelectItem key={currency.code} value={currency.code}>
                     <span className="font-medium">{currency.code}</span>
                     <span className="text-muted-foreground ml-2 text-sm">
                       {currency.name}
                     </span>
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
 
           <Button
             variant="ghost"
             size="icon"
             onClick={handleSwap}
             className="h-14 w-14 rounded-xl hover:bg-currency/10 transition-all"
           >
             <motion.div animate={{ rotate: isSwapping ? 180 : 0 }}>
               <ArrowDownUp className="w-5 h-5 text-currency" />
             </motion.div>
           </Button>
 
           <div className="space-y-2">
             <label className="text-sm text-muted-foreground">To</label>
             <Select value={toCurrency} onValueChange={setToCurrency}>
               <SelectTrigger className="h-14 bg-muted border-border rounded-xl">
                 <SelectValue />
               </SelectTrigger>
               <SelectContent className="max-h-64">
                 {currencyMeta.map((currency) => (
                   <SelectItem key={currency.code} value={currency.code}>
                     <span className="font-medium">{currency.code}</span>
                     <span className="text-muted-foreground ml-2 text-sm">
                       {currency.name}
                     </span>
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
         </div>
 
         {isLoading ? (
           <div className="mt-6 p-5 rounded-xl bg-muted/50 border border-currency/20">
             <Skeleton className="h-4 w-32 mb-2" />
             <Skeleton className="h-10 w-48 mb-2" />
             <Skeleton className="h-4 w-40" />
           </div>
         ) : (
           <motion.div
           key={`${fromCurrency}-${toCurrency}-${amount}`}
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="mt-6 p-5 rounded-xl bg-muted/50 border border-currency/20"
         >
           <p className="text-sm text-muted-foreground mb-1">Converted Amount</p>
           <p className="text-3xl font-display font-bold text-currency">
             {toCurrencyData?.symbol}
             {result.toLocaleString(undefined, {
               minimumFractionDigits: 2,
               maximumFractionDigits: 2,
             })}
           </p>
           <p className="text-sm text-muted-foreground mt-2">
             1 {fromCurrency} = {convert(1, fromCurrency, toCurrency).toFixed(4)}{" "}
             {toCurrency}
           </p>
         </motion.div>
         )}
       </div>
     </motion.div>
   );
 };