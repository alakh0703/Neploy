
import { ApolloClient, InMemoryCache } from "@apollo/client";

const createApolloClient = () => {
  return new ApolloClient({
    uri: process.env.NEXT_PUBLIC_BACKEND1,
    cache: new InMemoryCache(),
  });
};
const client = createApolloClient();
export default client;