const query = `#graphql
  query FindSchool($id: ID!) {
    school(_id: $id) {
      _id
      name
      shortName
      parentSchool {
        _id
      }
    }
  }
`

export default query
