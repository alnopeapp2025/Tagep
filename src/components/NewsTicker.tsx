import { useEffect, useState } from 'react';

export function NewsTicker() {
  return (
    <div className="w-full bg-red-600 text-white py-2 overflow-hidden relative border-y border-red-700">
      <div className="animate-marquee whitespace-nowrap inline-block">
        <span className="mx-4 font-bold">تنبيه هام: يرجى تحديث بيانات المنهوبات بشكل دوري لضمان دقة النظام.</span>
        <span className="mx-4">|</span>
        <span className="mx-4 font-bold">نسخة النظام المستقرة (Day 12 Restore).</span>
        <span className="mx-4">|</span>
        <span className="mx-4 font-bold">مرحباً بكم في برنامج حسابات المعقبين.</span>
      </div>
    </div>
  );
}
