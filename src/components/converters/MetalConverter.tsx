 import { useState } from "react";
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
 
 const metals = [
   { code: "XAU", name: "Gold", pricePerOz: 2024.5, emoji: "🥇" },
   { code: "XAG", name: "Silver", pricePerOz: 23.15, emoji: "🥈" },
   { code: "XPT", name: "Platinum", pricePerOz: 905.0, emoji: "⚪" },
   { code: "XPD", name: "Palladium", pricePerOz: 1015.0, emoji: "🔘" },
   { code: "XCU", name: "Copper", pricePerOz: 0.27, emoji: "🟤" },
 ];
 
 const currencies = [
   { code: "USD", symbol: "$", rate: 1 },
   { code: "EUR", symbol: "€", rate: 0.92 },
   { code: "GBP", symbol: "£", rate: 0.79 },
   { code: "JPY", symbol: "¥", rate: 149.5 },
   { code: "INR", symbol: "₹", rate: 83.12 },
   { code: "CHF", symbol: "Fr", rate: 0.88 },
   { code: "AUD", symbol: "A$", rate: 1.53 },
   { code: "CAD", symbol: "C$", rate: 1.36 },
 ];
 
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
 
   const calculatePrice = (): number => {
     const metalData = metals.find((m) => m.code === metal);
     const unitData = weightUnits.find((u) => u.code === weightUnit);
     const currencyData = currencies.find((c) => c.code === currency);
 
     if (!metalData || !unitData || !currencyData) return 0;
 
     const weightInOz = (parseFloat(weight) || 0) * unitData.factor;
     const priceInUsd = weightInOz * metalData.pricePerOz;
     return priceInUsd * currencyData.rate;
   };
 
   const result = calculatePrice();
   const currencyData = currencies.find((c) => c.code === currency);
   const metalData = metals.find((m) => m.code === metal);
 
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
                 {metals.map((m) => (
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
                 {currencies.map((c) => (
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
 
         <motion.div
           key={`${metal}-${weight}-${weightUnit}-${currency}`}
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="mt-6 p-5 rounded-xl bg-muted/50 border border-metals/20"
         >
           <p className="text-sm text-muted-foreground mb-1">
             {metalData?.emoji} {metalData?.name} Value
           </p>
           <p className="text-3xl font-display font-bold text-metals">
             {currencyData?.symbol}
             {result.toLocaleString(undefined, {
               minimumFractionDigits: 2,
               maximumFractionDigits: 2,
             })}
           </p>
           <p className="text-sm text-muted-foreground mt-2">
             1 oz = {currencyData?.symbol}
             {(
               (metalData?.pricePerOz || 0) * (currencyData?.rate || 1)
             ).toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
             {currency}
           </p>
         </motion.div>
 
         <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 mt-4">
           {metals.map((m) => {
             const price = m.pricePerOz * (currencyData?.rate || 1);
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
                   {currencyData?.symbol}
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