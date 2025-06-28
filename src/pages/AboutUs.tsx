import { Footer } from '../components/Footer';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Welcome to Brand Hub – The Future of Fashion Collaboration!
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              At Brand Hub, we're redefining the way brands and customers connect. We provide a dynamic, thriving platform where fashion brands can showcase and sell their latest collections, and in return, we handle all the logistics, customer service, and marketing to help them thrive.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 mb-8">
              We've created an innovative marketplace where fashion brands "drop" their clothes and collections, making them instantly available to a global audience. As soon as their collections are live, we handle the rest—processing orders, managing payments, and shipping directly to customers.
            </p>
            
            <p className="text-lg text-gray-600 mb-8">
              Here's the best part: We only succeed when our brands succeed. For every order placed, we earn a small percentage of the transaction—creating a win-win situation for everyone involved. Brands get access to a larger market without worrying about the day-to-day operations of running an online store, while we make sure the entire shopping experience is seamless for the customer.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Partner With Us?</h2>
            <ul className="space-y-4 text-lg text-gray-600 mb-8">
              <li className="flex items-start">
                <span className="font-bold mr-2">•</span>
                <span><strong>Reach a Global Audience:</strong> We market your collection across multiple channels to bring your brand to more customers.</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">•</span>
                <span><strong>Hassle-Free Operations:</strong> No need to worry about inventory, logistics, or customer service. We've got that covered.</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">•</span>
                <span><strong>Performance-Based Earnings:</strong> We only earn when you do. Our commission model is based on sales, so we're as invested in your success as you are.</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">•</span>
                <span><strong>Data-Driven Insights:</strong> Get access to valuable data on customer behavior and market trends to help inform your future collections.</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">A New Era of Fashion Collaboration</h2>
            <p className="text-lg text-gray-600 mb-8">
              Whether you're a well-established label or an emerging brand, Brand Hub is here to help you scale your business in an ever-evolving digital world. Our platform lets you drop your collections, and we handle everything else—from promoting your pieces to ensuring smooth transactions and happy customers.
            </p>
            
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">
                Join Brand Hub today and let us help you take your brand to the next level.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}