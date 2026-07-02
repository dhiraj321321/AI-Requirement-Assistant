"""Testcase agent generates test cases from requirements and acceptance criteria."""

from services.testcase_service import TestcaseService


class TestcaseAgent:
    def __init__(self, testcase_service: TestcaseService):
        self.testcase_service = testcase_service

    def create_testcases(self, requirement_items):
        return []
