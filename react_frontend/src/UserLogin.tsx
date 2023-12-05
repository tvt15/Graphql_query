import React, { useState, useEffect } from "react";
import "./styles.css"; 
import UserProfile from "./UserProfile";
import { useAppContext } from './AppContext';

interface User {
  login: string;
  name: string;
  id: string;
  email: string;
  createdAt: string;
}

interface ApiResponse {
  user: User;
}

const UserLogin: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const { user, repo_name } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/github/userlogin?user=${user}`);
      const result: ApiResponse = await response.json();
      setData(result);
    };

    fetchData();
  }, [user, repo_name]);

  return (
    <div className="userlogin-card">
      <div className="card-header">
        <h2 className="card-title">GitHub User Login details</h2>
      </div>
      <div className="card-body">
        {data && (
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th scope="row">Username</th>
                <td>{data.user.login}</td>
              </tr>
              <tr>
                <th scope="row">Name</th>
                <td>{data.user.name}</td>
              </tr>
              <tr>
                <th scope="row">ID</th>
                <td>{data.user.id}</td>
              </tr>
              <tr>
                <th scope="row">Created At</th>
                <td>{data.user.createdAt}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
      <div>
      <UserProfile/>
      </div>
    </div>
  );
};

export default UserLogin;
