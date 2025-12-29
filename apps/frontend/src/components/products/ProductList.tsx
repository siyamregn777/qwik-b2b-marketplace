import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import ProductCard from './ProductCard';
import { graphQLClient } from '~/utils/graphql-client';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  variants: Array<{
    name: string;
    sku: string;
    price: number;
    inventory: number;
  }>;
  createdAt: string;
}

interface Props {
  limit?: number;
}

export default component$<Props>(({ limit = 0 }) => {
  const products = useSignal<Product[]>([]);
  const loading = useSignal(true);
  const error = useSignal('');

  useTask$(async () => {
    try {
      loading.value = true;
      const query = `
        query GetProducts {
          Products(limit: ${limit || 100}) {
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
          }
        }
      `;

      const data = await graphQLClient.request<{ Products: { docs: Product[] } }>(query);
      products.value = data.Products.docs;
    } catch (err) {
      console.error('Error fetching products:', err);
      error.value = 'Failed to load products. Please check Payload CMS connection.';
      // Fallback mock data for demo
      products.value = [
        {
          id: '1',
          name: 'Industrial Bearing Set',
          description: 'High-quality industrial bearings for heavy machinery',
          price: 249.99,
          category: 'Industrial Parts',
          variants: [
            { name: 'Steel', sku: 'BRG-STL-001', price: 249.99, inventory: 50 },
            { name: 'Ceramic', sku: 'BRG-CRM-001', price: 349.99, inventory: 25 },
          ],
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'CNC Machine Tool',
          description: 'Precision CNC tooling for manufacturing',
          price: 899.99,
          category: 'Machinery',
          variants: [
            { name: 'Standard', sku: 'CNC-STD-001', price: 899.99, inventory: 10 },
            { name: 'Pro', sku: 'CNC-PRO-001', price: 1299.99, inventory: 5 },
          ],
          createdAt: new Date().toISOString(),
        },
      ];
    } finally {
      loading.value = false;
    }
  });

  if (loading.value) {
    return (
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} class="bg-white rounded-lg shadow p-6 animate-pulse">
            <div class="h-6 bg-gray-200 rounded mb-4"></div>
            <div class="h-4 bg-gray-200 rounded mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div class="h-10 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error.value) {
    return (
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p class="text-yellow-800">{error.value}</p>
        <p class="text-sm text-yellow-600 mt-2">
          Using demo data. Connect to Payload CMS at: {import.meta.env.VITE_PUBLIC_GRAPHQL_URL}
        </p>
      </div>
    );
  }

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.value.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
});