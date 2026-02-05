 import { useState } from "react";
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
 
 const currencies = [
   { code: "USD", name: "US Dollar", symbol: "$", rate: 1 },
   { code: "EUR", name: "Euro", symbol: "€", rate: 0.92 },
   { code: "GBP", name: "British Pound", symbol: "£", rate: 0.79 },
   { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 149.5 },
   { code: "INR", name: "Indian Rupee", symbol: "₹", rate: 83.12 },
   { code: "AUD", name: "Australian Dollar", symbol: "A$", rate: 1.53 },
   { code: "CAD", name: "Canadian Dollar", symbol: "C$", rate: 1.36 },
   { code: "CHF", name: "Swiss Franc", symbol: "Fr", rate: 0.88 },
   { code: "CNY", name: "Chinese Yuan", symbol: "¥", rate: 7.24 },
   { code: "KRW", name: "South Korean Won", symbol: "₩", rate: 1320 },
   { code: "SGD", name: "Singapore Dollar", symbol: "S$", rate: 1.34 },
   { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", rate: 7.82 },
   { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", rate: 1.64 },
   { code: "SEK", name: "Swedish Krona", symbol: "kr", rate: 10.42 },
   { code: "MXN", name: "Mexican Peso", symbol: "$", rate: 17.15 },
   { code: "BRL", name: "Brazilian Real", symbol: "R$", rate: 4.97 },
   { code: "ZAR", name: "South African Rand", symbol: "R", rate: 18.65 },
   { code: "RUB", name: "Russian Ruble", symbol: "₽", rate: 89.5 },
   { code: "AED", name: "UAE Dirham", symbol: "د.إ", rate: 3.67 },
   { code: "SAR", name: "Saudi Riyal", symbol: "﷼", rate: 3.75 },
 ];
 
 export const CurrencyConverter = () => {
   const [amount, setAmount] = useState<string>("1000");
   const [fromCurrency, setFromCurrency] = useState("USD");
   const [toCurrency, setToCurrency] = useState("EUR");
   const [isSwapping, setIsSwapping] = useState(false);
 
   const convert = (value: number, from: string, to: string): number => {
     const fromRate = currencies.find((c) => c.code === from)?.rate || 1;
     const toRate = currencies.find((c) => c.code === to)?.rate || 1;
     return (value / fromRate) * toRate;
   };
 
   const result = convert(parseFloat(amount) || 0, fromCurrency, toCurrency);
   const fromCurrencyData = currencies.find((c) => c.code === fromCurrency);
   const toCurrencyData = currencies.find((c) => c.code === toCurrency);
 
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
                 {currencies.map((currency) => (
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
                 {currencies.map((currency) => (
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
       </div>
     </motion.div>
   );
 };