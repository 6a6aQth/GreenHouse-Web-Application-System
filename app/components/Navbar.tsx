"use client";
import { Navbar, NavBody, NavItems, MobileNav, MobileNavHeader, MobileNavMenu, MobileNavToggle, NavbarLogo } from "@/components/ui/resizable-navbar";
import Image from "next/image";
import { useState } from "react";

  const navItems = [
  { name: "Home", link: "#home" },
  { name: "Products & Services", link: "#products" },
  { name: "About", link: "#about" },
  { name: "Contact", link: "#contact" },
];

export default function CustomNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Navbar className="top-0 fixed bg-transparent">
      <NavBody>
        <a href="#" className="flex items-center space-x-2 px-2 py-1">
          <Image src="/Logo2.png" alt="Smart Agri Solutions" width={120} height={36} className="h-16 w-auto" />
        </a>
        <NavItems items={navItems} />
      </NavBody>
      <MobileNav>
        <MobileNavHeader>
          <a href="#" className="flex items-center space-x-2 px-2 py-1">
            <Image src="/Logo2.png" alt="Smart Agri Solutions" width={120} height={36} className="h-12 w-auto" />
          </a>
          <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        </MobileNavHeader>
        <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
            {navItems.map((item) => (
              <a
                key={item.name}
              href={item.link}
                className="text-slate-700 hover:text-green-600 block px-3 py-2 text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
