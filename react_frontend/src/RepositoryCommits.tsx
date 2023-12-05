import React, { useState, useEffect,useRef, createRef  } from "react";
import { Line } from "react-chartjs-2";
import { Chart } from 'chart.js/auto';
import {CategoryScale} from 'chart.js'; 
Chart.register(CategoryScale);
import { useAppContext } from './AppContext';


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
  const { user, repo_name} = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/github/repositorycommits?owner=${user}&repo_name=${repo_name}&pg_size=${100}`);
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
    <div className="commits-container">
      {data && data.repository && data.repository.defaultBranchRef && data.repository.defaultBranchRef.target && data.repository.defaultBranchRef.target.history && (
        <div>
          <h2>Repository Commit Analysis</h2><br />
          <p><h5>Total Commits: {data.repository.defaultBranchRef.target.history.totalCount}</h5></p>
          <ul>
            {/* Render commit details */}
          </ul>

          <p>This graph represets the number of additions and deletions performed over the total commits on the repository given on a timeline.</p>
          {/* Chart.js Line Chart */}
          <Line data={chartData} />

          {data.repository.defaultBranchRef.target.history.pageInfo.hasNextPage && (
            <button>Load More</button>
          )}
        </div>
      )}
    </div>
  );
};

export default RepositoryCommits;