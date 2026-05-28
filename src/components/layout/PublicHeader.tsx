"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

import { VellumLogo } from "@/components/brand/VellumLogo";
import { publicNavigation, routes } from "@/lib/routes";

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Gradient fade behind header */}
      <div 
        className="absolute inset-x-0 top-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, var(--abyss) 0%, transparent 100%)"
        }}
      />
      
      <div className="relative mx-auto max-w-7xl px-4 pt-4 sm:px-6 sm:pt-6">
        <nav className="glass rounded-2xl px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              className="group flex items-center gap-2"
              href={routes.public.home}
              aria-label="Vellum — retour à l'accueil"
            >
              <VellumLogo size="sm" tone="gold" />
              <span className="font-display text-lg text-paper tracking-tight">
                Vellum
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav
              aria-label="Navigation principale"
              className="hidden items-center gap-1 md:flex"
            >
              {publicNavigation.map((item) => (
                <a
                  className="relative px-4 py-2 text-sm font-medium text-silver transition-colors hover:text-paper group"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                  <span className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                className="hidden text-sm font-medium text-silver transition-colors hover:text-paper sm:block"
                href={routes.public.login}
              >
                Connexion
              </a>
              <a
                className="group relative inline-flex h-10 items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-gold to-gold-deep px-5 text-sm font-semibold text-void transition-all hover:shadow-[0_0_30px_rgba(245,166,35,0.3)]"
                href={routes.public.register}
              >
                <span className="relative z-10">Déposer un projet</span>
                <ArrowRight
                  className="relative z-10 size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
                {/* Shine effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </a>

              {/* Mobile menu button */}
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg p-2 text-silver hover:text-paper md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="mt-4 border-t border-graphite pt-4 md:hidden">
              <div className="flex flex-col gap-2">
                {publicNavigation.map((item) => (
                  <a
                    className="px-3 py-2 text-sm font-medium text-silver transition-colors hover:text-paper"
                    href={item.href}
                    key={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <a
                  className="px-3 py-2 text-sm font-medium text-silver transition-colors hover:text-paper"
                  href={routes.public.login}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Connexion
                </a>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
