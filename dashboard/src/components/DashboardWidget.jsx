import { Link } from "react-router-dom";
import "./DashboardWidget.css";
import { IoCalendarOutline } from "react-icons/io5";
const DashboardWidget = ({ title, to, icons}) => (
  <Link className="dashboard-widget" to={to}>
    <div className="dashboard-widget-spacer justify-center">
      {icons.map((icon, index) => (
        <div key={index}>
          {icon}
        </div>
      ))}
    </div>
    <div className="dashboard-widget-title">{title}</div>
  </Link>
);

export default DashboardWidget;
