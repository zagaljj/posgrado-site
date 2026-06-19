"use client";

const Logo = ({ theme = "light", size = "normal" }) => {
  const textColor = theme === "light" ? "white" : "var(--udi-navy)";
  const isSmall = size === "small";

  return (
    <div className={`flex items-center gap-4 ${isSmall ? "scale-75 origin-left" : ""}`}>
      {/* Left Text Part */}
      <div className={`flex flex-col text-right leading-none ${theme === "light" ? "text-white" : "text-udi-navy"}`}>
        <span className="font-montserrat font-black text-lg tracking-[1px] uppercase">
          Educación
        </span>
        <span className="font-montserrat font-black text-lg tracking-[1px] uppercase">
          Continua
        </span>
      </div>

      {/* Vertical Separator */}
      <div className={`h-11 w-[1px] ${theme === "light" ? "bg-white/30" : "bg-udi-navy/30"}`} />

      {/* UDI Shield with Text */}
      <div className="flex items-center gap-2">
        <div className="relative group">
          <svg width="42" height="48" viewBox="0 0 80 92" fill="none">
            {/* Split Shield Background */}
            <path
              d="M40 3L6 16V44C6 64 22 80 40 88V3Z"
              fill="#B81A1C" /* Rojo UDI */
            />
            <path
              d="M40 3L74 16V44C74 64 58 80 40 88V3Z"
              fill="#8A8A8A" /* Gris UDI */
            />
            
            {/* Inner details (Lines on gray side) */}
            <line x1="45" y1="40" x2="65" y2="40" stroke="white" strokeWidth="1" opacity="0.4" />
            <line x1="45" y1="45" x2="65" y2="45" stroke="white" strokeWidth="1" opacity="0.4" />
            <line x1="45" y1="50" x2="65" y2="50" stroke="white" strokeWidth="1" opacity="0.4" />
            <line x1="45" y1="55" x2="65" y2="55" stroke="white" strokeWidth="1" opacity="0.4" />

            {/* Inner Motto (innovatio scientia artis) */}
            <text x="12" y="32" fill="white" style={{ fontSize: '6px', fontWeight: 'bold' }} className="font-poppins uppercase">innovatio</text>
            <text x="16" y="42" fill="white" style={{ fontSize: '6px', fontWeight: 'bold' }} className="font-poppins uppercase">scientia</text>
            <text x="24" y="52" fill="white" style={{ fontSize: '6px', fontWeight: 'bold' }} className="font-poppins uppercase">artis</text>
          </svg>
        </div>

        {/* Right "udi" Text */}
        <span className={`font-montserrat font-black text-[38px] leading-none tracking-[-3px] ${theme === "light" ? "text-white" : "text-black"}`}>
          udi
        </span>
      </div>
    </div>
  );
};

export default Logo;
