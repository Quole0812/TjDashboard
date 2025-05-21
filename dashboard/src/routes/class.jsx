import Sidebar from '../components/Sidebar';
import { Link, useParams } from 'react-router-dom';

// Reference figma layout
// class page, viewing teacher's class + roster
// add this to Jackson's code

const Class = () => {
  const { id } = useParams();
  
  return (
    <div>
      <Sidebar />
      <Link to={`/teacherDash/${id}`}>
        <button className="px-4 py-2 bg-gray-200 rounded shadow">
            Teacher Dashboard
        </button>
      </Link>
      
    </div>
  );
};

export default Class;
