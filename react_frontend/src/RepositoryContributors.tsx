import React, { useState, useEffect } from "react";
import { useAppContext } from './AppContext';

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
  const { user, repo_name } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/github/repositorycontributors?owner=${user}&repo_name=${repo_name}`);
      const result: ApiResponse = await response.json();
      setData(result);
    };

    fetchData();
  }, [user, repoName]);

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
