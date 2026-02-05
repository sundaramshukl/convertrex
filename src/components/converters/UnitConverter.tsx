 import { useState } from "react";
 import { motion } from "framer-motion";
 import { ArrowDownUp, Ruler } from "lucide-react";
 import { Input } from "@/components/ui/input";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import { Button } from "@/components/ui/button";
 import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
 
 type UnitCategory = {
   name: string;
   units: { code: string; name: string; factor: number }[];
 };
 
 const unitCategories: Record<string, UnitCategory> = {
   length: {
     name: "Length",
     units: [
       { code: "m", name: "Meter", factor: 1 },
       { code: "km", name: "Kilometer", factor: 1000 },
       { code: "cm", name: "Centimeter", factor: 0.01 },
       { code: "mm", name: "Millimeter", factor: 0.001 },
       { code: "mi", name: "Mile", factor: 1609.344 },
       { code: "yd", name: "Yard", factor: 0.9144 },
       { code: "ft", name: "Foot", factor: 0.3048 },
       { code: "in", name: "Inch", factor: 0.0254 },
       { code: "nm", name: "Nautical Mile", factor: 1852 },
     ],
   },
   weight: {
     name: "Weight",
     units: [
       { code: "kg", name: "Kilogram", factor: 1 },
       { code: "g", name: "Gram", factor: 0.001 },
       { code: "mg", name: "Milligram", factor: 0.000001 },
       { code: "lb", name: "Pound", factor: 0.453592 },
       { code: "oz", name: "Ounce", factor: 0.0283495 },
       { code: "t", name: "Metric Ton", factor: 1000 },
       { code: "st", name: "Stone", factor: 6.35029 },
     ],
   },
   temperature: {
     name: "Temperature",
     units: [
       { code: "C", name: "Celsius", factor: 1 },
       { code: "F", name: "Fahrenheit", factor: 1 },
       { code: "K", name: "Kelvin", factor: 1 },
     ],
   },
   volume: {
     name: "Volume",
     units: [
       { code: "L", name: "Liter", factor: 1 },
       { code: "mL", name: "Milliliter", factor: 0.001 },
       { code: "gal", name: "Gallon (US)", factor: 3.78541 },
       { code: "qt", name: "Quart", factor: 0.946353 },
       { code: "pt", name: "Pint", factor: 0.473176 },
       { code: "cup", name: "Cup", factor: 0.236588 },
       { code: "floz", name: "Fluid Ounce", factor: 0.0295735 },
       { code: "m3", name: "Cubic Meter", factor: 1000 },
     ],
   },
   area: {
     name: "Area",
     units: [
       { code: "m2", name: "Square Meter", factor: 1 },
       { code: "km2", name: "Square Kilometer", factor: 1000000 },
       { code: "ha", name: "Hectare", factor: 10000 },
       { code: "ac", name: "Acre", factor: 4046.86 },
       { code: "ft2", name: "Square Foot", factor: 0.092903 },
       { code: "yd2", name: "Square Yard", factor: 0.836127 },
       { code: "mi2", name: "Square Mile", factor: 2589988.11 },
     ],
   },
   speed: {
     name: "Speed",
     units: [
       { code: "m/s", name: "Meters/Second", factor: 1 },
       { code: "km/h", name: "Kilometers/Hour", factor: 0.277778 },
       { code: "mph", name: "Miles/Hour", factor: 0.44704 },
       { code: "kn", name: "Knots", factor: 0.514444 },
       { code: "ft/s", name: "Feet/Second", factor: 0.3048 },
     ],
   },
   time: {
     name: "Time",
     units: [
       { code: "s", name: "Second", factor: 1 },
       { code: "ms", name: "Millisecond", factor: 0.001 },
       { code: "min", name: "Minute", factor: 60 },
       { code: "hr", name: "Hour", factor: 3600 },
       { code: "day", name: "Day", factor: 86400 },
       { code: "week", name: "Week", factor: 604800 },
       { code: "month", name: "Month", factor: 2629746 },
       { code: "year", name: "Year", factor: 31556952 },
     ],
   },
   data: {
     name: "Data",
     units: [
       { code: "B", name: "Byte", factor: 1 },
       { code: "KB", name: "Kilobyte", factor: 1024 },
       { code: "MB", name: "Megabyte", factor: 1048576 },
       { code: "GB", name: "Gigabyte", factor: 1073741824 },
       { code: "TB", name: "Terabyte", factor: 1099511627776 },
       { code: "bit", name: "Bit", factor: 0.125 },
     ],
   },
 };
 
 export const UnitConverter = () => {
   const [category, setCategory] = useState("length");
   const [amount, setAmount] = useState<string>("100");
   const [fromUnit, setFromUnit] = useState("m");
   const [toUnit, setToUnit] = useState("ft");
   const [isSwapping, setIsSwapping] = useState(false);
 
   const currentCategory = unitCategories[category];
 
   const convertTemperature = (
     value: number,
     from: string,
     to: string
   ): number => {
     let celsius: number;
     if (from === "C") celsius = value;
     else if (from === "F") celsius = ((value - 32) * 5) / 9;
     else celsius = value - 273.15;
 
     if (to === "C") return celsius;
     else if (to === "F") return (celsius * 9) / 5 + 32;
     else return celsius + 273.15;
   };
 
   const convert = (value: number, from: string, to: string): number => {
     if (category === "temperature") {
       return convertTemperature(value, from, to);
     }
     const fromFactor =
       currentCategory.units.find((u) => u.code === from)?.factor || 1;
     const toFactor =
       currentCategory.units.find((u) => u.code === to)?.factor || 1;
     return (value * fromFactor) / toFactor;
   };
 
   const result = convert(parseFloat(amount) || 0, fromUnit, toUnit);
 
   const handleCategoryChange = (newCategory: string) => {
     setCategory(newCategory);
     const units = unitCategories[newCategory].units;
     setFromUnit(units[0].code);
     setToUnit(units[1]?.code || units[0].code);
   };
 
   const handleSwap = () => {
     setIsSwapping(true);
     setTimeout(() => {
       setFromUnit(toUnit);
       setToUnit(fromUnit);
       setIsSwapping(false);
     }, 150);
   };
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.5, delay: 0.1 }}
       className="converter-card glow-units"
     >
       <div className="flex items-center gap-3 mb-6">
         <div className="p-2.5 rounded-xl bg-gradient-units">
           <Ruler className="w-5 h-5 text-background" />
         </div>
         <h2 className="text-xl font-display font-semibold text-gradient-units">
           Unit Converter
         </h2>
       </div>
 
       <Tabs value={category} onValueChange={handleCategoryChange} className="mb-4">
         <TabsList className="grid grid-cols-4 lg:grid-cols-8 h-auto p-1 bg-muted">
           {Object.entries(unitCategories).map(([key, cat]) => (
             <TabsTrigger
               key={key}
               value={key}
               className="text-xs px-2 py-2 data-[state=active]:bg-units data-[state=active]:text-background"
             >
               {cat.name}
             </TabsTrigger>
           ))}
         </TabsList>
       </Tabs>
 
       <div className="space-y-4">
         <div className="space-y-2">
           <label className="text-sm text-muted-foreground">Value</label>
           <Input
             type="number"
             value={amount}
             onChange={(e) => setAmount(e.target.value)}
             className="input-converter"
             placeholder="Enter value"
           />
         </div>
 
         <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-end">
           <div className="space-y-2">
             <label className="text-sm text-muted-foreground">From</label>
             <Select value={fromUnit} onValueChange={setFromUnit}>
               <SelectTrigger className="h-14 bg-muted border-border rounded-xl">
                 <SelectValue />
               </SelectTrigger>
               <SelectContent>
                 {currentCategory.units.map((unit) => (
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
 
           <Button
             variant="ghost"
             size="icon"
             onClick={handleSwap}
             className="h-14 w-14 rounded-xl hover:bg-units/10 transition-all"
           >
             <motion.div animate={{ rotate: isSwapping ? 180 : 0 }}>
               <ArrowDownUp className="w-5 h-5 text-units" />
             </motion.div>
           </Button>
 
           <div className="space-y-2">
             <label className="text-sm text-muted-foreground">To</label>
             <Select value={toUnit} onValueChange={setToUnit}>
               <SelectTrigger className="h-14 bg-muted border-border rounded-xl">
                 <SelectValue />
               </SelectTrigger>
               <SelectContent>
                 {currentCategory.units.map((unit) => (
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
           key={`${fromUnit}-${toUnit}-${amount}`}
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="mt-6 p-5 rounded-xl bg-muted/50 border border-units/20"
         >
           <p className="text-sm text-muted-foreground mb-1">Result</p>
           <p className="text-3xl font-display font-bold text-units">
             {result.toLocaleString(undefined, {
               maximumFractionDigits: 6,
             })}{" "}
             {toUnit}
           </p>
           <p className="text-sm text-muted-foreground mt-2">
             1 {fromUnit} = {convert(1, fromUnit, toUnit).toFixed(6)} {toUnit}
           </p>
         </motion.div>
       </div>
     </motion.div>
   );
 };