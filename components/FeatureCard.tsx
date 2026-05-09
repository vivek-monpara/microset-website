import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  gradient?: string;
}

export function FeatureCard({ icon, title, description, gradient = 'from-blue-500 to-blue-600' }: FeatureCardProps) {
  return (
    <div className="rounded-2xl bg-white border border-border p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden">
      {/* Subtle top accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} rounded-t-2xl`} />

      {/* Icon */}
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
