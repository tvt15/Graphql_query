import React from "react";
import UserLogin from "./UserLogin";
import RepositoryCommits from "./RepositoryCommits";
import RepositoryContributorsContribution from "./RepositoryContributorsContribution"
import RepositoryContributors from "./RepositoryContributors";

const App = () => {
  return (
    <div>
      <h1>React App</h1>
      <UserLogin />
      {/* <RepositoryCommits /> */}
      <RepositoryContributorsContribution />
      <RepositoryContributors owner="tvt15" repoName="Pathfinder"/>
    </div>
  );
};

export default App;
