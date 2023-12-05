from flask import Flask, request
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
    username= request.args.get("user")
    response = client.execute(
            query=UserLogin(), substitutions={"user": username}
        )
    return response

@app.route('/api/github/repositorycommits')
def fetch_github_commits():
    username = request.args.get("owner")
    repo_name = request.args.get("repo_name")
    pg_size = request.args.get("pg_size")
    for response in client.execute(query=RepositoryCommits(),
                               substitutions={"owner": username, "repo_name": repo_name , "pg_size": pg_size}):
        return response

@app.route("/api/github/repositorycontributorscontribution")
def fetch_github_commit():
    username = request.args.get("owner")
    repo_name = request.args.get("repo_name")
    uid = request.args.get("uid")
    response = client.execute(
            query=RepositoryContributorsContribution(), substitutions={"owner": username, "repo_name":repo_name, "id": { "id": uid}}
    )
    return response

@app.route("/api/github/repositorycontributors")
def fetch_github_contributors():
    username = request.args.get("owner")
    repo_name = request.args.get("repo_name")
    response = client.execute(
            query=RepositoryContributors(), substitutions={"owner": username, "repo_name":repo_name}
    )
    return response

# Run the app on 0.0.0.0
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)