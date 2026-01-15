import { useEffect, useState } from 'react';

export function NewsTicker() {
  return (
    &lt;div className="w-full bg-red-600 text-white py-2 overflow-hidden relative border-y border-red-700"&gt;
      &lt;div className="animate-marquee whitespace-nowrap inline-block"&gt;
        &lt;span className="mx-4 font-bold"&gt;تنبيه هام: يرجى تحديث بيانات المنهوبات بشكل دوري لضمان دقة النظام.&lt;/span&gt;
        &lt;span className="mx-4"&gt;|&lt;/span&gt;
        &lt;span className="mx-4 font-bold"&gt;نسخة النظام المستقرة (Day 12 Restore).&lt;/span&gt;
        &lt;span className="mx-4"&gt;|&lt;/span&gt;
        &lt;span className="mx-4 font-bold"&gt;مرحباً بكم في برنامج حسابات المعقبين.&lt;/span&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
}
