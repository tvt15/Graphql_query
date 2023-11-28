import React, { useState, useEffect } from "react";
import "./styles.css"; // Import the CSS file for styling

// Define the shape of the data you expect from the API, adjust as needed.
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

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/github/userlogin");
      const result: ApiResponse = await response.json();
      setData(result);
    };

    fetchData();
  }, []);

  return (
    // <div>
    //   {data && (
    //     <div>
    //       <p>Login: {data.user.login}</p>
    //       <p>Name: {data.user.name}</p>
    //       <p>ID: {data.user.id}</p>
    //       <p>Email: {data.user.email}</p>
    //       <p>Created At: {data.user.createdAt}</p>
    //     </div>
    //   )}
    // </div>
    <div>
      {data && (
        <table className="user-table">
          <thead>
            <tr>
              <th>Login</th>
              <th>Name</th>
              <th>ID</th>
              {/* <th>Email</th> */}
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{data.user.login}</td>
              <td>{data.user.name}</td>
              <td>{data.user.id}</td>
              {/* <td>{data.user.email}</td> */}
              <td>{data.user.createdAt}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserLogin;
