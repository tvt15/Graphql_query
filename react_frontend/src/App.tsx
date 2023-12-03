import React from "react";
import {Container, Nav, Navbar, NavDropdown, Tab} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import UserLogin from "./UserLogin";
import RepositoryCommits from "./RepositoryCommits";
import RepositoryContributorsContribution from "./RepositoryContributorsContribution"
import RepositoryContributors from "./RepositoryContributors";
import Home from "./home";

const App = () => {
  return (
    <div>
        {/* <RepositoryContributorsContribution /> */}
    <div className="fixed-top mt-3 mx-5">
                <Tab.Container id="tabs" defaultActiveKey="#home">
                    <Nav variant="tabs" className="mx-3 nav nav-fill">
                        <Navbar className="text-dark" expand="lg">
                            <Navbar.Brand>GitHub Info</Navbar.Brand>
                        </Navbar>
                        <Nav.Item className="ml-12">
                            <Nav.Link href="#home" className="text-nowrap">Home</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#userLogin" className="text-nowrap">User Login</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#repositoryCommits" className="text-nowrap">Repository Commit</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#repositoryContributorsContribution" className="text-nowrap">Repository Contributors Commit</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#repositoryContributors" className="text-nowrap">Repository Contributors</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Tab.Content className="mt-3">
                        <Tab.Pane eventKey="#home">
                            <Home/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="#userLogin">
                            <UserLogin/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="#repositoryCommits">
                            <RepositoryCommits />
                        </Tab.Pane>
                        <Tab.Pane eventKey="#repositoryContributorsContribution">
                            <RepositoryContributorsContribution />
                        </Tab.Pane>
                        <Tab.Pane eventKey="#repositoryContributors">
                            <RepositoryContributors owner="tvt15" repoName="Pathfinder"/>
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </div>
    </div>
  );
};

export default App;
