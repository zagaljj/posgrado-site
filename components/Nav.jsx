"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/catalogo", label: "Diplomados" },
    { href: "/postitulos", label: "Postítulos" },
    { href: "/cursos", label: "Cursos y Talleres" },
    { href: "/contacto", label: "Contacto" },
    { href: "http://www.udi.edu.bo", label: "UDI", external: true },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-400 ${
        scrolled || isOpen
          ? "bg-udi-navy/97 backdrop-blur-md border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 flex items-center justify-between md:justify-start h-[72px]">
        {/* Logo */}
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity z-50">
          <img 
            src="/logo-white.png" 
            alt="UDI Educación Continua" 
            className="h-10 w-auto"
          />
        </Link>

        {/* Center rule - Desktop only */}
        <div className="flex-1 h-px bg-white/12 mx-10 hidden md:block" />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center">
          {links.map(({ href, label, external }) => {
            const active = pathname === href;
            const props = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
            return (
              <Link
                key={label}
                href={href}
                {...props}
                className={`px-5 py-2 font-poppins text-xs font-medium tracking-[2px] uppercase transition-all border-b ${
                  active && !external
                    ? "text-white border-white"
                    : "text-white/55 border-transparent hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
          
          <Link
            href="/admin"
            className="ml-6 border border-white/30 font-poppins text-[11px] font-medium tracking-[2px] uppercase text-white/75 px-[18px] py-2 rounded-[2px] hover:bg-white/10 hover:border-white/60 transition-all"
          >
            Admin
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden text-white p-2 z-50 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <div className="relative w-6 h-5">
            <span className={`absolute left-0 w-full h-[2px] bg-white rounded-full transition-all duration-300 ${isOpen ? "top-2.5 rotate-45" : "top-0"}`}></span>
            <span className={`absolute left-0 w-full h-[2px] bg-white rounded-full transition-all duration-300 top-2.5 ${isOpen ? "opacity-0" : "opacity-100"}`}></span>
            <span className={`absolute left-0 w-full h-[2px] bg-white rounded-full transition-all duration-300 ${isOpen ? "top-2.5 -rotate-45" : "top-5"}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden fixed inset-0 bg-udi-navy z-40 transition-transform duration-300 ease-in-out flex flex-col pt-[100px] px-8 overflow-y-auto pb-10 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-6">
          {links.map(({ href, label, external }) => {
            const active = pathname === href;
            const props = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
            return (
              <Link
                key={label}
                href={href}
                {...props}
                onClick={() => setIsOpen(false)}
                className={`font-poppins text-sm font-medium tracking-[2px] uppercase transition-colors ${
                  active && !external ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
          
          <div className="w-8 h-px bg-white/20 my-2" />
          
          <Link
            href="/admin"
            onClick={() => setIsOpen(false)}
            className="self-start border border-white/30 font-poppins text-[11px] font-medium tracking-[2px] uppercase text-white/75 px-[18px] py-2.5 rounded-[2px] hover:bg-white/10 transition-all"
          >
            Panel Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
