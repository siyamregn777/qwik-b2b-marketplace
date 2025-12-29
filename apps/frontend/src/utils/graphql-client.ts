import { GraphQLClient } from 'graphql-request';

export const graphQLClient = new GraphQLClient(
  import.meta.env.VITE_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/api/graphql',
  {
    headers: {
      'Content-Type': 'application/json',
    },
  }
);

// Helper function for authenticated requests
export const createAuthenticatedClient = (token: string) => {
  return new GraphQLClient(import.meta.env.VITE_PUBLIC_GRAPHQL_URL, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

// Common queries
export const productQueries = {
  getProducts: `
    query GetProducts($limit: Int, $page: Int) {
      Products(limit: $limit, page: $page) {
        docs {
          id
          name
          description
          price
          category
          sku
          variants {
            name
            sku
            price
            inventory
          }
          createdAt
          updatedAt
        }
        totalDocs
        totalPages
        page
      }
    }
  `,
  
  getProduct: `
    query GetProduct($id: String!) {
      Product(id: $id) {
        id
        name
        description
        price
        category
        sku
        variants {
          name
          sku
          price
          inventory
        }
        specifications
        images {
          url
          alt
        }
        createdAt
        updatedAt
      }
    }
  `,
};

// Helper function to fetch products
export async function fetchProducts(limit = 10, page = 1) {
  try {
    const data = await graphQLClient.request<{ Products: any }>(
      productQueries.getProducts,
      { limit, page }
    );
    return data.Products;
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw error;
  }
}