# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in PrepBuddy, please report it by emailing the maintainers or opening a private security advisory on GitHub.

**Please do not report security vulnerabilities through public GitHub issues.**

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Security Best Practices

When using PrepBuddy:

1. **Never commit your Firebase credentials** to version control
2. **Keep your `.env` file secure** and never share it
3. **Use environment variables** for all sensitive configuration
4. **Regularly update dependencies** to patch known vulnerabilities
5. **Follow Firebase security rules** guidelines for Firestore

## Firebase Security

The included `firestore.rules` file implements security measures:

- Users can only read/write their own tracking data
- Leaderboard entries are read-only for all authenticated users
- Each user can only update their own leaderboard entry

## Dependency Security

We use:
- Dependabot for automatic dependency updates
- Regular security audits with `npm audit`

Run `npm audit` regularly to check for vulnerabilities in dependencies.
