import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  discount?: number;
  freeShipping?: boolean;
  images: string[];
}

 export function ProductDetailsPage() {
   const { id } = useParams();
   const [product, setProduct] = useState<Product | null>(null);
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const [mainImage, setMainImage] = useState<string | null>(null);

   useEffect(() => {
     const loadProduct = async () => {
       const products: Product[] = await fetchProducts();
      
       async function fetchProducts(): Promise<Product[]> {
         return [
           {
             id: '1',
             name: 'Sample Product',
             category: 'Category',
             description: 'Description',
             price: 100,
             discount: 10,
             freeShipping: true,
             images: ['image1.jpg', 'image2.jpg'],
           },
         ];
       }
       const foundProduct = products.find((p) => p.id === id);
       if (foundProduct) {
         setProduct(foundProduct);
         setMainImage(foundProduct.images[0]);
       } else {
         navigate('/products');
         toast.error('Product not found');
       }
     };

     loadProduct();
   }, [id, navigate]);

   if (!product) {
     return (
       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
         <div className="glass-dark p-8 rounded-2xl animate-pulse">
           <div className="w-16 h-16 gradient-to-r from-gray-300 to-gray-400 rounded-full mx-auto mb-4"></div>
           <p className="text-gray-600 text-center">Loading...</p>
         </div>
       </div>
     );
   }

   return (
     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
       <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-fade-up">
           {/* Product Images */}
           <div className="space-y-6">
             <div className="aspect-w-1 aspect-h-1 rounded-2xl overflow-hidden glass-dark shadow-xl">
               <img
                 src={mainImage || ''}
                 alt={product.name}
                 className="w-full h-[500px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
               />
             </div>
             <div className="grid grid-cols-4 gap-4">
               {product.images.map((image, index) => (
                 <img
                   key={index}
                   src={image}
                   alt={`Thumbnail ${index + 1}`}
                   className="h-24 w-24 object-cover rounded-xl cursor-pointer hover:opacity-80 transition-all duration-300 ease-in-out scale-100 hover:scale-110 border-transparent hover:border-gray-300"
                   onClick={() => setMainImage(image)}
                 />
               ))}
             </div>
           </div>

           {/* Product Info */}
           <div className="space-y-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
             <div>
               <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                 {product.name}
               </h1>
               <p className="text-lg text-gray-600 bg-clip-text text-transparent gradient-to-r from-gray-600 to-gray-500">
                 {product.category}
               </p>
             </div>
            
             <p className="text-gray-600 leading-relaxed text-lg">
               {product.description}
             </p>
            
             <div className="space-y-4">
               {product.discount ? (
                 <div className="space-y-2">
                   <p className="text-2xl font-bold text-gray-400 line-through mb-1">
                     ${product.price.toFixed(2)}
                   </p>
                   <div className="flex items-center space-x-4">
                     <p className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                       ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                     </p>
                     <span className="bg-gradient-to-r from-red-500 to-pink-50 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                       {product.discount}% OFF
                     </span>
                   </div>
                 </div>
               ) : (
                 <p className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                   ${product.price.toFixed(2)}
                 </p>
               )}
              
               {product.freeShipping && (
                 <div className="flex items-center space-x-2">
                   <span className="w-3 h-3 gradient-to-r from-green-400 to-green-600 rounded-full"></span>
                   <p className="text-green-600 font-semibold">Free shipping</p>
                 </div>
               )}
             </div>
            
             <button
               onClick={() => {
                 dispatch({
                   type: 'ADD_TO_CART',
                   payload: { ...product, quantity: 1 },
                 });
                 toast.success(`${product.name} added to cart!`);
               }}
               className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ease-in-out scale-100 hover:scale-150 shadow-xl transform"
             >
               Add to Cart
             </button>
           </div>
         </div>
       </div>
     </div>
   );
 }