# Python Version
We provide a convenient tool to query a user's GitLab metrics.

**IN ORDER TO USE THIS TOOL, YOU NEED TO PROVIDE YOUR OWN .env FILE.**
Because we use the [dotenv](https://pypi.org/project/python-dotenv/) package to load environment variable.
**YOU ALSO NEED TO PROVIDE YOUR GITLAB PERSONAL ACCESS TOKEN(PAT) IN YOUR .env FILE**
i.e. GITLAB_PERSONAL_ACCESS_TOKEN  = 'your_personal_access_token'

## Installation

We recommend using virtual environment. 
```shell
cd path/to/your/project/directory
python -m venv venv
```
On macOS and Linux:
```shell
source venv/bin/activate
```
On Windows (Command Prompt):
```shell
.\venv\Scripts\activate
```
On Windows (PowerShell):
```shell
.\venv\Scripts\Activate.ps1
```
then you can
```shell
pip install -r requirements.txt
```

## Execution
TBD

### authentication  — Basic authenticator class
Source code: [github_graphql/authentication.py]()

This module provides the basic authentication mechanism. User needs to provide a valid GitLab PAT with correct scope to run queries. 
A PersonalAccessTokenAuthenticator object will be created with the PAT that user provided. get_authorization_header method will return an
 authentication header that will be used when send request to GitLab GraphQL server.

<span style="font-size: larger;">Authenticator Objects</span>

Parent class of PersonalAccessTokenAuthenticator. Serve as base class of any authenticators.

<span style="font-size: larger;">PersonalAccessTokenAuthenticator Objects</span>

Handles personal access token authentication method for GitLab clients.

`class PersonalAccessTokenAuthenticator(token)`
* The `token` argument is required. This is the user's GitLab personal access token with the necessary scope to execute the queries that the user required.

Instance methods:

`get_authorization_header()`
* Returns the authentication header as a dictionary i.e. {"Authorization": "your_personal_access_token"}.

### query  — Classes for building GraphQL queries
Source code: [github_graphql/query.py]()

This module provides a framework for building GraphQL queries using Python classes. The code defines four classes: QueryNode, QueryNodePaginator, Query, and PaginatedQuery.
QueryNode represents a basic building block of a GraphQL query. 
QueryNodePaginator is a specialized QueryNode for paginated requests. 
Query represents a terminal query node that can be executed. 
PaginatedQuery represents a terminal query node designed for paginated requests.
* You can find more information about GitLab GraphQL API here: [GitLab GraphQL API documentation](https://docs.gitlab.com/ee/api/graphql/)
* You can use GitLab GraphQL Explorer to try out queries: [GitLab GraphQL API Explorer](https://gitlab.com/-/graphql-explorer)

<span style="font-size: larger;">QueryNode Objects</span>

The QueryNode class provides a framework for constructing GraphQL queries using Python classes. 
It allows for building complex queries with nested fields and supports pagination for paginated requests.

`class QueryNode(name, fields, args)`
* `name` is the name of the QueryNode
* `fields` is a List of fields in the QueryNode
* `args` is a Map of arguments in the QueryNode.

Private methods:

`_format_args()`
* _format_args method takes the arguments of a QueryNode instance and formats them as a string representation in the form of key-value pairs. The formatting depends on the type of the argument value, with special handling for strings, lists, dictionaries, booleans, and the default case for other types. The method then returns the formatted arguments as a string enclosed within parentheses.

`_format_fields()`
* _format_fields method takes the list of fields within a QueryNode instance and formats them as a single string representation.

Instance methods:

`get_connected_nodes()`
* get_connected_nodes method returns a list of connected QueryNode instances within a QueryNode instance. It iterates over the fields attribute of the QueryNode instance and checks if each field is an instance of QueryNode. The resulting list contains all the connected QueryNode instances found.

`__str__()`
* \__str\__ method defines how the QueryNode object should be represented as a string. It combines the object's name, formatted arguments, and formatted fields to construct the string representation in a specific format.

`__repr__()`
* Debug method.

`__eq__(other)`
* \__eq\__ method defines how the QueryNode object should be compared to each other. 
 

<span style="font-size: larger;">Query Objects</span>

The Query class is a subclass of QueryNode and represents a terminal QueryNode that can be executed. 
It provides a substitute method to substitute values in the query using keyword arguments.

Class methods:

`test_time_format(time_string)`
* test_time_format is a static method that validates whether a given time string is in the expected format "%Y-%m-%dT%H:%M:%SZ".

`convert_dict(data)`
* convert_dict is a static method that takes a dictionary (data) as input and returns a modified dictionary with certain value conversions.
* If the value is of type bool, it converts it to a lowercase string representation.
* If the value is a nested dictionary, it converts it to a string representation enclosed in curly braces.
* If the value is a string and passes the test_time_format check, it wraps it in double quotes.
* For other value types, it keeps the value unchanged.

Instance methods:

`substitute(**kwargs)`
* This method substitutes the placeholders in the query string with specific values provided as keyword arguments.

<span style="font-size: larger;">QueryNodePaginator Objects</span>

The QueryNodePaginator class extends the QueryNode class and adds pagination-related functionality. 
It keeps track of pagination state, appends pagination fields to the existing fields, 
provides methods to check for a next page and update the pagination state, 
and includes a method to reset the pagination state.

#### NOTE: We only implemented single level pagination, as multi-level pagination behavior is not well-defined in different scenarios. For example, you want to query all the pull requests a user made to all his/her repositories. You may develop a query that retrieves all repositories of a user as the first level pagination and all pull requests to each repository as the second level pagination. However, each repository not necessarily has the same number of pull requests. We leave this to the user to decide how they want to handle their multi-level pagination.

`class QueryNodePaginator(name, fields, args)`
* `name` is the name of the QueryNode.
* `fields` is a List of fields in the QueryNode. 
* `args` is a Map of arguments in the QueryNode.

Instance methods:

`update_paginator(has_next_page, end_cursor)`
* update_paginator updates the paginator arguments with the provided has_next_page and end_cursor values. It adds the end cursor to the arguments using the key "after", enclosed in double quotes.

`has_next()`
* The has_next method checks if there is a next page by returning the value of has_next_page.

`reset_paginator()`
* The reset_paginator method resets the QueryPaginator by removing the "after" key from the arguments and setting has_next_page to None.

`__eq__(other)`
* \__eq\__ method overrides the equality comparison for QueryNodePaginator objects. It compares the object against another object of the same class, returning True if they are equal based on the parent class's equality comparison (super().__eq__(other)).


<span style="font-size: larger;">PaginatedQuery Objects</span>

`class PaginatedQuery(name, fields, args)`
* `name` is the name of the QueryNode
* `fields` is a List of fields in the QueryNode
* `args` is a Map of arguments in the QueryNode.
* The \__init\__ method initializes a PaginatedQuery object with the provided name, fields, and arguments. It calls the parent class's __init__ method and then extracts the path to the pageInfo node using the extract_path_to_pageinfo_node static method.

`extract_path_to_pageinfo_node(paginated_query)`
* The extract_path_to_pageinfo_node static method is used to extract the path to the QueryNodePaginator node within the query. It takes a PaginatedQuery object as input and traverses the query fields to find the QueryNodePaginator. It returns a tuple containing the path to the QueryNodePaginator node and the QueryNodePaginator node. If the QueryNodePaginator node is not found, it raises an InvalidQueryException.

### client  — 
Source code: [github_graphql/client.py]()

This class represents the main GitLab GraphQL client.

`class Client(protocol, host, is_enterprise, authenticator)`
*`protocol`: Protocol used for server communication.
*`host`: Host server domain or IP.
*`is_enterprise`: Boolean to check if the host is running on GitLab Enterprise.
*`authenticator`: The authentication handler for the client.

Private methods:

`_base_path(self)`:
* Returns the base path for a GraphQL request based on whether the client is connected to GitLab Enterprise.

`_generate_headers(self, **kwargs)`:
* Generates headers for an HTTP request, including authentication headers and other additional headers passed as keyword arguments.

`_retry_request(self, retry_attempts, timeout_seconds, query, substitutions)`:
* Wrapper method to retry requests. Takes in the number of attempts, timeout duration, the query, and the substitutions for the query.

`_execute(self, query, substitutions)`:
* Executes a GraphQL query after performing the required substitutions. Handles possible request errors and rate limiting.

`_execution_generator(self, query, substitutions)`:
* Executes a PaginatedQuery by repeatedly querying until all pages have been fetched. Yields each response.

Instance methods:

`execute(self, query, substitutions):`
* Executes a query, which can be a simple Query or a PaginatedQuery. Utilizes the _execute method or the _execution_generator method based on the type of query.




### repository_contributors — Query for retrieving contributors of a repository
Source code: [queries/repositories/Gitlab_contributors.py]()

This  GraphQL query aims to retrieve the default branch reference of a specified repository. 
Specifically, it extracts the login names of authors from the commit history of the default branch.

<table>
<tr>
<th>GraphQL</th>
<th>Python</th>
</tr>
<tr>
<td>

```
query Project {
        project(fullPath: "oodd1/query_graphQL") {
                mergeRequests {
                        nodes {
                                commits {
                                        nodes {
                                                author {
                                                        name
                                                        id
                                                }
                                        }
                                }
                        }
                }
        }
}
```

</td>
<td>

```python
    def __init__(self):
        super().__init__(
            fields=[
                QueryNode(
                    "project",
                    args={"fullPath": "oodd1/query_graphQL"},
                    fields=[
                        QueryNode(
                            "mergeRequests",
                            fields=[
                                QueryNode(
                                    "nodes",
                                    fields=[
                                        QueryNode(
                                            "commits",
                                            fields=[
                                                QueryNode(
                                                    "nodes",
                                                    fields=[
                                                        QueryNode(
                                                            "author",
                                                            fields=[
                                                                "name",
                                                                "id",
                                                            ]
                                                        )
                                                    ]
                                                )
                                            ]
                                        )
                                    ]
                                )
                            ]
                        )
                    ]
                )
            ]
        )
```
</td>
</tr>
</table>

### repository_contributors_contribution — Query for retrieving contributions of a contributor made to a repository
Source code: [queries/repositories/Gitlab_contributors_contribution.py]()

This GraphQL query is designed to retrieve the commit history of a specified author ($id) 
in the default branch of a specified repository ($owner and $name). 
It returns key metrics like the total count of commits, the date each commit was authored, the number of changed files, 
additions, and deletions for each commit, along with the author's login name.

<table>
<tr>
<th>GraphQL</th>
<th>Python</th>
</tr>
<tr>
<td>

```
query ($owner: String!, $name: String!, $id: ID!){
  repository(owner: $owner, name: $name) {
    defaultBranchRef {
      target {
        ... on Commit {
          history(author: { id: $id }) {
            totalCount
            nodes {
              authoredDate
              changedFilesIfAvailable
              additions
              deletions
              author {
                user {
                  login
                }
              }
            }
          }
        }
      }
    }
  }
}
```

</td>
<td>

```python
    # def __init__(self):
    #     super().__init__(
    #         fields=[
    #             QueryNode(
    #                 "project",
    #                 args={"fullPath": "oodd1/query_graphQL"},
    #                 fields=[
    #                     "createdAt",
    #                     QueryNode(
    #                         "mergeRequests",
    #                         fields=[
    #                             "count",
    #                             QueryNode(
    #                                 "nodes",
    #                                 fields=[
    #                                     QueryNode(
    #                                         "diffStatsSummary",
    #                                         fields=[
    #                                             "additions",
    #                                             "deletions",
    #                                             "fileCount",
    #                                         ],
    #                                     ),
    #                                     "commitCount",
    #                                 ],
    #                             ),
    #                         ],
    #                     ),
    #                 ],
    #             ),
    #         ]
    #     )
```
</td>
</tr>
</table>

### repositories — Query for retrieving commits af a contributor made to a repository
Source code: [queries/repositories/Gitlab_commits.py]()

This GraphQL query is structured to retrieve commits from the default branch of a specified repository. For each commit, it fetches the authored date, the number of changed files (if available), the number of additions and deletions, the commit message, and details about the commit's author.

<table>
<tr>
<th>GraphQL</th>
<th>Python</th>
</tr>
<tr>
<td>

```
query Project {
    project(fullPath: "oodd1/query_graphQL") {
        createdAt
        mergeRequests {
            count
            nodes {
                diffStatsSummary{
                    additions
                    deletions
                    fileCount
                }
                commitCount
                commits {
                    nodes {
                        committedDate
                        message
                        author {
                            email
                            name
                            id
                        }
                    }
                }
            }
        }
    }
}
```

</td>
<td>

```python
        def __init__(self):
        super().__init__(
            fields=[
                QueryNode(
                    "project",
                    args={"fullPath": "oodd1/query_graphQL"},
                    fields=[
                        "createdAt",
                        QueryNode(
                            "mergeRequests",
                            fields=[
                                "count",
                                QueryNode(
                                    "nodes",
                                    fields=[
                                        QueryNode(
                                            "diffStatsSummary",
                                            fields=[
                                                "additions",
                                                "deletions",
                                                "fileCount",
                                            ],
                                        ),
                                        "commitCount",
                                        QueryNode(
                                            "commits",
                                            fields=[
                                                "nodes",
                                                QueryNode(
                                                    "committedDate"
                                                ),
                                                QueryNode(
                                                    "message"
                                                ),
                                                QueryNode(
                                                    "author",
                                                    fields=[
                                                        "email",
                                                        "name",
                                                        "id"
                                                    ]
                                                ),
                                            ],
                                        ),
                                    ],
                                ),
                            ],
                        ),
                    ],
                ),
            ]
        )
```
</td>
</tr>
</table>


### ratelimit  — 
Source code: [queries/rate_limit.py](https://github.com/JialinC/GitHub_GraphQL/blob/main/python_github_query/queries/rate_limit.py)

<table>
<tr>
<th>GraphQL</th>
<th>Python</th>
</tr>
<tr>
<td>

```
query ($dryrun: Boolean!){
  rateLimit (dryRun: $dryrun){
    cost
    limit
    remaining
    resetAt
    used
  }
}

```

</td>
<td>

```python
```
</td>
</tr>
</table>