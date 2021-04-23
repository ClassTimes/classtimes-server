export const listUsersQuery = `
query {
    listUsers(filters: null, first: 2) {
        edges {
            node {
                _id
                username
            }
        }
    }
}`
