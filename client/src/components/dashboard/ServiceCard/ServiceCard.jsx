import './ServiceCard.css';

const ServiceCard = ({ icon, title, color, onClick }) => {
  return (
    <div 
      className="service-card" 
      style={{ '--service-color': color }}
      onClick={onClick}
    >
      <div className="service-card-icon">{icon}</div>
      <span className="service-card-title">{title}</span>
    </div>
  );
};

export default ServiceCard;
