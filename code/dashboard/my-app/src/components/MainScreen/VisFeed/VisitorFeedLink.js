import * as React from 'react';
import BackCard from './BackCard';
import CardTitle from '../ExOverview/CardTitle';
import ViewAll from './ViewAll';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const VisitorFeedLink=()=>{
    const navigate = useNavigate(); // Initialize useNavigate hook
    
    const handleButtonClick = () => {
        navigate('/feedback');
        // Add your click handling logic here
      };


const title='Visitor Feedback'
    return(
<BackCard>
    <CardTitle style={{display:'flex', marginTop:'10px', padding:'15px', marginLeft:'0px'}}text={title}/>
    <ViewAll onClick={handleButtonClick} />
</BackCard>
    )

}

export default VisitorFeedLink