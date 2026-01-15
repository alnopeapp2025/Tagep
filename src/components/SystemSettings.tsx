import { Settings, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSettingsStore } from "@/lib/sound-store";
import { cn } from "@/lib/utils";

interface SystemSettingsProps {
    mobile?: boolean;
    className?: string;
}

export function SystemSettings({ mobile, className }: SystemSettingsProps) {
  const { soundEnabled, toggleSound } = useSettingsStore();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50", 
            mobile ? "text-lg" : "",
            className
          )}
        >
          <Settings className="h-5 w-5" />
          <span>إعدادات النظام</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>إعدادات النظام</DialogTitle>
          <DialogDescription>
            تخصيص تجربة الاستخدام الخاصة بك.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between space-x-2 space-x-reverse border p-4 rounded-lg">
            <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-full", soundEnabled ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500")}>
                    {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                </div>
                <div className="flex flex-col">
                    <Label htmlFor="sound-mode" className="text-base font-medium">أصوات القائمة</Label>
                    <span className="text-xs text-muted-foreground">تشغيل مؤثرات صوتية عند النقر</span>
                </div>
            </div>
            <Switch
              id="sound-mode"
              checked={soundEnabled}
              onCheckedChange={toggleSound}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
