import React, { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, LineController, TimeScale, LinearScale, Title, Tooltip, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import { ChartOptions, TooltipItem } from "chart.js";
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

  // useEffect(() => {
  //   if (data) {
  //     const ctx = document.getElementById("myChart") as HTMLCanvasElement;
  //     if (ctx) {
  //               // Destroy existing chart instance if it exists
  //       if (chartRef.current) {
  //         chartRef.current.destroy()                
  //       }
        
  //       chartRef.current = new Chart(ctx, {
  //         type: "line",
  //         data: {
  //           labels: data.repository?.defaultBranchRef?.target?.history?.nodes.map(
  //             (commit) => commit.authoredDate
  //           ) || [],
  //           datasets: [
  //             {
  //               label: "Additions",
  //               data: data.repository?.defaultBranchRef?.target?.history?.nodes.map(
  //                 (commit) => commit.additions
  //               ) || [],
  //               borderColor: "rgba(75,192,192,1)",
  //               backgroundColor: "rgba(75,192,192,0.2)",
  //               fill: false,
  //             },
  //           ],
  //         },
  //         options: {
  //           responsive: true,
  //           maintainAspectRatio: false,
  //           plugins: {
  //             title: {
  //               display: false,
  //             },
  //             tooltip: {
  //               mode: "index",
  //               intersect: false,
  //             },
  //           },
  //           scales: {
  //             x: {
  //               type: "time",
  //               stacked: true,
  //               grid: {
  //                 display: false,
  //               },
  //               ticks: {
  //                 autoSkip: true,
  //                 maxTicksLimit: 13,
  //               },
  //             },
  //             y: {
  //               type: "linear",
  //               stacked: true,
  //               grid: {
  //                 color: "#e6e6e6",
  //               },
  //             },
  //           },
  //         },
  //       });
  //     }
  //   }
  // }, [data]);

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
    // <div>
    //   {data && data.repository && data.repository.defaultBranchRef && data.repository.defaultBranchRef.target && data.repository.defaultBranchRef.target.history && (
    //     <div>
    //       <br></br>
    //       <h2>Repository specific information</h2><br></br>
    //       <p>Total Commits: {data.repository.defaultBranchRef.target.history.totalCount}</p>
    //       <ul>
    //         {data.repository.defaultBranchRef.target.history.nodes.map((commit, index) => (
    //           <li key={index}>
    //             <p>Authored Date: {commit.authoredDate}</p>
    //             <p>Changed Files If Available: {commit.changedFilesIfAvailable}</p>
    //             <p>Additions: {commit.additions}</p>
    //             <p>Deletions: {commit.deletions}</p>
    //             <p>Commit Message: {commit.message}</p>
    //             <p>Parents Total Count: {commit.parents.totalCount}</p>
    //             <hr />
    //           </li>
    //         ))}
    //       </ul>
    //     </div>
    //   )}
    // </div>

    <div className="commit-cards">
    {data &&
      data.repository &&
      data.repository.defaultBranchRef &&
      data.repository.defaultBranchRef.target &&
      data.repository.defaultBranchRef.target.history && (
        <div>
          <br />
          <h2>Repository specific information</h2>
          <br />
          <p>Total Commits: {data.repository.defaultBranchRef.target.history.totalCount}</p>
          <div className="commit-cards-container">
            {data.repository.defaultBranchRef.target.history.nodes.map((commit, index) => (
              <div key={index} className="commit-card">
                <p>Authored Date: {commit.authoredDate}</p>
                <p>Changed Files If Available: {commit.changedFilesIfAvailable}</p>
                <p>Additions: {commit.additions}</p>
                <p>Deletions: {commit.deletions}</p>
                <p>Commit Message: {commit.message}</p>
                <p>Parents Total Count: {commit.parents.totalCount}</p>
                <hr />
              </div>
            ))}
          </div>
          {/* <div className="chart-container">
              <Line data={chartData} options={chartOptions as any} />
          </div> */}
          {/* <canvas id="myChart" /> */}
          <Bar data={chartData} options={chartOptions as any} />
        </div>
      )}
  </div>
  );
};

Chart.register(...registerables);

export default RepositoryContributorsContribution;
