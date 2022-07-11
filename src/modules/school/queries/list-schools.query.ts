const query = `#graphql
  query ListSchools(
    $first: Int,
    $after: String,
  ) {
    listSchools(
      first: $first,
      after: $after,
    ) {
      __typename
      totalCount
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          _id
          name
        }
      }
    }
  }
`

export default query
