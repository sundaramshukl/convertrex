 import { useState } from "react";
 import { motion } from "framer-motion";
 import { FileType, Search, ArrowRight, Info } from "lucide-react";
 import { Input } from "@/components/ui/input";
 import { Badge } from "@/components/ui/badge";
 
 type FileFormat = {
   extension: string;
   name: string;
   category: string;
   description: string;
   canConvertTo: string[];
 };
 
 const fileFormats: FileFormat[] = [
   {
     extension: "JPG",
     name: "JPEG Image",
     category: "Image",
     description: "Compressed image format, great for photos",
     canConvertTo: ["PNG", "WEBP", "GIF", "BMP", "TIFF", "PDF"],
   },
   {
     extension: "PNG",
     name: "PNG Image",
     category: "Image",
     description: "Lossless compression with transparency support",
     canConvertTo: ["JPG", "WEBP", "GIF", "BMP", "TIFF", "PDF", "SVG"],
   },
   {
     extension: "WEBP",
     name: "WebP Image",
     category: "Image",
     description: "Modern format with superior compression",
     canConvertTo: ["JPG", "PNG", "GIF"],
   },
   {
     extension: "SVG",
     name: "Scalable Vector",
     category: "Image",
     description: "Vector format, scales without quality loss",
     canConvertTo: ["PNG", "JPG", "PDF"],
   },
   {
     extension: "GIF",
     name: "GIF Image",
     category: "Image",
     description: "Supports animation and transparency",
     canConvertTo: ["PNG", "JPG", "WEBP", "MP4"],
   },
   {
     extension: "PDF",
     name: "PDF Document",
     category: "Document",
     description: "Portable document format",
     canConvertTo: ["DOCX", "TXT", "JPG", "PNG", "HTML"],
   },
   {
     extension: "DOCX",
     name: "Word Document",
     category: "Document",
     description: "Microsoft Word format",
     canConvertTo: ["PDF", "TXT", "HTML", "ODT", "RTF"],
   },
   {
     extension: "XLSX",
     name: "Excel Spreadsheet",
     category: "Document",
     description: "Microsoft Excel format",
     canConvertTo: ["CSV", "PDF", "ODS", "JSON"],
   },
   {
     extension: "CSV",
     name: "CSV File",
     category: "Data",
     description: "Comma-separated values",
     canConvertTo: ["XLSX", "JSON", "XML"],
   },
   {
     extension: "JSON",
     name: "JSON File",
     category: "Data",
     description: "JavaScript Object Notation",
     canConvertTo: ["CSV", "XML", "YAML"],
   },
   {
     extension: "XML",
     name: "XML File",
     category: "Data",
     description: "Extensible Markup Language",
     canConvertTo: ["JSON", "CSV", "HTML"],
   },
   {
     extension: "MP3",
     name: "MP3 Audio",
     category: "Audio",
     description: "Compressed audio format",
     canConvertTo: ["WAV", "AAC", "FLAC", "OGG", "M4A"],
   },
   {
     extension: "WAV",
     name: "WAV Audio",
     category: "Audio",
     description: "Uncompressed audio format",
     canConvertTo: ["MP3", "AAC", "FLAC", "OGG"],
   },
   {
     extension: "MP4",
     name: "MP4 Video",
     category: "Video",
     description: "Popular video container format",
     canConvertTo: ["AVI", "MOV", "WEBM", "GIF", "MKV"],
   },
   {
     extension: "AVI",
     name: "AVI Video",
     category: "Video",
     description: "Audio Video Interleave format",
     canConvertTo: ["MP4", "MOV", "WEBM", "MKV"],
   },
   {
     extension: "MOV",
     name: "QuickTime Video",
     category: "Video",
     description: "Apple QuickTime format",
     canConvertTo: ["MP4", "AVI", "WEBM", "GIF"],
   },
   {
     extension: "ZIP",
     name: "ZIP Archive",
     category: "Archive",
     description: "Compressed archive format",
     canConvertTo: ["RAR", "7Z", "TAR"],
   },
   {
     extension: "HTML",
     name: "HTML File",
     category: "Web",
     description: "HyperText Markup Language",
     canConvertTo: ["PDF", "DOCX", "TXT", "MD"],
   },
   {
     extension: "MD",
     name: "Markdown",
     category: "Web",
     description: "Lightweight markup language",
     canConvertTo: ["HTML", "PDF", "DOCX", "TXT"],
   },
 ];
 
 const categories = ["All", "Image", "Document", "Data", "Audio", "Video", "Archive", "Web"];
 
 const categoryColors: Record<string, string> = {
   Image: "bg-files/20 text-files border-files/30",
   Document: "bg-currency/20 text-currency border-currency/30",
   Data: "bg-units/20 text-units border-units/30",
   Audio: "bg-metals/20 text-metals border-metals/30",
   Video: "bg-destructive/20 text-destructive border-destructive/30",
   Archive: "bg-muted text-muted-foreground border-border",
   Web: "bg-primary/20 text-primary border-primary/30",
 };
 
 export const FileFormatGuide = () => {
   const [search, setSearch] = useState("");
   const [selectedCategory, setSelectedCategory] = useState("All");
   const [selectedFormat, setSelectedFormat] = useState<FileFormat | null>(null);
 
   const filteredFormats = fileFormats.filter((format) => {
     const matchesSearch =
       format.extension.toLowerCase().includes(search.toLowerCase()) ||
       format.name.toLowerCase().includes(search.toLowerCase());
     const matchesCategory =
       selectedCategory === "All" || format.category === selectedCategory;
     return matchesSearch && matchesCategory;
   });
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.5, delay: 0.3 }}
       className="converter-card glow-files"
     >
       <div className="flex items-center gap-3 mb-6">
         <div className="p-2.5 rounded-xl bg-gradient-files">
           <FileType className="w-5 h-5 text-background" />
         </div>
         <h2 className="text-xl font-display font-semibold text-gradient-files">
           File Format Guide
         </h2>
       </div>
 
       <div className="space-y-4">
         <div className="relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
           <Input
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             placeholder="Search file formats..."
             className="pl-10 input-converter"
           />
         </div>
 
         <div className="flex flex-wrap gap-2">
           {categories.map((cat) => (
             <Badge
               key={cat}
               variant={selectedCategory === cat ? "default" : "outline"}
               className={`cursor-pointer transition-all ${
                 selectedCategory === cat
                   ? "bg-files hover:bg-files/90"
                   : "hover:bg-files/10"
               }`}
               onClick={() => setSelectedCategory(cat)}
             >
               {cat}
             </Badge>
           ))}
         </div>
 
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-2">
           {filteredFormats.map((format) => (
             <motion.div
               key={format.extension}
               whileHover={{ scale: 1.02 }}
               onClick={() => setSelectedFormat(format)}
               className={`p-3 rounded-xl cursor-pointer border transition-all ${
                 selectedFormat?.extension === format.extension
                   ? "border-files bg-files/10"
                   : "border-border bg-muted/30 hover:border-files/40"
               }`}
             >
               <div className="flex items-center justify-between mb-1">
                 <span className="font-mono font-bold text-sm">
                   .{format.extension.toLowerCase()}
                 </span>
                 <Badge
                   variant="outline"
                   className={`text-[10px] px-1.5 ${categoryColors[format.category]}`}
                 >
                   {format.category}
                 </Badge>
               </div>
               <p className="text-xs text-muted-foreground truncate">
                 {format.name}
               </p>
             </motion.div>
           ))}
         </div>
 
         {selectedFormat && (
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="p-5 rounded-xl bg-muted/50 border border-files/20"
           >
             <div className="flex items-start gap-3 mb-4">
               <div className="p-2 rounded-lg bg-files/20">
                 <Info className="w-4 h-4 text-files" />
               </div>
               <div>
                 <h3 className="font-semibold">
                   .{selectedFormat.extension.toLowerCase()} -{" "}
                   {selectedFormat.name}
                 </h3>
                 <p className="text-sm text-muted-foreground">
                   {selectedFormat.description}
                 </p>
               </div>
             </div>
 
             <div>
               <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                 <ArrowRight className="w-4 h-4" /> Can convert to:
               </p>
               <div className="flex flex-wrap gap-2">
                 {selectedFormat.canConvertTo.map((ext) => (
                   <Badge
                     key={ext}
                     variant="outline"
                     className="font-mono text-xs"
                   >
                     .{ext.toLowerCase()}
                   </Badge>
                 ))}
               </div>
             </div>
           </motion.div>
         )}
       </div>
     </motion.div>
   );
 };