import { formatCurrency } from '../../../utils/formatters';
import './AnalyticsCard.css';

const AnalyticsCard = ({ icon, value, label, trend, color }) => {
  const trendPositive = trend && trend.change > 0;
  const trendNegative = trend && trend.change < 0;

  return (
    <div className="analytics-card" style={{ '--analytics-color': color }}>
      <div className="analytics-icon">
        {icon}
      </div>

      <div className="analytics-value">{value}</div>

      <div className="analytics-label">{label}</div>

      {trend && (
        <div className={`analytics-trend ${trendPositive ? 'trend-positive' : trendNegative ? 'trend-negative' : ''}`}>
          {trendPositive ? '↗' : trendNegative ? '↘' : '→'} {trend.text}
        </div>
      )}
    </div>
  );
};

export default AnalyticsCard;
