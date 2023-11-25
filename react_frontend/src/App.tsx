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
      {/* we can do the above method for other queries as well. It might help over come the key error without hardcoding it. */}
    </div>
  );
};

export default App;
