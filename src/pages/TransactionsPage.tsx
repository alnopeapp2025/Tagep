import { useState } from 'react';
import { ArrowRight, Plus, Check, ChevronsUpDown, Calendar, DollarSign, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
// Removed unused Button import
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Mock Data for suggestions
const transactionTypes = [
  { value: "renewal", label: "تجديد إقامة" },
  { value: "transfer", label: "نقل كفالة" },
  { value: "exit_entry", label: "خروج وعودة" },
  { value: "final_exit", label: "خروج نهائي" },
  { value: "visit_visa", label: "تأشيرة زيارة" },
  { value: "medical", label: "تأمين طبي" },
];

export default function TransactionsPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // Dialog state
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState("");
  const [customTransaction, setCustomTransaction] = useState("");

  // Form States
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  const handleSave = () => {
    console.log({
      transaction: customTransaction || selectedTransaction,
      price,
      duration
    });
    setOpen(false);
    // Add logic to save to state/db here
  };

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* Header */}
      <header className="mb-8 flex items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="p-3 rounded-full bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active text-gray-600 transition-all"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-800 text-shadow">المعاملات</h1>
          <p className="text-gray-500">إدارة ومتابعة المعاملات</p>
        </div>
      </header>

      {/* Actions Area */}
      <div className="mb-8">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#eef2f6] text-blue-600 font-bold shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all w-full sm:w-auto justify-center">
              <div className="p-1 bg-blue-100 rounded-full">
                <Plus className="w-5 h-5" />
              </div>
              <span>أضف معاملة جديدة</span>
            </button>
          </DialogTrigger>
          
          <DialogContent className="bg-[#eef2f6] border-none shadow-3d rounded-3xl max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 text-center">معاملة جديدة</DialogTitle>
              <DialogDescription className="text-center text-gray-500">
                أدخل تفاصيل المعاملة الجديدة أدناه
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              
              {/* Transaction Type - Combobox */}
              <div className="grid gap-2">
                <Label htmlFor="transaction" className="text-right font-semibold text-gray-700">نوع المعاملة</Label>
                <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                  <PopoverTrigger asChild>
                    <button
                      role="combobox"
                      aria-expanded={comboboxOpen}
                      className="flex h-12 w-full items-center justify-between rounded-xl bg-[#eef2f6] px-4 py-2 text-sm shadow-3d-inset text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                    >
                      {customTransaction ? customTransaction : (selectedTransaction
                        ? transactionTypes.find((t) => t.value === selectedTransaction)?.label
                        : "إختر المعاملة أو أكتبها...")}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0 bg-[#eef2f6] shadow-3d border-none rounded-xl" align="start">
                    <Command className="bg-transparent">
                      <CommandInput 
                        placeholder="ابحث أو أكتب..." 
                        className="text-right"
                        onValueChange={(search) => {
                            // Allow typing custom values
                            setCustomTransaction(search);
                        }}
                      />
                      <CommandList>
                        <CommandEmpty className="py-2 px-4 text-sm text-gray-500">
                            {customTransaction ? (
                                <button 
                                    className="w-full text-right text-blue-600 font-semibold"
                                    onClick={() => {
                                        setSelectedTransaction(customTransaction);
                                        setComboboxOpen(false);
                                    }}
                                >
                                    استخدام "{customTransaction}"
                                </button>
                            ) : "لا توجد نتائج."}
                        </CommandEmpty>
                        <CommandGroup>
                          {transactionTypes.map((type) => (
                            <CommandItem
                              key={type.value}
                              value={type.label}
                              onSelect={() => {
                                setSelectedTransaction(type.value === selectedTransaction ? "" : type.value);
                                setCustomTransaction(""); // Reset custom if selected from list
                                setComboboxOpen(false);
                              }}
                              className="text-right flex justify-between cursor-pointer hover:bg-white/50 rounded-lg my-1"
                            >
                              {type.label}
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedTransaction === type.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Price */}
              <div className="grid gap-2">
                <Label htmlFor="price" className="text-right font-semibold text-gray-700">السعر (ر.س)</Label>
                <div className="relative">
                    <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    className="pl-10 text-left" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    />
                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Duration */}
              <div className="grid gap-2">
                <Label htmlFor="duration" className="text-right font-semibold text-gray-700">مدة الإنجاز (أيام)</Label>
                <div className="relative">
                    <Input
                    id="duration"
                    type="number"
                    placeholder="مثال: 3"
                    className="pl-10"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    />
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

            </div>

            <DialogFooter className="sm:justify-start gap-2">
              <button 
                onClick={handleSave}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
              >
                حفظ المعاملة
              </button>
              <button 
                onClick={() => setOpen(false)}
                className="px-6 py-3 rounded-xl bg-transparent text-gray-500 font-semibold hover:bg-gray-200/50 transition-all"
              >
                إلغاء
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Empty State / List Placeholder */}
      <div className="bg-[#eef2f6] rounded-3xl shadow-3d p-8 min-h-[300px] flex flex-col items-center justify-center text-center border border-white/20">
        <div className="w-20 h-20 bg-[#eef2f6] rounded-full shadow-3d flex items-center justify-center mb-6 text-gray-400">
            <FileText className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد معاملات حالياً</h3>
        <p className="text-gray-500 max-w-xs mx-auto">
            قم بإضافة معاملة جديدة للبدء في تتبع الإنجاز والحسابات.
        </p>
      </div>

    </div>
  );
}
