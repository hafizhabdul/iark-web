'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ targetDate, className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculateTimeLeft = (): TimeLeft | null => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) {
    return (
      <div className={`flex gap-3 ${className}`}>
        {['Hari', 'Jam', 'Menit', 'Detik'].map((label) => (
          <div key={label} className="text-center">
            <div className="bg-white/20 backdrop-blur-md rounded-lg px-3 py-2 min-w-[60px]">
              <span className="text-2xl font-bold">--</span>
            </div>
            <span className="text-xs mt-1 opacity-80">{label}</span>
          </div>
        ))}
      </div>
    );
  }

  if (!timeLeft) {
    return (
      <div className={`text-center ${className}`}>
        <span className="text-xl font-bold">Event Sedang Berlangsung!</span>
      </div>
    );
  }

  const timeUnits = [
    { value: timeLeft.days, label: 'Hari' },
    { value: timeLeft.hours, label: 'Jam' },
    { value: timeLeft.minutes, label: 'Menit' },
    { value: timeLeft.seconds, label: 'Detik' },
  ];

  return (
    <div className={`flex gap-3 ${className}`}>
      {timeUnits.map(({ value, label }) => (
        <div key={label} className="text-center">
          <div className="bg-white/20 backdrop-blur-md rounded-lg px-3 py-2 min-w-[60px]">
            <span className="text-2xl font-bold">{value.toString().padStart(2, '0')}</span>
          </div>
          <span className="text-xs mt-1 opacity-80">{label}</span>
        </div>
      ))}
    </div>
  );
}
