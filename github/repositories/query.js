import gql from 'graphql-tag';

export default gql`
  fragment issueFields on Issue {
    number
    title
    author {
      login
    }
    url
    createdAt
    comments {
      totalCount
    }
  }

  query getRepositories {
    organization(login: "openmined") {
      repositories(
        first: 100
        orderBy: { field: STARGAZERS, direction: DESC }
      ) {
        totalCount
        edges {
          cursor
          node {
            name
            createdAt
            description
            resourcePath
            forkCount
            primaryLanguage {
              name
            }
            recentIssues: issues(
              first: 5
              states: OPEN
              orderBy: { field: CREATED_AT, direction: DESC }
            ) {
              edges {
                node {
                  ...issueFields
                }
              }
            }
            topIssues: issues(
              first: 5
              states: OPEN
              orderBy: { field: COMMENTS, direction: DESC }
            ) {
              edges {
                node {
                  ...issueFields
                }
              }
            }
            stargazers {
              totalCount
            }
          }
        }
      }
    }
  }
`;
