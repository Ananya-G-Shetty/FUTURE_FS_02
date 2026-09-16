import React from 'react';
import { 
  Users, 
  Sparkles, 
  PhoneCall, 
  Award, 
  TrendingUp 
} from 'lucide-react';

export default function StatsOverview({ stats, onFilterStatus }) {
  if (!stats) return null;

  const cards = [
    {
      id: 'total',
      title: 'Total Pipeline',
      value: stats.total || 0,
      subtext: 'All recorded leads',
      icon: Users,
      color: '#818cf8',
      bg: 'rgba(99, 102, 241, 0.14)',
      gradient: 'linear-gradient(90deg, #6366f1, #818cf8)',
      status: 'all'
    },
    {
      id: 'new',
      title: 'New Inquiries',
      value: stats.new || 0,
      subtext: 'Awaiting first contact',
      icon: Sparkles,
      color: '#06b6d4',
      bg: 'rgba(6, 182, 212, 0.14)',
      gradient: 'linear-gradient(90deg, #06b6d4, #38bdf8)',
      status: 'new'
    },
    {
      id: 'contacted',
      title: 'In Conversation',
      value: stats.contacted || 0,
      subtext: 'Active follow-ups',
      icon: PhoneCall,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.14)',
      gradient: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
      status: 'contacted'
    },
    {
      id: 'converted',
      title: 'Converted Clients',
      value: stats.converted || 0,
      subtext: 'Won opportunities',
      icon: Award,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.14)',
      gradient: 'linear-gradient(90deg, #10b981, #34d399)',
      status: 'converted'
    },
    {
      id: 'rate',
      title: 'Conversion Rate',
      value: `${stats.conversionRate || 0}%`,
      subtext: `${stats.converted || 0} of ${stats.total || 0} leads`,
      icon: TrendingUp,
      color: '#a855f7',
      bg: 'rgba(168, 85, 247, 0.14)',
      gradient: 'linear-gradient(90deg, #8b5cf6, #d946ef)',
      status: null
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map(card => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className="glass-card stat-card"
            style={{ 
              '--accent-gradient': card.gradient,
              cursor: card.status ? 'pointer' : 'default'
            }}
            onClick={() => card.status && onFilterStatus && onFilterStatus(card.status)}
            title={card.status ? `Filter table by ${card.title}` : undefined}
          >
            <div className="stat-header">
              <span className="stat-title">{card.title}</span>
              <div
                className="stat-icon-wrap"
                style={{
                  '--icon-bg': card.bg,
                  '--icon-color': card.color
                }}
              >
                <IconComponent size={20} />
              </div>
            </div>

            <div className="stat-value">{card.value}</div>
            <div className="stat-subtext">{card.subtext}</div>
          </div>
        );
      })}
    </div>
  );
}
