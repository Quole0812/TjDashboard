import { Link } from 'react-router-dom';
import './DashboardWidget.css';

const DashboardWidget = ({ title, to }) => (
  <Link className="dashboard-widget" to={to}>
    <div className="dashboard-widget-spacer" />
    <div className="dashboard-widget-title">{title}</div>
  </Link>
);

export default DashboardWidget;