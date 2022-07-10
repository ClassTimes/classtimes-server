const query = `#graphql
  mutation LoginUser {
    loginUser(payload: {
      emailOrUsername: "frankmangone",
      password: "supersecre",
    }) {
      jwt
      user {
        email
      }
    }
  }
`

export default query
