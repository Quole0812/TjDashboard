import Sidebar from '../components/Sidebar';
import './courses.css';

const Courses = () => {
  return (
    <div>
      <Sidebar />
       <main>
        <h1>Courses</h1>
        {/*
        <div class="course-dashboard">
        <button class="add-class-btn">Add Class</button>
          <div class="card"> Class 1 </div>
        </div>
        */}
  <div class="column">
    <div class="card">
      <div class="container">
        <h2>Jane Doe</h2>
        <p class="title">Class 1</p>
        <p>lorem ipsum ipsum lorem.</p>
        <p>jane@example.com</p>
        <p><button class="button">View Class</button></p>
      </div>
    </div>
  </div>
        
      </main>
      

    </div>
    

    
  );
};

export default Courses;
