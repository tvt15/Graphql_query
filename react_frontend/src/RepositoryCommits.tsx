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

import React, { useState, useEffect } from "react";

interface Commit {
  sha: string;
  commit: {
    message: string;
    additions: number;
    deletions: number;
  };
}

interface ApiResponse {
  commits: Commit[];
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

  return (
    <div>
      {data && (
        <div>
          <h2>Repository Commits</h2>
          {data.commits.map((commit) => (
            <div key={commit.sha}>
              <p>SHA: {commit.sha}</p>
              <p>Message: {commit.commit.message}</p>
              <p>Additions: {commit.commit.additions}</p>
              <p>Deletions: {commit.commit.deletions}</p>
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RepositoryCommits;


