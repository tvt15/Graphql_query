import React, { useState, useEffect } from "react";

interface Contributor {
  login: string;
}

interface ApiResponse {
  repository: {
    defaultBranchRef: {
      target: {
        history: {
          nodes: {
            author: {
              user: Contributor;
            };
          }[];
        };
      };
    };
  };
}

const RepositoryContributors: React.FC<{ owner: string; repoName: string }> = ({ owner, repoName }) => {
  const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/github/repositorycontributors?owner=${owner}&repo_name=${repoName}");
      const result: ApiResponse = await response.json();
      setData(result);
    };

    fetchData();
  }, [owner, repoName]);

  return (
    <div className="contributors">
      {data && data.repository && data.repository.defaultBranchRef && data.repository.defaultBranchRef.target && data.repository.defaultBranchRef.target.history && (
        <div>
          <h2>Contributor of this repository {Array.from(
          new Set(
            data.repository.defaultBranchRef.target.history.nodes.map(
              (commit) => commit.author.user.login
            )
          )
        ).length === 1 ? "is:" : "are:"}

          </h2>
          {/* <ul>
            {data.repository.defaultBranchRef.target.history.nodes.map((commit, index) => (
              <li key={index}>{commit.author.user.login}</li>
            ))}
          </ul> */}
          <ul>
          {Array.from(
            new Set(
              data.repository.defaultBranchRef.target.history.nodes.map(
                (commit) => commit.author.user.login
              )
            )
          ).map((login, index) => (
            <li key={index}>{login}</li>
          ))}
        </ul>
        </div>
      )}
    </div>
  );
};

export default RepositoryContributors;
