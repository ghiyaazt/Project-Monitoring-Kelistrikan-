import { wattwiseIcon, wattwiseText } from "../../../assets/logos";

interface SidebarLogoProps {
  collapsed: boolean;
  isDark: boolean;
  onToggle: () => void;
}

export default function SidebarLogo({ collapsed, isDark, onToggle }: SidebarLogoProps) {
  const textTertiary = isDark ? 'text-slate-500' : 'text-gray-500';

  if (!collapsed) {
    return (
      <div className="p-4">
        <button 
          onClick={onToggle}
          className="w-full flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 shrink-0">
            <img 
              src={wattwiseIcon} 
              alt="WattWise" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-left">
            <img 
              src={wattwiseText} 
              alt="WattWise"
              className="h-6 w-auto"
            />
            <p className={`text-[10px] uppercase tracking-wider font-medium ${textTertiary}`}>Smart Monitoring</p>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <button 
        onClick={onToggle}
        className="w-full flex justify-center hover:opacity-80 transition-opacity"
      >
        <div className="w-10 h-10">
          <img 
            src={wattwiseIcon} 
            alt="WattWise" 
            className="w-full h-full object-contain"
          />
        </div>
      </button>
    </div>
  );
}
