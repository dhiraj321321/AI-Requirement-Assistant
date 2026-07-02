"""Formatting utilities."""


def format_requirement(requirement):
    return f"{requirement.id}: {requirement.title}\n{requirement.description}"
