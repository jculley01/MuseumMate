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
import PrecentChange from './PrecentChange.js';
import UserTitles from './UserTitles.js';



const ExhibitOverview = ({ data }) => {
  const activeUsers = 534;
  const activeUsersPercentageChange = 28.4;
  const totalUsersToday = '1424 Users';
  const totalUsersTodayPercentageChange = -7.4;
  const labelTotal = 'Total Today';

  return (
    <BackCard>
      <div className="card-header" style={{ marginRight: '15px' }}>
        <CardTitle style={{ marginLeft: '15px', marginRight: '15px', marginTop: '10px' }}/>
        <Dropdown />
      </div>
      <div style={{ display: 'flex', position: 'relative', paddingBottom: '130px' }}>
        <ActiveCard>
          <div className="users-infoactive-users" style={{ display: 'flex', alignItems: 'center', marginTop:'1.375rem'}}>
            <div style={{ marginRight: '10px' }}>
              <ActiveIcon />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '14.5625rem'}}>
                <ActiveLabel />
                <PrecentChange label={`+ ${activeUsersPercentageChange}%`} />
              </div>
              <UserTitles text={activeUsers + ' Users'} />
            </div>
          </div>
        </ActiveCard>

        <TotalCard>
          <div className="total-users-info" style={{ display: 'flex', alignItems: 'center',marginTop:'1.25rem', marginLeft:'10px' }}>
            <div style={{ marginRight: '10px' }}>
              <TotalIcon />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', whiteSpace: 'nowrap' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '14.5625rem'}}>
                <ActiveLabel text={labelTotal} />
                <PrecentChange label={`${totalUsersTodayPercentageChange}%` }/>
              </div>
              <UserTitles text={totalUsersToday} />
              
            </div>
          </div>
        </TotalCard>
      </div>
      <div className="card-footer" style={{
        marginTop: '20px',
        display: 'flex', // This makes the container a flex container.
        alignItems: 'center', // This vertically centers the items.
        justifyContent: 'space-between', // This pushes one item to the left and the other to the right.
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
