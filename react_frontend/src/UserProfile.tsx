import React, { useEffect, useState } from 'react';

const UserProfile = () => {
  const [userData, setUserData] = useState(null as null | { login: string; avatar_url: string } | undefined);

  useEffect(() => {
    const username = 'tvt15';

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
          <h2>{userData?.login}</h2>
          <img src={userData?.avatar_url} alt="User Avatar" />
        </div>
      )}
    </div>
  );
};

export default UserProfile;
