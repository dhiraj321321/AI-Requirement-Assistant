"""Azure DevOps API wrapper."""

class AzureDevOpsAPI:
    def __init__(self, organization, token):
        self.organization = organization
        self.token = token

    def request(self, endpoint, payload):
        return {}
