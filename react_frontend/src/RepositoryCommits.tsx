// import React, { useState, useEffect } from "react";

// interface Commit { 
//     authoredDate: string;
//     changedFilesIfAvailable: number;
//     additions: number;
//     deletions: number;
//     message: string;
//   }

// interface ApiResponse {
// commits: Commit[];
// }

// const RepositoryCommits: React.FC = () => {
//     const [data, setData] = useState<ApiResponse | null>(null);

//     useEffect(() => {
//       const fetchData = async () => {
//         const response = await fetch("/api/github/repositorycommits");
//         const result: ApiResponse = await response.json();
//         setData(result);
//       };

//       fetchData();
//     }, []);

//     return (
//       <div>
//       {data && data.commits && (
//         <div>
//           {data.commits.map((commit, index) => (
//             <div key={index}>
//               <p>Authored Date: {commit.authoredDate}</p>
//               <p>Changed Files If Available: {commit.changedFilesIfAvailable}</p>
//               <p>Additions: {commit.additions}</p>
//               <p>Deletions: {commit.deletions}</p>
//               <p>Commit Message: {commit.message}</p>
//               <hr />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default RepositoryCommits;

// import React, { useState, useEffect } from "react";

// interface Commit {
//   sha: string;
//   commit: {
//     message: string;
//     additions: number;
//     deletions: number;
//   };
// }

// interface ApiResponse {
//   commits: Commit[];
// }

// const RepositoryCommits: React.FC = () => {
//   const [data, setData] = useState<ApiResponse | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await fetch("/api/github/repositorycommits");
//       const result: ApiResponse = await response.json();
//       console.log(result);
//       setData(result);
//     };

//     fetchData();
//   }, []);

//   return (
//     <div>
//       {data && (
//         <div>
//           <h2>Repository Commits</h2>
//           {data.commits.map((commit) => (
//             <div key={commit.sha}>
//               <p>SHA: {commit.sha}</p>
//               <p>Message: {commit.commit.message}</p>
//               <p>Additions: {commit.commit.additions}</p>
//               <p>Deletions: {commit.commit.deletions}</p>
//               <hr />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default RepositoryCommits;


// inserted for trial
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
    <div>
      {data && data.repository && data.repository.defaultBranchRef && data.repository.defaultBranchRef.target && data.repository.defaultBranchRef.target.history && (
        <div>
          <p>Total Commits: {data.repository.defaultBranchRef.target.history.totalCount}</p>
          <ul>
            {/* Render commit details */}
          </ul>

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