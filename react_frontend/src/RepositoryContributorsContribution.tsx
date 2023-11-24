import React, { useState, useEffect } from "react";

interface Commit {
  authoredDate: string;
  changedFilesIfAvailable: number;
  additions: number;
  deletions: number;
  message: string;
  parents: {
    totalCount: number;
  };
}

interface ApiResponse {
  repository: {
    defaultBranchRef: {
      target: {
        history: {
          totalCount: number;
          nodes: Commit[];
        };
      };
    };
  };
}

const RepositoryContributorsContribution: React.FC= () => {
  const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/github/repositorycontributorscontribution");
      const result: ApiResponse = await response.json();
      setData(result);
    };

    fetchData();
  },[]);
  
  return (
    <div>
      {data && data.repository && data.repository.defaultBranchRef && data.repository.defaultBranchRef.target && data.repository.defaultBranchRef.target.history && (
        <div>
          <p>Total Commits: {data.repository.defaultBranchRef.target.history.totalCount}</p>
          <ul>
            {data.repository.defaultBranchRef.target.history.nodes.map((commit, index) => (
              <li key={index}>
                <p>Authored Date: {commit.authoredDate}</p>
                <p>Changed Files If Available: {commit.changedFilesIfAvailable}</p>
                <p>Additions: {commit.additions}</p>
                <p>Deletions: {commit.deletions}</p>
                <p>Commit Message: {commit.message}</p>
                <p>Parents Total Count: {commit.parents.totalCount}</p>
                <hr />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RepositoryContributorsContribution;
