import React, { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import "./styles.css";
import 'chartjs-adapter-moment';

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
  const [authoredDates, setAuthoredDates] = useState<string[]>([]);
  const [additions, setAdditions] = useState<number[]>([]);
  const [deletions, setDeletions] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/github/repositorycontributorscontribution");
      const result: ApiResponse = await response.json();
      setData(result);
    };

    fetchData();
  },[]);

  useEffect(() => {
    if (data) {
      const commitNodes = data.repository?.defaultBranchRef?.target?.history?.nodes || [];

      const newAuthoredDates = commitNodes.map((commit) => commit.authoredDate);
      setAuthoredDates(newAuthoredDates);

      const newAdditions = commitNodes.map((commit) => commit.additions);
      setAdditions(newAdditions);

      const newDeletions = commitNodes.map((commit) => commit.deletions);
      setDeletions(newDeletions);
    }
  }, [data]);

  const chartData = {
    labels: authoredDates,
    datasets: [
      {
        label: "Additions",
        data: additions,
        backgroundColor: "rgba(75,192,192,0.5)", // Green color
        borderColor: "rgba(75,192,192,1)",
      },
      {
        label: "Deletions",
        data: deletions,
        backgroundColor: "rgba(255,99,132,0.5)", // Red color
        borderColor: "rgba(255,99,132,1)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 13,
        },
      },
      y: {
        stacked: true,
        grid: {
          color: "#e6e6e6",
          drawBorder: false,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  // const chartData = {
  //   labels: data?.repository?.defaultBranchRef?.target?.history?.nodes.map(
  //     (commit) => commit.authoredDate
  //   ) || [],
  //   datasets: [
  //     {
  //       label: "Additions",
  //       data: data?.repository?.defaultBranchRef?.target?.history?.nodes.map(
  //         (commit) => commit.additions
  //       ) || [],
  //       backgroundColor: "rgba(75,192,192,0.5)", // Green color
  //       borderColor: "rgba(75,192,192,1)",
  //     },
  //     {
  //       label: "Deletions",
  //       data: data?.repository?.defaultBranchRef?.target?.history?.nodes.map(
  //         (commit) => commit.deletions
  //       ) || [],
  //       backgroundColor: "rgba(255,99,132,0.5)", // Red color
  //       borderColor: "rgba(255,99,132,1)",
  //     },
  //   ],
  // };

  // const chartOptions = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   scales: {
  //     x: {
  //       type: "time",
  //       stacked: true,
  //       grid: {
  //         display: false,
  //       },
  //       ticks: {
  //         autoSkip: true,
  //         maxTicksLimit: 13,
  //       },
  //     },
  //     y: {
  //       stacked: true,
  //       grid: {
  //         color: "#e6e6e6",
  //         drawBorder: false,
  //       },
  //     },
  //   },
  //   plugins: {
  //     legend: {
  //       display: true,
  //       position: "top",
  //     },
  //   },
  // };

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
