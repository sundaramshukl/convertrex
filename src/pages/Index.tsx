import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Ruler,
  Gem,
  FileType,
  Sparkles,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CurrencyConverter } from "@/components/converters/CurrencyConverter";
import { UnitConverter } from "@/components/converters/UnitConverter";
import { MetalConverter } from "@/components/converters/MetalConverter";
import { FileFormatGuide } from "@/components/converters/FileFormatGuide";

const tabItems = [
  { value: "currency", label: "Currency", icon: DollarSign, color: "currency" },
  { value: "units", label: "Units", icon: Ruler, color: "units" },
  { value: "metals", label: "Metals", icon: Gem, color: "metals" },
  { value: "files", label: "Files", icon: FileType, color: "files" },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("currency");

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-currency/5 to-transparent rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-units/5 to-transparent rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Universal Converter Suite
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
            <span className="text-gradient-primary">Convert</span> Everything
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Currency, units, precious metals, and file formats — all in one
            beautiful, fast converter.
          </p>
        </motion.header>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TabsList className="grid grid-cols-4 h-auto p-1.5 bg-muted/50 border border-border rounded-2xl mb-8 mx-auto max-w-lg">
              {tabItems.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={`flex items-center gap-2 py-3 px-4 rounded-xl transition-all data-[state=active]:shadow-lg ${
                    activeTab === tab.value
                      ? `data-[state=active]:bg-${tab.color} data-[state=active]:text-background`
                      : ""
                  }`}
                  style={
                    activeTab === tab.value
                      ? {
                          backgroundColor: `hsl(var(--${tab.color}))`,
                          color: "hsl(var(--background))",
                        }
                      : {}
                  }
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium">
                    {tab.label}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </motion.div>

          <TabsContent value="currency" className="mt-0">
            <CurrencyConverter />
          </TabsContent>

          <TabsContent value="units" className="mt-0">
            <UnitConverter />
          </TabsContent>

          <TabsContent value="metals" className="mt-0">
            <MetalConverter />
          </TabsContent>

          <TabsContent value="files" className="mt-0">
            <FileFormatGuide />
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="p-4 rounded-xl bg-muted/30 border border-border text-center">
            <p className="text-2xl font-display font-bold text-currency">20+</p>
            <p className="text-xs text-muted-foreground">Currencies</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30 border border-border text-center">
            <p className="text-2xl font-display font-bold text-units">50+</p>
            <p className="text-xs text-muted-foreground">Unit Types</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30 border border-border text-center">
            <p className="text-2xl font-display font-bold text-metals">5</p>
            <p className="text-xs text-muted-foreground">Precious Metals</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30 border border-border text-center">
            <p className="text-2xl font-display font-bold text-files">19+</p>
            <p className="text-xs text-muted-foreground">File Formats</p>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>
            Built with precision • Rates are approximate and for reference only
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
