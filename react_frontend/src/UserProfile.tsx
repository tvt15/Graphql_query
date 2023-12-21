import React, { useEffect, useState } from 'react';
import { useAppContext } from './AppContext';

const UserProfile = () => {
  const [userData, setUserData] = useState(null as null | { login: string; avatar_url: string } | undefined);
  const { user } = useAppContext();

  useEffect(() => {
    const username = user;

    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      {userData && (
        <div>
          {/* <h2>{userData?.login}</h2> */}
          <img src={userData?.avatar_url} alt="User Avatar" style={{ height: '100px', width: '100px' }} />
        </div>
      )}
    </div>
  );
};

export default UserProfile;
