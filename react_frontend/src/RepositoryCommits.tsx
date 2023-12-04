import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

interface Commit {
  authoredDate: string;
  changedFilesIfAvailable: number;
  additions: number;
  deletions: number;
  message: string;
}

interface PageInfo {
  endCursor: string;
  hasNextPage: boolean;
}

interface CommitNode {
  totalCount: number;
  nodes: Commit[];
  pageInfo: PageInfo;
}

interface Repository {
  defaultBranchRef: {
    target: {
      history: CommitNode;
    };
  };
}

interface ApiResponse {
  repository: Repository;
}

const RepositoryCommits: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/github/repositorycommits");
      const result: ApiResponse = await response.json();
      setData(result);
    };

    fetchData();
  }, []);

   // Prepare data for Chart.js
   const chartData = {
    labels: data?.repository.defaultBranchRef.target.history.nodes.map((commit) => commit.authoredDate) || [],
    datasets: [
      {
        label: "Additions",
        data: data?.repository.defaultBranchRef.target.history.nodes.map((commit) => commit.additions) || [],
        borderColor: "green",
        fill: false,
      },
      {
        label: "Deletions",
        data: data?.repository.defaultBranchRef.target.history.nodes.map((commit) => commit.deletions) || [],
        borderColor: "red",
        fill: false,
      },
    ],
  };

  // Chart.js options
  const options = {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
      },
      y: {
        min: 0,
      },
    },
  };

  return (
    <div className="chart-container">
      {data && data.repository && data.repository.defaultBranchRef && data.repository.defaultBranchRef.target && data.repository.defaultBranchRef.target.history && (
        <div>
          <p>Total Commits: {data.repository.defaultBranchRef.target.history.totalCount}</p>
          <ul>
            {/* Render commit details */}
          </ul>

          {/* Chart.js Line Chart */}
          <div className="center">
            <Line data={chartData} />
          </div>

          {data.repository.defaultBranchRef.target.history.pageInfo.hasNextPage && (
            <button>Load More</button>
          )}
        </div>
      )}
    </div>
  );
};

export default RepositoryCommits;