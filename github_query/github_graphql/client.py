import re
import time
from datetime import datetime
from random import randint
from string import Template
from typing import Union
import requests
from requests.exceptions import Timeout
from requests import Response
from requests.exceptions import RequestException
from .authentication import Authenticator
from .query import PaginatedQuery, Query
from github_query.queries.utils.query_cost import QueryCost


class InvalidAuthenticationError(Exception):
    pass


class QueryFailedException(Exception):
    def __init__(self, response: Response, query: str = None):
        self.response = response
        self.query = query
        if query:
            super().__init__(
                f"Query failed to run by returning code of {response.status_code}.\nQuery = {query}\n{response.text}"
            )
        else:
            super().__init__(
                f"Query failed to run by returning code of {response.status_code}.\n"
                f"Path={response.request.path_url}\n{response.text}"
            )


class Client:
    """
    GitHub GraphQL Client.
    """

    def __init__(self,
                 protocol: str = "https",
                 host: str = "gitlab.com/api",
                 is_enterprise: bool = False,   
                 authenticator: Authenticator = None):
        """
        Initializes the client.
        Args:
            protocol: Protocol for the server
            host: Host for the server
            is_enterprise: Is the host running on Enterprise Version?
            authenticator: Authenticator for the client
        """
        self._protocol = protocol
        self._host = host

        self._is_enterprise = is_enterprise

        if authenticator is None:
            raise InvalidAuthenticationError("Authentication needs to be specified")

        self._authenticator = authenticator

    def _base_path(self):
        """
        Returns base path for a GraphQL Request.
        Returns:
            Base path for requests
        """
        return (
            f"{self._protocol}://{self._host}/api/graphql"
            if self._is_enterprise else
            f"{self._protocol}://{self._host}/graphql"
        )

    def _generate_headers(self, **kwargs):
        """
        Generates headers for a request including authentication headers.
        Args:
            **kwargs: Headers

        Returns:
            Headers required for requests
        """
        headers = {}

        headers.update(self._authenticator.get_authorization_header())
        headers.update(kwargs)

        return headers

    def _retry_request(self, retry_attempts: int, timeout_seconds: int, query: Union[str, Query], substitutions: dict):
        """
        wrapper for retrying requests.
        Args:
            retry_attempts: retry attempts
            timeout_seconds: timeout seconds
            query: Query to run
            substitutions: Substitutions to make
        Returns:
            Response as a JSON
        """
        for _ in range(retry_attempts):
            try:
                response = requests.post(
                    self._base_path(),
                    json={
                        'query': Template(query).substitute(**substitutions)
                        if isinstance(query, str) else query.substitute(**substitutions)
                    },
                    headers=self._generate_headers(),
                    timeout=timeout_seconds
                )
                # Process the response
                if response.status_code == 200:
                    return response
            except Timeout:
                print("Request timed out. Retrying...")

    def _execute(self, query: Union[str, Query], substitutions: dict):
        """
        Executes a query after substituting values.
        Args:
            query: Query to run
            substitutions: Substitutions to make

        Returns:
            Response as a JSON
        """
        query_string = Template(query).substitute(**substitutions) if isinstance(query, str) else query.substitute(**substitutions)
        match = re.search(r'query\s*{(?P<content>.+)}', query_string)
        rate_query = QueryCost(match.group('content'))
        rate_limit = self._retry_request(3, 10, rate_query, {"dryrun": True})
        print(rate_limit)
        rate_limit_data = rate_limit.json()
        print(rate_limit_data)

        # rate_limit = rate_limit.json()["data"]["rateLimit"]
        # cost = rate_limit['cost']
        # remaining = rate_limit['remaining']
        # reset_at = rate_limit['resetAt']
        # if cost > remaining - 5:
        #     current_time = datetime.utcnow()
        #     time_format = '%Y-%m-%dT%H:%M:%SZ'
        #     reset_at = datetime.strptime(reset_at, time_format)
        #     time_diff = reset_at - current_time
        #     seconds = time_diff.total_seconds()
        #     print(f"stop at {current_time}s.")
        #     print(f"waiting for {seconds}s.")
        #     print(f"reset at {reset_at}s.")
        #     time.sleep(seconds + 5)

        # response = self._retry_request(3, 10, query, substitutions)

        # try:
        #     json_response = response.json()

        # except RequestException:
        #     raise QueryFailedException(query=query, response=response)

        # if response.status_code == 200 and "errors" not in json_response:
        #     return json_response["data"]
        # else:
        #     raise QueryFailedException(query=query, response=response)

    def execute(self, query: Union[str, Query, PaginatedQuery], substitutions: dict):
        """
        Executes a query after substituting values. The query could be a Query or a PaginatedQuery.
        Args:
            query: Query to run
            substitutions: Substitutions to make

        Returns:
            Response as a JSON
        """
        if isinstance(query, PaginatedQuery):
            return self._execution_generator(query, substitutions)

        return self._execute(query, substitutions)

    def _execution_generator(self, query, substitutions: dict):
        """
        Executes a PaginatedQuery after substituting values.
        Args:
            query: Query to run
            substitutions: Substitutions to make

        Returns:
            Response as a JSON
        """
        while query.paginator.has_next():
            response = self._execute(query, substitutions)
            curr_node = response

            for field_name in query.path:
                curr_node = curr_node[Template(field_name).substitute(**substitutions)]

            end_cursor = curr_node["pageInfo"]["endCursor"]
            has_next_page = curr_node["pageInfo"]["hasNextPage"]
            query.paginator.update_paginator(has_next_page, end_cursor)
            yield response