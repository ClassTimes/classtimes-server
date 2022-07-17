const query = `#graphql
  query ListSchools(
    $first: Int,
    $after: String,
    $before: String,
  ) {
    listSchools(
      first: $first,
      after: $after,
      before: $before,
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
