import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookIdGIT
        authors
        description
        title
        image
        link
      }
    }
  }
`;
