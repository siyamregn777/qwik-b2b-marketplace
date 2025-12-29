import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import Header from '~/components/layout/Header';
import ProductList from '~/components/products/ProductList';
import { graphQLClient } from '~/utils/graphql-client';

export const useProducts = routeLoader$(async () => {
  try {
    const query = `
      query GetProducts {
        Products(limit: 20) {
          docs {
            id
            name
            description
            price
            category
            variants {
              name
              sku
              price
              inventory
            }
            createdAt
          }
          totalDocs
        }
      }
    `;
    
    const data = await graphQLClient.request<{ Products: any }>(query);
    return data.Products;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return { docs: [], totalDocs: 0 };
  }
});

export default component$(() => {
  const productsData = useProducts();

  return (
    <div class="min-h-screen bg-gray-50">
      <Header />
      
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div class="mb-10">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">📦 Product Catalog</h1>
          <p class="text-gray-600">
            Displaying products from Payload CMS via GraphQL API
          </p>
          <div class="mt-4 flex items-center space-x-4">
            <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Total: {productsData.value.totalDocs} products
            </span>
            <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              GraphQL Endpoint: {import.meta.env.VITE_PUBLIC_GRAPHQL_URL}
            </span>
          </div>
        </div>

        {/* Products Grid */}
        <div class="mb-8">
          <ProductList limit={0} /> {/* 0 means show all */}
        </div>

        {/* GraphQL Info */}
        <div class="bg-white rounded-xl shadow p-6 mt-8">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">🔧 GraphQL Integration Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium text-gray-700 mb-2">Endpoint Information</h4>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">URL:</span>
                  <code class="text-sm bg-gray-100 px-2 py-1 rounded">
                    {import.meta.env.VITE_PUBLIC_GRAPHQL_URL}
                  </code>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Method:</span>
                  <span class="text-sm font-medium">POST</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Content-Type:</span>
                  <span class="text-sm font-medium">application/json</span>
                </div>
              </div>
            </div>
            <div>
              <h4 class="font-medium text-gray-700 mb-2">Sample Query</h4>
              <pre class="text-xs bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto">
{`query GetProducts {
  Products {
    docs {
      id
      name
      price
      variants {
        name
        sku
        price
      }
    }
  }
}`}</pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
});