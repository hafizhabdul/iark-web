'use client';

import { useRef } from 'react';

export interface BatchTabsProps {
  activeAngkatan: number;
  onSelect: (angkatan: number) => void;
  totalAngkatan: number;
}

export function BatchTabs({ activeAngkatan, onSelect, totalAngkatan }: BatchTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSelect = (angkatan: number) => {
    onSelect(angkatan);
    
    // Scroll tab into view after selection
    setTimeout(() => {
      if (scrollRef.current) {
        const activeButton = scrollRef.current.querySelector(`[data-angkatan="${angkatan}"]`);
        if (activeButton) {
          activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }
    }, 50);
  };

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {Array.from({ length: totalAngkatan }, (_, i) => i + 1).map((angkatan) => (
        <button
          key={angkatan}
          data-angkatan={angkatan}
          onClick={() => handleSelect(angkatan)}
          className={`flex-shrink-0 px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
            activeAngkatan === angkatan
              ? 'bg-iark-red text-white shadow-lg scale-105'
              : 'bg-white text-gray-600 hover:bg-gray-100 shadow border border-gray-200'
          }`}
        >
          Angkatan {angkatan}
        </button>
      ))}
    </div>
  );
}
