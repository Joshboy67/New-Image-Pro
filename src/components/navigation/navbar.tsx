"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Link One", href: "/" },
  { name: "Link Two", href: "/features" },
  { name: "Link Three", href: "/pricing" },
  { name: "Link Four", href: "/dashboard", hasDropdown: true },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo on the left */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-black">image pro</span>
          </Link>
        </div>
        
        {/* Navigation links in the center */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-black hover:text-gray-700 transition-colors flex items-center"
              >
                {item.name}
                {item.hasDropdown && (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 ml-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 9l-7 7-7-7" 
                    />
                  </svg>
                )}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Button on the right */}
        <div className="flex items-center">
          <Link
            href="/signup"
            className="inline-flex h-10 items-center justify-center rounded-md bg-black px-6 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-black/90 focus-visible:outline-none"
          >
            Button
          </Link>
        </div>
      </div>
    </nav>
  );
} 