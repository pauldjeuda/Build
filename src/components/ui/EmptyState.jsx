import React from 'react';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({ icon: Icon = PackageOpen, title = 'Aucun élément', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-2xl bg-[#F4F1EB] border border-[#E8E2D9] flex items-center justify-center">
          <Icon size={26} className="text-obsidian-300" strokeWidth={1.5} />
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-[#E8E2D9] flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-obsidian-200" />
        </div>
      </div>
      <h3 className="font-display text-sm font-semibold text-obsidian-800 mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-obsidian-400 max-w-xs leading-relaxed mb-5 font-sans">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
