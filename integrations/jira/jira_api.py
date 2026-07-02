"""Jira API wrapper."""

class JiraAPI:
    def __init__(self, base_url, api_token):
        self.base_url = base_url
        self.api_token = api_token

    def request(self, endpoint, payload):
        return {}
