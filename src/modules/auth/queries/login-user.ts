const query = `#graphql
  mutation LoginUser($emailOrUsername: String!, $password: String!) {
    loginUser(payload: {
      emailOrUsername: $emailOrUsername,
      password: $password,
    }) {
      jwt
      user {
        email
      }
    }
  }
`

export default query
