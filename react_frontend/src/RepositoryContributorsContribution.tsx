import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import { useAppContext } from './AppContext';



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
  const { user, repo_name, uid} = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/github/repositorycontributorscontribution?owner=${user}&repo_name=${repo_name}&uid=${uid}`);
      const result: ApiResponse = await response.json();
      setData(result);
    };

    fetchData();
  },[]);

  return (
    <div className="commits-container">
      {data &&
        data.repository &&
        data.repository.defaultBranchRef &&
        data.repository.defaultBranchRef.target &&
        data.repository.defaultBranchRef.target.history && (
          <div className="commits">
            <br />
            <h2>Repository specific information</h2>
            <br />
            <h4>Total Commits: {data.repository.defaultBranchRef.target.history.totalCount}</h4>
            <table className="commit-table">
              <thead>
                <tr>
                  <th>Authored Date</th>
                  <th>Changed Files If Available</th>
                  <th>Additions</th>
                  <th>Deletions</th>
                  <th>Commit Message</th>
                  <th>Parents Total Count</th>
                </tr>
              </thead>
              <tbody>
                {data.repository.defaultBranchRef.target.history.nodes.map((commit, index) => (
                  <tr key={index}>
                    <td>{commit.authoredDate}</td>
                    <td>{commit.changedFilesIfAvailable}</td>
                    <td>{commit.additions}</td>
                    <td>{commit.deletions}</td>
                    <td>{commit.message}</td>
                    <td>{commit.parents.totalCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
);

};

export default RepositoryContributorsContribution;
