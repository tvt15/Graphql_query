from flask import Flask
from flask_cors import CORS
import os

from github_query.github_graphql.authentication import PersonalAccessTokenAuthenticator
from github_query.github_graphql.client import Client
from github_query.queries.repositories.user_login import UserLogin
from github_query.queries.repositories.repository_commits import RepositoryCommits
from github_query.queries.repositories.repository_contributors_contribution import RepositoryContributorsContribution
from github_query.queries.repositories.repository_contributors import RepositoryContributors

from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Allow all origins to access routes with '/api/' prefix
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize GitHub client
client = Client(
    host="api.github.com", is_enterprise=False,
    authenticator=PersonalAccessTokenAuthenticator(token=os.environ.get("GITHUB_PERSONAL_ACCESS_TOKEN"))
)

@app.route('/api/github/userlogin')
def fetch_github_data():
    response = client.execute(
            query=UserLogin(), substitutions={"user": "tripurashree"}
        )
    return response

@app.route("/api/github/repositorycontributorscontribution")
def fetch_github_commit():
    response = client.execute(
            query=RepositoryContributorsContribution(), substitutions={"owner": "tripurashree", "repo_name":"slash", "id": { "id": "MDQ6VXNlcjcwMDg3NTU1"}}
    )
    return response

@app.route("/api/github/repositorycontributors")
def fetch_github_contributors():
    response = client.execute(
            query=RepositoryContributors(), substitutions={"owner": "tvt15", "repo_name":"Pathfinder"}
    )
    return response

# Run the app on 0.0.0.0
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)