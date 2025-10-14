'use client';

import Image from 'next/image';
import { OrganizationChart } from 'primereact/organizationchart';
import type { TreeNode } from 'primereact/treenode';
import { useState } from 'react';

export interface PengurusSectionProps {
  className?: string;
}

interface LeadershipData {
  name: string;
  position: string;
  photo: string;
  level: string;
  description?: string;
  color?: string;
}

export function PengurusSection({ className = '' }: PengurusSectionProps) {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  // Organization data structure with dummy intermediate node
  const organizationData: TreeNode[] = [
    {
      label: 'Ketua Umum',
      expanded: true,
      data: {
        name: 'Ahmad Fauzi',
        position: 'Ketua Umum',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
        level: 'Level 1',
        color: 'red',
      } as LeadershipData,
      children: [
        {
          label: 'Sekretaris Jenderal',
          expanded: true,
          data: {
            name: 'Budi Santoso',
            position: 'Sekretaris Jenderal',
            photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
            level: 'Level 1.5',
            color: 'blue',
          } as LeadershipData,
          children: [
            {
              label: 'Wakil Sekjen',
              data: {
                name: 'Sarah Wijaya',
                position: 'Wakil Sekretaris Jenderal',
                photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
                level: 'Level 1.75',
                color: 'blue',
              } as LeadershipData,
            },
            {
              label: 'Bendahara',
              data: {
                name: 'Dewi Lestari',
                position: 'Bendahara',
                photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
                level: 'Level 1.75',
                color: 'blue',
              } as LeadershipData,
            },
          ],
        },
        {
          label: 'Division Leaders',
          expanded: true,
          className: 'dummy-node',
          data: {
            level: 'dummy',
          } as LeadershipData,
          children: [
            {
              label: 'Ketua 1',
              data: {
                name: 'Rizki Pratama',
                position: 'Ketua 1',
                photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
                level: 'Level 2',
                description: 'Scholarship, Family & Spiritual Development',
                color: 'red',
              } as LeadershipData,
            },
            {
              label: 'Ketua 2',
              data: {
                name: 'Anisa Rahman',
                position: 'Ketua 2',
                photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
                level: 'Level 2',
                description: 'Business, Politics & Western District',
                color: 'red',
              } as LeadershipData,
            },
            {
              label: 'Ketua 3',
              data: {
                name: 'Doni Setiawan',
                position: 'Ketua 3',
                photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
                level: 'Level 2',
                description: 'Eastern District, Career & Strategic Studies',
                color: 'red',
              } as LeadershipData,
            },
            {
              label: 'Ketua 4',
              data: {
                name: 'Maya Kusuma',
                position: 'Ketua 4',
                photo: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80',
                level: 'Level 2',
                description: 'Programs, IT & Communications',
                color: 'red',
              } as LeadershipData,
            },
          ],
        },
      ],
    },
  ];

  // Custom node template
  const nodeTemplate = (node: TreeNode) => {
    const data = node.data as LeadershipData;
    if (!data) return null;

    // Hide dummy node
    if (data.level === 'dummy') {
      return <div style={{ width: 0, height: 0, visibility: 'hidden' }} />;
    }

    const isKetuaUmum = data.level === 'Level 1';
    const isSekjen = data.level === 'Level 1.5';
    const isExecutive = data.level === 'Level 1.75';
    const isDivisionLeader = data.level === 'Level 2';

    const accentColor = data.color === 'red' ? 'iark-red' : 'iark-blue';

    return (
      <div
        className={`group bg-white rounded-xl p-4 border-2 border-gray-400 hover:border-${accentColor} hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center
          ${isKetuaUmum ? 'w-80 p-6' : ''}
          ${isSekjen ? 'w-72 p-6' : ''}
          ${isExecutive ? 'w-56 p-4' : ''}
          ${isDivisionLeader ? 'w-64 p-4' : ''}
        `}
      >
        {/* Photo */}
        <div
          className={`relative rounded-full overflow-hidden mb-3 ring-4 ring-gray-100 group-hover:ring-${accentColor}/30 transition-all duration-300
            ${isKetuaUmum ? 'w-32 h-32 mb-4' : ''}
            ${isSekjen ? 'w-28 h-28 mb-4' : ''}
            ${isExecutive ? 'w-24 h-24' : ''}
            ${isDivisionLeader ? 'w-24 h-24' : ''}
          `}
        >
          <Image
            src={data.photo}
            alt={data.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Name */}
        <h3
          className={`font-bold text-gray-900 mb-1
            ${isKetuaUmum ? 'text-xl' : ''}
            ${isSekjen ? 'text-lg' : ''}
            ${isExecutive || isDivisionLeader ? 'text-base' : ''}
          `}
        >
          {data.name}
        </h3>

        {/* Position */}
        <p
          className={`font-bold mb-1 text-${accentColor}
            ${isKetuaUmum ? 'text-base' : ''}
            ${isSekjen ? 'text-sm' : ''}
            ${isExecutive ? 'text-xs' : ''}
            ${isDivisionLeader ? 'text-sm' : ''}
          `}
        >
          {data.position}
        </p>

        {/* Level */}
        {/* <p className="text-xs text-gray-600 mb-2">{data.level}</p> */}

        {/* Description for Division Leaders */}
        {data.description && (
          <p className="text-xs text-gray-600 leading-tight mb-2">
            {data.description}
          </p>
        )}

        {/* Bidang count for Division Leaders */}
        {isDivisionLeader && (
          <div className="text-xs text-gray-500 border-t pt-2 mt-2 w-full">
            [3 Bidang]
          </div>
        )}
      </div>
    );
  };

  return (
    <section className={`relative py-24 px-8 bg-white overflow-hidden ${className}`}>
      {/* Subtle gradient orbs background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-iark-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-iark-red/5 rounded-full blur-3xl" />

      {/* Decorative small elements with animations */}
      <div className="absolute top-32 left-1/4 w-10 h-10 bg-iark-red rounded-full opacity-20 animate-pulse-slow" />
      <div className="absolute top-2/3 right-16 w-8 h-8 bg-iark-yellow rounded-full opacity-20 animate-drift" />
      <div className="absolute bottom-1/4 left-20 w-12 h-12 bg-iark-blue rounded-full opacity-30 animate-pulse-slow" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Decorative element */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-iark-red/10 rounded-full flex items-center justify-center animate-pulse-slow">
            <div className="w-6 h-6 bg-iark-red rounded-full" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-iark-black">
          Struktur Organisasi IARK
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
          Tim kepemimpinan yang berdedikasi untuk memajukan IARK dan alumni RK
        </p>

        {/* Scrollable Organization Chart Container */}
        <div className="relative border-2 border-gray-300 rounded-xl overflow-hidden bg-gray-50">
          {/* Floating Zoom Controls */}
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <button
              onClick={handleZoomOut}
              className="w-10 h-10 bg-iark-red text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-bold flex items-center justify-center shadow-lg"
              aria-label="Zoom out"
            >
              −
            </button>
            <button
              onClick={handleZoomIn}
              className="w-10 h-10 bg-iark-red text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-bold flex items-center justify-center shadow-lg"
              aria-label="Zoom in"
            >
              +
            </button>
          </div>
          <div
            className="overflow-auto"
            style={{
              maxHeight: '800px',
              maxWidth: '100%',
            }}
          >
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
                transition: 'transform 0.2s ease-out',
                minWidth: 'max-content',
                padding: '2rem',
              }}
            >
              <OrganizationChart value={organizationData} nodeTemplate={nodeTemplate} />
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg text-xs text-gray-600 pointer-events-none">
            Scroll to navigate
          </div>
        </div>
      </div>
    </section>
  );
}
