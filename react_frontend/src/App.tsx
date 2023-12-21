import React from "react";
import {Container, Nav, Navbar, NavDropdown, Tab} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import UserLogin from "./UserLogin";
import RepositoryCommits from "./RepositoryCommits";
import RepositoryContributorsContribution from "./RepositoryContributorsContribution"
import RepositoryContributors from "./RepositoryContributors";
import Home from "./home";
import UserProfile from "./UserProfile";
import "./styles.css";
import { AppProvider } from './AppContext';

const App: React.FC = () => {
    return (
      <AppProvider>
        <Router>
          <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
              <div className="container">
                <Link to="/" className="navbar-brand">
                  Git-Info
                </Link>
                <div className="collapse navbar-collapse nav nav-fill">
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <Link to="/" className="nav-link">
                        Home
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/userlogin" className="nav-link">
                        User Login
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/commits" className="nav-link">
                        Repo Commits
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/contributions" className="nav-link">
                        Contributor's Contributions
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/contributors" className="nav-link">
                        Contributors
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
            <div className="routes-container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/userlogin" element={<UserLogin />} />
                <Route path="/commits" element={<RepositoryCommits />} />
                <Route
                  path="/contributions"
                  element={<RepositoryContributorsContribution />}
                />
                <Route
                  path="/contributors"
                  element={
                    <RepositoryContributors
                      owner="tvt15"
                      repoName="Pathfinder"
                    />
                  }
                />
                <Route
                path="/userprofile"
                element={<UserProfile/>}
                />
              </Routes>
            </div>
          </div>
        </Router>
      </AppProvider>
     );
  };

export default App;
