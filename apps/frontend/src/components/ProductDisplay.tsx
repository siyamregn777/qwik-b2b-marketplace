import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import { fetchProducts } from '~/utils/graphql';

interface ProductVariant {
  name: string;
  sku: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  variants: ProductVariant[];
}

export const ProductDisplay = component$(() => {
  const products = useSignal<Product[]>([]);
  const loading = useSignal(true);

  useTask$(async () => {
    try {
      const data = await fetchProducts();
      products.value = data;
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      loading.value = false;
    }
  });

  if (loading.value) {
    return <div class="p-4 text-center">Loading products...</div>;
  }

  if (products.value.length === 0) {
    return (
      <div class="p-4 text-center">
        <p>No products found. Make sure Payload CMS is running.</p>
        <p class="text-sm text-gray-500 mt-2">
          Backend expected at: {import.meta.env.VITE_PUBLIC_GRAPHQL_URL}
        </p>
      </div>
    );
  }

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.value.map((product) => (
        <div key={product.id} class="border rounded-lg p-4 shadow-sm">
          <h3 class="text-xl font-semibold mb-2">{product.name}</h3>
          <p class="text-gray-600 mb-3">{product.description}</p>
          <p class="text-lg font-bold mb-4">${product.price.toFixed(2)}</p>
          
          {product.variants && product.variants.length > 0 && (
            <div class="mb-4">
              <h4 class="font-medium mb-2">Variants:</h4>
              <ul class="space-y-1">
                {product.variants.map((variant, idx) => (
                  <li key={idx} class="flex justify-between text-sm">
                    <span>{variant.name}</span>
                    <span class="font-medium">${variant.price?.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <button class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            View Details
          </button>
        </div>
      ))}
    </div>
  );
});