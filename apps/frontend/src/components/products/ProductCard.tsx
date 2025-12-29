import { component$ } from '@builder.io/qwik';

interface Variant {
  name: string;
  sku: string;
  price: number;
  inventory: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  variants: Variant[];
  createdAt: string;
}

interface Props {
  product: Product;
}

export default component$<Props>(({ product }) => {
  return (
    <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
      {/* Product Header */}
      <div class="p-6">
        <div class="flex justify-between items-start mb-3">
          <h3 class="text-lg font-bold text-gray-900 truncate">{product.name}</h3>
          <span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            {product.category}
          </span>
        </div>
        
        <p class="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        {/* Price */}
        <div class="mb-4">
          <p class="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
          <p class="text-xs text-gray-500">Base price</p>
        </div>
      </div>

      {/* Variants */}
      {product.variants.length > 0 && (
        <div class="px-6 pb-4">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Available Variants:</h4>
          <div class="space-y-2">
            {product.variants.map(variant => (
              <div 
                key={variant.sku} 
                class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p class="font-medium text-gray-900">{variant.name}</p>
                  <p class="text-xs text-gray-500">{variant.sku}</p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-gray-900">${variant.price.toFixed(2)}</p>
                  <p class="text-xs text-gray-500">
                    Stock: {variant.inventory} units
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div class="px-6 pb-6">
        <button class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
          Request Quote
        </button>
        <p class="text-xs text-gray-500 text-center mt-2">
          B2B pricing available on request
        </p>
      </div>
    </div>
  );
});