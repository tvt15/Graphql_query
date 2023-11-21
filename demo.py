import os
from github_query.github_graphql.authentication import PersonalAccessTokenAuthenticator
from github_query.github_graphql.client import Client
from github_query.queries.repositories.Gitlab_contributors_contributions import ProjectContributorsContribution
from github_query.queries.repositories.repository_contributors import RepositoryContributors
from github_query.queries.repositories.repository_contributors_contribution import RepositoryContributorsContribution
from github_query.queries.repositories.repository_commits import RepositoryCommits
from github_query.queries.repositories.Gitlab_commits import ProjectQuery
from github_query.queries.repositories.Gitlab_contributors import ProjectContributorsQuery
import urllib

from dotenv import load_dotenv

load_dotenv()

client = Client(
    host="api.github.com", is_enterprise=False,
    authenticator=PersonalAccessTokenAuthenticator(token=os.environ.get("GITHUB_PERSONAL_ACCESS_TOKEN"))
)

owner = "tvt15"
repository = "Pathfinder"
response = client.execute(query=RepositoryContributors(),
                          substitutions={"owner": owner, "repo_name": repository})

# repository = "oodd1/query_graphQL"
# print (repository)
response = client.execute(query=RepositoryContributors(),
                          substitutions={"owner": owner, "repo_name": repository})
print(response)

response = client.execute(query=RepositoryContributorsContribution(),
                          substitutions={"owner": owner, "repo_name": repository, "id": { "id": "MDQ6VXNlcjM4NTQ5Njg5"}})
print(response)

for response in client.execute(query=RepositoryCommits(),
                               substitutions={"owner": owner, "repo_name": repository, "pg_size": 100}):
    print(response)

# response = client.execute(query = ProjectContributorsQuery(),
#                           substitutions={"repo_name": repository})
# print(response)

# response = client.execute(query = ProjectContributorsContribution(),
#                           substitutions={"repo_name": repository})
# print(response)

# response = client.execute(query = ProjectQuery(),
#                           substitutions={"repo_name": repository})
# print(response)





