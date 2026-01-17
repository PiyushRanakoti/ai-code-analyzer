import React from 'react';
import { Users } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-12 pt-6 border-t border-slate-900 text-center">
      <div className="flex items-center justify-center gap-2 text-slate-500 mb-2">
        <Users className="w-4 h-4" />
        <span className="text-xs">Created by <a href="https://github.com/PiyushRanakoti" target='_blank'>Piyush Ranakoti @ 2025</a>  </span>
      </div>
    </footer>
  );
};

export default Footer;
