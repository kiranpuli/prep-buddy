# Contributing to PrepBuddy

Thank you for your interest in contributing to PrepBuddy! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

- Check if the bug has already been reported in [Issues](https://github.com/yourusername/prepbuddy/issues)
- If not, create a new issue with a clear title and description
- Include steps to reproduce, expected behavior, and actual behavior
- Add screenshots if applicable

### Suggesting Enhancements

- Check existing issues and discussions for similar suggestions
- Create a new issue with the `enhancement` label
- Clearly describe the feature and its benefits
- Provide examples of how it would work

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the coding style** already established in the project
3. **Write clear commit messages** describing what changed and why
4. **Test your changes** thoroughly before submitting
5. **Update documentation** if you're changing functionality
6. **Submit your PR** with a clear description of the changes

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and add your Firebase credentials
4. Create `src/config/firebase.ts` following the example in the README
5. Run the development server: `npm run dev`

## Code Style

- Use TypeScript for all new code
- Follow the existing ESLint configuration
- Use functional components and hooks in React
- Keep components small and focused on a single responsibility
- Write descriptive variable and function names

## Adding Company Data

To add a new company's problem set:

1. Create a folder under `data/` with the company name
2. Add CSV files with naming: `1. Thirty Days.csv`, `2. Three Months.csv`, etc.
3. Ensure CSV columns: `Title`, `Difficulty`, `Frequency`, `Acceptance Rate`, `Link`, `Topics`
4. Submit a PR with the new data

## Questions?

Feel free to open an issue for any questions about contributing!

Thank you for helping make PrepBuddy better! 🚀
