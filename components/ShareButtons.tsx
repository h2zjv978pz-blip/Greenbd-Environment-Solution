'use client';

import { useState } from 'react';
import { Facebook, Linkedin, Twitter, MessageCircle, Link2, Check } from 'lucide-react';

export default function ShareButtons({ title, label, copiedLabel }: { title: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== 'undefined' ? window.location.href : '';
  const encodedUrl   = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    { name: 'WhatsApp', icon: MessageCircle, href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, color: 'hover:bg-[#25D366] hover:text-white hover:border-[#25D366]' },
    { name: 'Facebook', icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, color: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]' },
    { name: 'LinkedIn', icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, color: 'hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]' },
    { name: 'X', icon: Twitter, href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, color: 'hover:bg-black hover:text-white hover:border-black' },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div>
      <p className="text-[10px] lg:text-xs text-gray-400 font-medium uppercase tracking-wide mb-2.5">{label}</p>
      <div className="flex items-center gap-2 flex-wrap">
        {links.map(({ name, icon: Icon, href, color }) => (
          <a key={name} href={href} target="_blank" rel="noopener noreferrer" title={`Share on ${name}`}
            className={`w-8 h-8 lg:w-9 lg:h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 transition-colors ${color}`}>
            <Icon className="w-4 h-4" />
          </a>
        ))}
        <button onClick={copyLink} title={copied ? copiedLabel : 'Copy link'}
          className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-colors">
          {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
        </button>
      </div>
      {copied && <p className="text-[10px] text-primary-600 font-medium mt-1.5">{copiedLabel}</p>}
    </div>
  );
}
