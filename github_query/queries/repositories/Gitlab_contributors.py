from github_query.github_graphql.query import QueryNode, Query

class ProjectContributorsQuery(Query):
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
                                                                "email",
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

@staticmethod
def extract_unique_authors(raw_data: dict):
    """
    Extract all unique author logins from the GraphQL query result.
    Args:
        raw_data: The raw data returned by the query.
    Returns:
        set: A set of unique author logins.
    """
    unique_authors = set()

    merge_requests = raw_data['project']['mergeRequests']['nodes']

    for merge_request in merge_requests:
        commit_nodes = merge_request['commits']['nodes']

        for commit_node in commit_nodes:
            author = commit_node['author']
            if author:
                login = author['name']
                if login:
                    unique_authors.add(login)

    return unique_authors
