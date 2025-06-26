"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AProps {
  href: string;
  type?: "btn" | "mailto" | "external" | "push";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  target?: string;
  rel?: string;
}

const A: React.FC<AProps> = ({ 
  href, 
  type, 
  children, 
  className = "", 
  onClick, 
  style,
  prefetch = true,
  replace = false,
  scroll = true,
  target,
  rel
}) => {
  const router = useRouter();

  const handlePushClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick();
    if (replace) {
      router.replace(href);
    } else {
      router.push(href);
    }
  };

  switch (type) {
    case undefined:
      // Link interno estándar de Next.js
      return (
        <Link 
          href={href} 
          className={className} 
          style={style}
          prefetch={prefetch}
          replace={replace}
          scroll={scroll}
        >
          {children}
        </Link>
      );

    case "btn":
      // Link que actúa como botón
      return (
        <Link 
          href={href} 
          className={className} 
          style={style} 
          role="button"
          prefetch={prefetch}
          replace={replace}
          scroll={scroll}
          onClick={onClick}
        >
          {children}
        </Link>
      );

    case "external":
      // Link externo
      return (
        <a 
          href={href} 
          target={target || "_blank"} 
          rel={rel || "noopener noreferrer"} 
          className={className} 
          style={style}
          onClick={onClick}
        >
          {children}
        </a>
      );

    case "mailto":
      // Link de email
      return (
        <a 
          href={`mailto:${href}`} 
          className={className} 
          style={style}
          onClick={onClick}
        >
          {children}
        </a>
      );

    case "push":
      // Navegación programática
      return (
        <button
          type="button"
          className={className}
          style={style}
          onClick={handlePushClick}
        >
          {children}
        </button>
      );

    default:
      return null;
  }
};

export default A;