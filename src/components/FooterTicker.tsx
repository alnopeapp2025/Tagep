export function FooterTicker() {
  return (
    <div className="w-full bg-yellow-400 text-black py-3 overflow-hidden border-t border-yellow-500 mt-auto sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="animate-marquee whitespace-nowrap inline-block" style={{ animationDuration: '30s' }}>
        <span className="mx-10 font-bold text-lg">سنبدأ العمل بإذن الله تعالى</span>
        <span className="mx-10 text-yellow-600">❖</span>
        <span className="mx-10 font-bold text-lg">سنبدأ العمل بإذن الله تعالى</span>
        <span className="mx-10 text-yellow-600">❖</span>
        <span className="mx-10 font-bold text-lg">سنبدأ العمل بإذن الله تعالى</span>
        <span className="mx-10 text-yellow-600">❖</span>
        <span className="mx-10 font-bold text-lg">سنبدأ العمل بإذن الله تعالى</span>
      </div>
    </div>
  );
}
