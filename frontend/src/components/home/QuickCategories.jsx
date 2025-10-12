import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Building, Building2, Hotel } from 'lucide-react';

const QuickCategories = () => {
  const categories = [
    {
      id: 1,
      title: 'PG',
      icon: <Hotel size={32} />,
      description: 'Find affordable PG accommodations',
      link: '/properties/category/pg',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      id: 2,
      title: 'Hostel',
      icon: <Building2 size={32} />,
      description: 'Explore hostel options near you',
      link: '/properties/category/hostel',
      color: 'bg-green-50 text-green-600'
    },
    {
      id: 3,
      title: 'Flats',
      icon: <Home size={32} />,
      description: 'Discover apartments for rent',
      link: '/properties/category/flat',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      id: 4,
      title: 'Commercial',
      icon: <Building size={32} />,
      description: 'Find commercial spaces',
      link: '/properties/category/commercial',
      color: 'bg-amber-50 text-amber-600'
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Quick Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Find your perfect accommodation by category</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={category.link}
              className={`${category.color} rounded-xl p-6 transition-transform hover:scale-105 hover:shadow-md`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-sm opacity-80">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickCategories;