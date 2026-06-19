import React from 'react';

const AnalyticsCard = ({ icon, iconBg = 'bg-primary/10 text-primary', label, value, subtitle, badge, children }) => {
  return (
    <div className="glass-card rounded-2xl p-glass-padding flex flex-col justify-between group transition-all">
      <div className="flex justify-between items-start">
        <div className={`p-3 ${iconBg} rounded-xl transition-transform group-hover:scale-110`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        </div>
        {badge && <span className="text-label-md text-on-tertiary-fixed-variant bg-tertiary/10 px-2 py-1 rounded">{badge}</span>}
        {children}
      </div>
      <div className="mt-stack-lg">
        <p className="text-on-surface-variant font-semibold text-label-md uppercase tracking-wider">{label}</p>
        <h3 className="text-headline-md font-bold mt-1">{value}</h3>
        {subtitle && <p className="text-body-sm text-on-surface-variant mt-2">{subtitle}</p>}
      </div>
    </div>
  );
};

export default AnalyticsCard;
