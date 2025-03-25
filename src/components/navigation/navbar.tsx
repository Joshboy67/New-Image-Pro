"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "Dashboard", href: "/dashboard", hasDropdown: true },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo on left */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-black">image pro</span>
          </Link>
        </div>

        {/* Navigation in center */}
        <div className="hidden md:flex items-center justify-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium text-black transition-colors hover:text-primary relative py-2",
                pathname === item.href
                  ? "text-black after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-black after:content-['']"
                  : "text-black/80"
              )}
            >
              <span className="flex items-center">
                {item.name}
                {item.hasDropdown && (
                  <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </span>
            </Link>
          ))}
        </div>

        {/* Login/Signup on right */}
        <div className="flex items-center space-x-4">
          <Link
            href="/auth/login"
            className={cn(
              "inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              pathname === "/auth/login" 
                ? "bg-black text-white shadow" 
                : "text-black border border-black hover:bg-black/5"
            )}
          >
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className={cn(
              "inline-flex h-10 items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              pathname === "/auth/signup" ? "bg-black/90" : "bg-black"
            )}
          >
            Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
} 