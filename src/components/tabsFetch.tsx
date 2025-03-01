import { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import 'bootstrap/dist/css/bootstrap.min.css';
import Reviews from './reviews';
// use param

function TabsFetch({ userDetail }: { userDetail: any }) {
  const [key, setKey] = useState('home');

  return (
    <div className="container mt-4  bg-light shadow-sm rounded">

      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k || 'home')}
        className="mb-3"
        fill
      >
        <Tab eventKey="home" title="Services" className="p-3">
          <h4>Services Offered</h4>
          {userDetail.skills && userDetail.skills.length > 0 ? (
            <ul className="list-group">
              {userDetail.skills.split(',').map((skill: string, index: number) => (
                <li key={index} className="list-group-item">{skill}</li>
              ))}
            </ul>
          ) : (
            <p>No services available.</p>
          )}
     
        </Tab>

        <Tab eventKey="Reviews" title="Reviews" >
      <Reviews userDetail={userDetail} />
        </Tab>

        <Tab eventKey="Photos" title="Photos" >
          <h4>Work Samples</h4>
          <div className="d-flex flex-wrap gap-3">
            <img src="https://via.placeholder.com/150" alt="Sample 1" className="rounded border" />
            <img src="https://via.placeholder.com/150" alt="Sample 2" className="rounded border" />
            <img src="https://via.placeholder.com/150" alt="Sample 3" className="rounded border" />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default TabsFetch;
