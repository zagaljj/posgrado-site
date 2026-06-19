const SectionLabel = ({ n, label, light = false }) => (
  <div className="flex items-center gap-4 mb-12">
    <span
      className={`font-montserrat font-black text-[11px] tracking-[3px] uppercase ${
        light ? "text-white/30" : "text-udi-gray"
      }`}
    >
      {n.toString().padStart(2, "0")}
    </span>
    <div
      className={`flex-1 h-px ${
        light ? "bg-white/12" : "bg-udi-border"
      }`}
    />
    <span
      className={`font-poppins font-normal text-[11px] tracking-[3px] uppercase ${
        light ? "text-white/40" : "text-udi-gray"
      }`}
    >
      {label}
    </span>
  </div>
);

export default SectionLabel;
