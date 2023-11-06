from github_query.github_graphql.query import QueryNode, PaginatedQuery, QueryNodePaginator,Query


class ProjectQuery(Query):
    def __init__(self):
        super().__init__(
            fields=[
                QueryNode(
                    "project",
                    args={"fullPath": "$repo_name"},
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
                                        # QueryNode(
                                        #     "commits",
                                        #     fields=[
                                        #         "nodes",
                                        #         QueryNode(
                                        #             "committedDate"
                                        #         ),
                                        #         QueryNode(
                                        #             "message"
                                        #         ),
                                        #         QueryNode(
                                        #             "author",
                                        #             fields=[
                                        #                 "email",
                                        #                 "name",
                                        #                 "id"
                                        #             ]
                                        #         ),
                                        #     ],
                                        # ),
                                    ],
                                ),
                            ],
                        ),
                    ],
                ),
            ]
        )


@staticmethod
def contributors_summary(raw_data: dict, cumulative_contributions: dict = None):
    """
    Extract contributor information and calculate cumulative contributions.
    Args:
        raw_data: The raw data returned by the query.
        cumulative_contributions: Cumulative contributions dict.
    Returns:
        dict: A dictionary of contributors and their total additions, deletions, and commit counts.
    """
    merge_requests = raw_data['project']['mergeRequests']['nodes']

    if cumulative_contributions is None:
        cumulative_contributions = {}

    for merge_request in merge_requests:
        additions = merge_request['diffStatsSummary']['additions']
        deletions = merge_request['diffStatsSummary']['deletions']
        commit_count = merge_request['commitCount']
        author_name = merge_request['author']['name']

        if author_name not in cumulative_contributions:
            cumulative_contributions[author_name] = {
                'total_additions': additions,
                'total_deletions': deletions,
                'total_commits': commit_count
            }
        else:
            cumulative_contributions[author_name]['total_additions'] += additions
            cumulative_contributions[author_name]['total_deletions'] += deletions
            cumulative_contributions[author_name]['total_commits'] += commit_count

    return cumulative_contributions
