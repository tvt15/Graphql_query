import React, { useState, useEffect } from "react";
import "./styles.css"; // Import the CSS file for styling
import { useAppContext } from './AppContext';

const Home: React.FC = () => {
  // const [user, setUsername] = useState<string>("");
  // const [repo_name, setReponame] = useState<string>("");
  const { user, repo_name, uid, setUserInfo } = useAppContext();

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // fetchData();
  // };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === "user") {
      setUserInfo(value, repo_name, uid);
    } else if (id === "repo_name") {
      setUserInfo(user, value, uid);
    }else if (id === "uid"){
      setUserInfo(user, repo_name, value)
    }
  };

  return (
    <div className="home-container">
      <div className="heading-container">
        <h1>Welcome to Git-Info</h1>
        <h4>Get all of your GitHub repository details in an organized way!</h4>
      </div>
      <div className="form-container">
        <form>
          <div className="row mb-3">
            <div className="col mb-3">
              <label htmlFor="name" className="form-label">GitHub Username</label>
              <input type="text" value={user} onChange={handleInputChange} className="form-control" id="user" placeholder="Enter username" ></input>
            </div>
            <div className="col mb-3">
              <label htmlFor="name" className="form-label">Repository Name</label>
              <input type="text" value={repo_name} onChange={handleInputChange} className="form-control" id="repo_name" placeholder="Enter repository name"></input>
            </div>
            <div className="col mb-3">
              <label htmlFor="name" className="form-label">GitHub Global ID</label>
              <input type="text" value={uid} onChange={handleInputChange} className="form-control" id="uid" placeholder="Enter repository name"></input>
            </div>
          </div>
          <div className="submit">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;