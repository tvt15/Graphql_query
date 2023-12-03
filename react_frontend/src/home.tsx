import React, { useState, useEffect } from "react";
import "./styles.css"; // Import the CSS file for styling

const Home: React.FC = () => {
  
    return (
            <div className="form-container mt-5">
                <div className="heading">
                    <h1>Welcome to Git-Info</h1>
                    <h4>Get all of your GitHub repository details in an organized way!</h4>
                </div>
                <form>
                    <div className="row">
                        <div className="col mb-3">
                            <label htmlFor="name" className="form-label">GitHub Username</label>
                            <input type="text" className="form-control" id="username" placeholder="Enter username"></input>
                        </div>
                        <div className="col mb-3">
                            <label htmlFor="email" className="form-label">Repository Name</label>
                            <input type="email" className="form-control" id="repo_name" placeholder="Enter repository name"></input>
                        </div>
                    </div>
                    <div className="submit">
                    <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
    );
  };

export default Home;
