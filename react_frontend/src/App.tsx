import React from "react";
import UserLogin from "./UserLogin";
import RepositoryCommits from "./RepositoryCommits";

const App = () => {
  return (
    <div>
      <h1>React App</h1>
      <UserLogin />
      <RepositoryCommits/>
    </div>
  );
};

export default App;
