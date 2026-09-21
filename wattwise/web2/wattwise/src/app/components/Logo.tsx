import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'vertical' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * WattWise Logo Component
 * 
 * Komponen untuk menampilkan logo WattWise dengan berbagai variasi
 * 
 * @param variant - Tipe logo: 'horizontal' | 'vertical' | 'icon' | 'text'
 * @param size - Ukuran logo: 'sm' | 'md' | 'lg' | 'xl'
 * @param className - Custom CSS class
 */
export default function Logo({ 
  variant = 'horizontal', 
  size = 'md',
  className = '' 
}: LogoProps) {
  
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24',
  };

  const logoPath = {
    horizontal: '/assets/logos/wattwise-logo-horizontal.png',
    vertical: '/assets/logos/wattwise-logo-vertical.png',
    icon: '/assets/logos/wattwise-icon.png',
    text: '/assets/logos/wattwise-text.png',
  };

  // Fallback: jika logo belum ada, tampilkan SVG sederhana
  const fallbackLogo = (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg 
        className={`${sizeClasses[size]} text-blue-600`} 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={2}
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M13 10V3L4 14h7v7l9-11h-7z" 
        />
      </svg>
      {(variant === 'horizontal' || variant === 'text') && (
        <span className={`font-bold text-blue-600 ${
          size === 'sm' ? 'text-lg' : 
          size === 'md' ? 'text-2xl' : 
          size === 'lg' ? 'text-3xl' : 
          'text-4xl'
        }`}>
          WattWise
        </span>
      )}
    </div>
  );

  return (
    <img 
      src={logoPath[variant]} 
      alt="WattWise Logo" 
      className={`${sizeClasses[size]} ${className}`}
      onError={(e) => {
        // Jika gambar gagal load, ganti dengan fallback
        e.currentTarget.style.display = 'none';
        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
        if (fallback) fallback.style.display = 'inline-flex';
      }}
    />
  );
}

// Named exports untuk kemudahan
export const LogoHorizontal = (props: Omit<LogoProps, 'variant'>) => 
  <Logo variant="horizontal" {...props} />;

export const LogoVertical = (props: Omit<LogoProps, 'variant'>) => 
  <Logo variant="vertical" {...props} />;

export const LogoIcon = (props: Omit<LogoProps, 'variant'>) => 
  <Logo variant="icon" {...props} />;

export const LogoText = (props: Omit<LogoProps, 'variant'>) => 
  <Logo variant="text" {...props} />;
