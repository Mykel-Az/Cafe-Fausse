import re


def is_valid_email(email):
    """Check that a string is a valid email address format."""
    email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(email_regex, email) is not None