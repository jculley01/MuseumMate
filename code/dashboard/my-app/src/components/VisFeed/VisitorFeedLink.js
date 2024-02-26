import * as React from 'react';
import BackCard from './BackCard';
import CardTitle from '../ExOverview/CardTitle';
import ViewAll from './ViewAll';

const VisitorFeedLink=()=>{

    const handleButtonClick = () => {
        console.log('Button clicked!');
        // Add your click handling logic here
      };


const title='Visitor Feedback'
    return(
<BackCard>
    <CardTitle text={title}/>
    <ViewAll onClick={handleButtonClick} />
</BackCard>
    )

}

export default VisitorFeedLink