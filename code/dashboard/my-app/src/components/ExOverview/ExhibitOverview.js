import * as React from 'react';
import './ExhibitOverview.css'
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
import PrecentChange from './PrecentChange';
import UserTitles from './UserTitles.js';

const ExhibitOverview = ({ data }) => {
    const activeUsers = 534;
    const activeUsersPercentageChange = 28.4;
    const totalUsersToday = '1424 Users';
    const totalUsersTodayPercentageChange = -7.4;
    const labelTotal='Total Today'
  
    return (
      <BackCard>
         <div className="card-header">
          <CardTitle/>
          <Dropdown/>
        </div>
        <ActiveCard>
          <div className="users-infoactive-users">
            <ActiveIcon/>
            <ActiveLabel/>
            <PrecentChange label={activeUsersPercentageChange}/>
            <UserTitles/>
            
          </div>
          <TotalCard>
            <TotalIcon/>
            <ActiveLabel text={labelTotal}/>
            <PrecentChange label={totalUsersTodayPercentageChange}/>
            <UserTitles text={totalUsersToday}/>
            
          </TotalCard>
        </ActiveCard>
        
        <div className="card-footer">
          <FooterTitle/>
          <NotiButton/>
        </div>
      </BackCard>
       
    );
  };
  
export default ExhibitOverview;
