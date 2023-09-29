import os
from github_query.github_graphql.authentication import PersonalAccessTokenAuthenticator
from github_query.github_graphql.client import Client, QueryFailedException
from github_query.queries.repositories.repository_contributors import RepositoryContributors
from github_query.queries.repositories.repository_contributors_contribution import \
    RepositoryContributorsContribution
from github_query.miners.repository_contributors_contribution_miner import \
    RepositoryContributorsContributionMiner
from github_query.miners.leetcode_user_miner import LeetcodeUserMiner
from github_query.queries.profile.user_profile_stats import UserProfileStats
from github_query.queries.repositories.repository_commits import RepositoryCommits
from github_query.queries.utils.query_cost import QueryCost
from github_query.queries.utils.rate_limit import RateLimit
import github_query.util.helper as helper
import re
import time
from datetime import datetime
from random import randint
from string import Template
from typing import Union
import requests
from requests import Response

# https://github.ncsu.edu/jcui9/pyqt_UI
# https://github.com/JialinC/LeetHub_Research


client = Client(
    host="api.github.com", is_enterprise=False,
    authenticator=PersonalAccessTokenAuthenticator(token=os.environ.get("GITHUB_PERSONAL_ACCESS_TOKEN"))
)

enterprise_client = Client(
    host="github.ncsu.edu", is_enterprise=True,
    authenticator=PersonalAccessTokenAuthenticator(token=os.environ.get("GITHUB_ENTERPRISE_PERSONAL_ACCESS_TOKEN"))
)

#################################################################################################
# response = enterprise_client.execute(query=RateLimit(), substitutions={"dryrun": True})
# print(response)
#################################################################################################

# print(UserProfileStats().substitute(**{"user": "JialinC"}))
# query = UserProfileStats()
# print(query)
# substitutions = {"user": "JialinC"}
# query_string = Template(query).substitute(**substitutions) if isinstance(query, str) else query.substitute(**substitutions)
# print(query_string)
# match = re.search(r'query\s*{(?P<content>.+)}', query_string)
# print(match)
# rate_query = QueryCost(match.group('content'))
# print(rate_query)
# print(QueryCost.convert_dict({"dryrun": True}))
# if isinstance(rate_query, str):
#     print("is string")
# result_string = Template(rate_query).substitute(**{"dryrun": True}) if isinstance(rate_query, str) else rate_query.substitute(**{"dryrun": True})
# print(result_string)

# response = client.execute(query=UserProfileStats(), substitutions={"user": "JialinC"})
# print(response)
# miner = LeetcodeUserMiner(client)


# repository miner
# dirs = ['https://github.com/JialinC/se-hw2',
#         'https://github.com/JialinC/csc510-project']
#
# miner = RepositoryContributorsContributionMiner(client)
#
# for dir in dirs:
#     miner.run(dir)
#
# print(miner.cumulated_contribution)

links = ['https://github.ncsu.edu/kgala2/bookstore']

# q = 'query { repository(owner: "$owner", name: "$repo_name") { collaborators{ totalCount nodes{ login name } } } }'

# q2 = 'query { repository(owner: "$owner", name: "$repo_name") { defaultBranchRef { target { ... on Commit { history { totalCount nodes { additions deletions changedFilesIfAvailable author { name email user { login } } } } } } } } }'

for link in links:
    owner, repository = helper.get_owner_and_name(link)
    commit = {}
    try:
        for response in enterprise_client.execute(query=RepositoryCommits(),
                                            substitutions={"owner": owner, "repo_name": repository, "pg_size": 100}):
            commits = RepositoryCommits().commits_list(response, commit)

        keys = commits.keys()
        for name in keys:
            contributions = commits[name]
            print(name + ":")
            if 'total_additions' in contributions:
                print(f'total_commits: {contributions["total_commits"]}')
                print(f'total_additions: {contributions["total_additions"]}')
                print(f'total_deletions: {contributions["total_deletions"]}')
                print(f'total_files: {contributions["total_files"]}')
            for k, v in contributions.items():
                if isinstance(v, dict):
                    print(k)
                    print(f'total_commits: {v["total_commits"]}')
                    print(f'total_additions: {v["total_additions"]}')
                    print(f'total_deletions: {v["total_deletions"]}')
                    print(f'total_files: {v["total_files"]}')
            print("================================================================================")
    except Exception as e:
        print(link + "DNE")








# print(RepositoryCommits().substitute(**{"owner": "JialinC", "repo_name": "GitHub_GraphQL", "pg_size": 100}))
# for response in client.execute(query=RepositoryCommits(),
#                                     substitutions={"owner": "JialinC", "repo_name": "GitHub_GraphQL", "pg_size": 100}):
#     commits = RepositoryCommits().commits_list(response, commit)
#     print(commits)
#
#
#
#
# try:
#     owner, repository = helper.get_owner_and_name(link)
#     response = enterprise_client.execute(query=RepositoryCommits(),
#                                          substitutions={"owner": owner, "repo_name": repository})
# except QueryFailedException as e:
#     message = e.response.json()['errors'][0]['message']
#     print(message)
#     exit()
# commits = RepositoryCommits().commits_list(response)
# keys = commits.keys()
# for name in keys:
#     contributions = commits[name]
#     print(name + ":")
#     if 'total_additions' in contributions:
#         print(f'total_commits: {contributions["total_commits"]}')
#         print(f'total_additions: {contributions["total_additions"]}')
#         print(f'total_deletions: {contributions["total_deletions"]}')
#         print(f'total_files: {contributions["total_files"]}')
#     for k, v in contributions.items():
#         if isinstance(v, dict):
#             print(k)
#             print(f'total_commits: {v["total_commits"]}')
#             print(f'total_additions: {v["total_additions"]}')
#             print(f'total_deletions: {v["total_deletions"]}')
#             print(f'total_files: {v["total_files"]}')
#     print("================================================================================")


# try:
#     owner, repository = helper.get_owner_and_name(link)
#     response = enterprise_client.execute(query=RepositoryContributors(),
#                                          substitutions={"owner": owner, "repo_name": repository})
# except QueryFailedException as e:
#     message = e.response.json()['errors'][0]['message']
#     print(message)
#     exit()
# contributors = RepositoryContributors.extract_unique_author(response)
# contributors_ids = []
# print(contributors)
#
# response = enterprise_client.execute(query=RepositoryContributorsContribution(),
#                                 substitutions={"owner": owner,
#                                                "repo_name": repository,
#                                                "id": {"id": user_id}})
#
# repo_login_cum = {"repo": repository, "login": login}
# cumulated_contribution = RepositoryContributorsContribution.user_cumulated_contribution(response)
# repo_login_cum.update(cumulated_contribution)
# new_row_cum = pd.DataFrame([repo_login_cum])
# self.cumulated_contribution = pd.concat([self.cumulated_contribution, new_row_cum], ignore_index=True)
#
# individual_contribution = RepositoryContributorsContribution.user_commit_contribution(response)
# for i, v in enumerate(individual_contribution):
#     repo_login_ind = {"repo": repository, "login": login}
#     repo_login_ind.update(v)
#     individual_contribution[i] = repo_login_ind
# new_rows_ind = pd.DataFrame(individual_contribution)
# self.individual_contribution = pd.concat([self.individual_contribution, new_rows_ind], ignore_index=True)



# try:
#     owner, repository = helper.get_owner_and_name(link)
#     response = enterprise_client.execute(query=RepositoryContributors(),
#                                          substitutions={"owner": owner, "repo_name": repository})
# except QueryFailedException as e:
#     message = e.response.json()['errors'][0]['message']
#     print(message)
#     exit()
# print(response)
# contributors = RepositoryContributors.extract_unique_author(response)
# contributors_ids = []
# print(contributors)
# for contributor in contributors:
#     user = self._client.execute(query=UserLogin(), substitutions={"user": contributor})['user']
#     contributors_ids.append((user['login'], user['id']))
#
# for login, user_id in contributors_ids:
#     print(f"querying user: {login}")
#     response = self._client.execute(query=RepositoryContributorsContribution(),
#                                     substitutions={"owner": owner,
#                                                    "repo_name": repository,
#                                                    "id": {"id": user_id}})
#
#     repo_login_cum = {"repo": repository, "login": login}
#     cumulated_contribution = RepositoryContributorsContribution.user_cumulated_contribution(response)
#     repo_login_cum.update(cumulated_contribution)
#     new_row_cum = pd.DataFrame([repo_login_cum])
#     self.cumulated_contribution = pd.concat([self.cumulated_contribution, new_row_cum], ignore_index=True)
#
#     individual_contribution = RepositoryContributorsContribution.user_commit_contribution(response)
#     for i, v in enumerate(individual_contribution):
#         repo_login_ind = {"repo": repository, "login": login}
#         repo_login_ind.update(v)
#         individual_contribution[i] = repo_login_ind
#     new_rows_ind = pd.DataFrame(individual_contribution)
#     self.individual_contribution = pd.concat([self.individual_contribution, new_rows_ind], ignore_index=True)
