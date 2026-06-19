"use client";

const Shield = ({ size = 48, color = "#fff", opacity = 1, className = "" }) => (
  <div className={className} style={{ opacity }}>
    <svg width={size} height={size * 1.15} viewBox="0 0 80 92" fill="none">
      <path
        d="M40 3L6 16V44C6 64 22 80 40 88C58 80 74 64 74 44V16L40 3Z"
        stroke={color}
        strokeWidth="2.5"
        fill={color}
        fillOpacity="0.08"
      />
      <path
        d="M40 12L14 22V44C14 60 26 74 40 80C54 74 66 60 66 44V22L40 12Z"
        stroke={color}
        strokeWidth="1.5"
        fill={color}
        fillOpacity="0.06"
      />
      <line
        x1="28"
        y1="46"
        x2="52"
        y2="46"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="40"
        y1="30"
        x2="40"
        y2="52"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="40" cy="46" r="5" fill={color} fillOpacity="0.3" />
      <path
        d="M24 56H56"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  </div>
);

export default Shield;
