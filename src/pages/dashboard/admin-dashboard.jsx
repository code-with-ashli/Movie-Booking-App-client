import { NavLink } from 'react-router-dom';
import './admin.style.css'
import { useState } from 'react';

import CreateTheatreTab from './components/admin/create-theatre';
import CreateHallTab from './components/admin/create-hall';
import CreateMovieTab from './components/admin/create-movies';
import CreateShowTab from './components/admin/create-show';
const AdminDashboard = () => {
    const [selectedTab, setSelectedTab] = useState("create-theatre");

    const selectTab = (id) => setSelectedTab(id);

  return (
    <div className='admin-dashboard-container'>
      <div className='sidebar'>
        <div className='sidebar-item'>
            <h6>Create</h6>
            <ul>
                <li onClick={() => selectTab('create-theatre')}> Theatre </li>
                <li onClick={() =>selectTab('create-movie')} > Movies </li>
                <li onClick={() =>selectTab('create-hall')} > Halls </li>
            </ul>
        </div>
        <div className='sidebar-item'>
            <h6>Manage</h6>
            <ul>
                <li  onClick={() =>selectTab('create-show')} > Manage Show </li>
            </ul>
        </div>
      </div>
      <div className='main-content'>
       {selectedTab ==='create-theatre' && <CreateTheatreTab />}
       {selectedTab ==='create-hall' && <CreateHallTab />}
       {selectedTab ==='create-movie' && <CreateMovieTab />}
       {selectedTab ==='create-show' && <CreateShowTab />}
      </div>
    </div>
  );
};

export default AdminDashboard;
