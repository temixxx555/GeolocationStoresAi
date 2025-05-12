"use client";

import Link from "next/link";
import { Home, MapPin, Search, Globe, ShoppingBag, Bookmark, Bell, Menu } from "lucide-react";

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavLink = ({ href, icon, label, active = false }: NavLinkProps) => {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 text-sm font-medium transition-colors ${
        active ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default function NavBar() {
  return (
    <header className="w-full bg-white/90 backdrop-blur-md p-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Globe className="text-indigo-600 h-8 w-8" />
        <span className="font-bold text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Zazzer
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-8">
        <NavLink href="/" icon={<Home className="h-5 w-5" />} label="Home" active={false} />
        <NavLink href="/explore" icon={<MapPin className="h-5 w-5" />} label="Explore" active={true} />
        <NavLink
          href="/marketplace"
          icon={<ShoppingBag className="h-5 w-5" />}
          label="Marketplace"
          active={false}
        />
        <NavLink href="/saved" icon={<Bookmark className="h-5 w-5" />} label="Saved" active={false} />
      </nav>

      {/* Search and Actions */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="hidden md:flex relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-48 transition-all duration-200"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>

        {/* Notification Bell */}
        <button className="p-2 relative rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
          <Bell className="h-5 w-5 text-gray-700" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Mobile Menu Toggle */}
        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors md:hidden">
          <Menu className="h-5 w-5 text-gray-700" />
        </button>
      </div>
    </header>
  );
}