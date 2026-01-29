import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 35px,
            rgba(255,255,255,0.1) 35px,
            rgba(255,255,255,0.1) 70px
          )`
        }}></div>
      </div>

      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 py-16 md:py-20">
          {/* Brand section - larger emphasis */}
          <div className="md:col-span-5 space-y-6">
            <div className="group">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3 transition-all duration-300 hover:tracking-wide">
                Xanton
              </h1>
              <div className="h-1 w-24 bg-white transform origin-left transition-all duration-500 group-hover:w-40"></div>
            </div>
            <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed max-w-md">
              Connecting our world to the past
            </p>
            
            {/* Social media - integrated into brand section */}
          
          </div>

          {/* Navigation sections */}
          <div className="md:col-span-7 grid grid-cols-2 gap-8 md:gap-12 md:pl-12">
            {/* About Us */}
            <div className="space-y-6">
              <h2 className="text-xs uppercase tracking-[0.3em] text-gray-500 font-semibold mb-6">
                About Us
              </h2>
              <ul className="space-y-4">
                {[
                  { text: "About", href: "/about" },
                  { text: "Features",  href: "/features" },
                ].map((link) => (
                  <li key={link.text}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center text-base md:text-lg text-gray-300 hover:text-white transition-colors duration-300"
                    >
                      <span className="w-0 group-hover:w-6 h-px bg-white transition-all duration-300 mr-0 group-hover:mr-3"></span>
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us */}
            <div className="space-y-6">
              <h2 className="text-xs uppercase tracking-[0.3em] text-gray-500 font-semibold mb-6">
                Contact Us
              </h2>
              <ul className="space-y-4">
                {[
                  { text: "Contact", href: "/feedback" }
                ].map((link) => (
                  <li key={link.text}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center text-base md:text-lg text-gray-300 hover:text-white transition-colors duration-300"
                    >
                      <span className="w-0 group-hover:w-6 h-px bg-white transition-all duration-300 mr-0 group-hover:mr-3"></span>
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white border-opacity-10 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p className="font-light">
              © {new Date().getFullYear()} Xanton. All rights reserved.
            </p>
            <div className="flex gap-8">
              <a href="/privacy" className="hover:text-white transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-white transition-colors duration-300">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;