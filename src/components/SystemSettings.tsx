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
    &lt;Dialog&gt;
      &lt;DialogTrigger asChild&gt;
        &lt;Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50", 
            mobile ? "text-lg" : "",
            className
          )}
        &gt;
          &lt;Settings className="h-5 w-5" /&gt;
          &lt;span&gt;إعدادات النظام&lt;/span&gt;
        &lt;/Button&gt;
      &lt;/DialogTrigger&gt;
      &lt;DialogContent className="sm:max-w-[425px]" dir="rtl"&gt;
        &lt;DialogHeader&gt;
          &lt;DialogTitle&gt;إعدادات النظام&lt;/DialogTitle&gt;
          &lt;DialogDescription&gt;
            تخصيص تجربة الاستخدام الخاصة بك.
          &lt;/DialogDescription&gt;
        &lt;/DialogHeader&gt;
        &lt;div className="grid gap-4 py-4"&gt;
          &lt;div className="flex items-center justify-between space-x-2 space-x-reverse border p-4 rounded-lg"&gt;
            &lt;div className="flex items-center gap-3"&gt;
                &lt;div className={cn("p-2 rounded-full", soundEnabled ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500")}&gt;
                    {soundEnabled ? &lt;Volume2 className="h-5 w-5" /&gt; : &lt;VolumeX className="h-5 w-5" /&gt;}
                &lt;/div&gt;
                &lt;div className="flex flex-col"&gt;
                    &lt;Label htmlFor="sound-mode" className="text-base font-medium"&gt;أصوات القائمة&lt;/Label&gt;
                    &lt;span className="text-xs text-muted-foreground"&gt;تشغيل مؤثرات صوتية عند النقر&lt;/span&gt;
                &lt;/div&gt;
            &lt;/div&gt;
            &lt;Switch
              id="sound-mode"
              checked={soundEnabled}
              onCheckedChange={toggleSound}
            />
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/DialogContent&gt;
    &lt;/Dialog&gt;
  );
}
