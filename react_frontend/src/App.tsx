import React from "react";
import UserLogin from "./UserLogin";
import RepositoryCommits from "./RepositoryCommits";
import RepositoryContributorsContribution from "./RepositoryContributorsContribution"

const App = () => {
  return (
    <div>
      <h1>React App</h1>
      <UserLogin />
      {/* <RepositoryCommits /> */}
      <RepositoryContributorsContribution />
    </div>
  );
};

export default App;
