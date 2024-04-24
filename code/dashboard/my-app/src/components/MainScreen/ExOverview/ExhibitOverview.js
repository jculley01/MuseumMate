import * as React from 'react';
import { useState, useEffect } from 'react';
import './ExhibitOverview.css';
import Dropdown from './Dropdown.js';
import BackCard from './BackCard.js';
import CardTitle from './CardTitle.js';
import ActiveCard from './ActiveCard.js';
import TotalCard from './TotalCard.js';
import NotiButton from './NotiButton.js';
import FooterTitle from './FooterTitle.js';
import ActiveIcon from './ActiveIcon.js';
import TotalIcon from './TotalIcon.js';
import ActiveLabel from './ActiveLabel.js';
import UserTitles from './UserTitles.js';

const ExhibitOverview = () => {
  const [activeUsers, setActiveUsers] = useState('Loading...');
  const [totalUsersToday, setTotalUsersToday] = useState('Loading...');
  const refreshInterval = 3000;

  useEffect(() => {
    const fetchData = async () => {
      await fetchActiveUsers();
      await fetchTotalUsersToday();
    };

    fetchData(); // Initial fetch

    const interval = setInterval(fetchData, refreshInterval); // Set up interval for refreshing data

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const fetchActiveUsers = async () => {
    try {
      const response = await fetch('http://128.197.53.112:3000/api/active-users');
      if (!response.ok) {
        throw new Error('Failed to fetch active users.');
      }
      const data = await response.json();
      setActiveUsers(data.activeUsers);
    } catch (error) {
      console.error('Error fetching active users:', error);
      setActiveUsers('Error');
    }
  };

  const fetchTotalUsersToday = async () => {
    try {
      const response = await fetch('http://128.197.53.112:3000/api/total-users');
      if (!response.ok) {
        throw new Error('Failed to fetch total users today.');
      }
      const data = await response.json();
      setTotalUsersToday(data.totalUsers);
    } catch (error) {
      console.error('Error fetching total users today:', error);
      setTotalUsersToday('Error');
    }
  };

  return (
    <BackCard>
      <div className="card-header" style={{ marginRight: '15px' }}>
        <CardTitle style={{ marginLeft: '15px', marginRight: '15px', marginTop: '10px' }} />
      
      </div>
      <div style={{ display: 'flex', position: 'relative', paddingBottom: '130px' }}>
        <ActiveCard>
          <div className="users-infoactive-users" style={{ display: 'flex', alignItems: 'center', marginTop: '1.375rem' }}>
            <div style={{ marginRight: '10px' }}>
              <ActiveIcon />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '14.5625rem' }}>
                <ActiveLabel />
              </div>
              <UserTitles text={`${activeUsers} Users`} />
            </div>
          </div>
        </ActiveCard>

        <TotalCard>
          <div className="total-users-info" style={{ display: 'flex', alignItems: 'center', marginTop: '1.25rem', marginLeft: '10px' }}>
            <div style={{ marginRight: '10px' }}>
              <TotalIcon />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', whiteSpace: 'nowrap' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '14.5625rem' }}>
                <ActiveLabel text={'Total Today'} />
              </div>
              <UserTitles text={`${totalUsersToday} Users`} />
            </div>
          </div>
        </TotalCard>
      </div>
      <div className="card-footer" style={{
        marginTop: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: '15px',
        marginRight: '15px'
      }}>
        <FooterTitle />
        <NotiButton />
      </div>
    </BackCard>
  );
};

export default ExhibitOverview;
