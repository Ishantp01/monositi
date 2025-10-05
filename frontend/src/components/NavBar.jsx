// 'use client'; 

// import React, { useState, useEffect } from 'react';
// import { Lock, MapPinned, Plus, List, Settings } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const Navbar = ({ bgColor = 'bg-theme-primary', avatarUrl }) => {
//     const [showDropdown, setShowDropdown] = useState(false);
//     const [role, setRole] = useState('');

//     useEffect(() => {
//         const storedUser = localStorage.getItem('user');
//         if (storedUser) {
//             setRole(JSON.parse(storedUser)); 
//         }
//     }, []);

//     let buttonText = '';
//     let buttonLink = '';
//     switch (role) {
//         case 'landlord':
//             buttonText = 'Manage Properties';
//             buttonLink = '/my-properties';
//             break;
//         case 'serviceProvider':
//             buttonText = 'Service Provider';
//             buttonLink = '/service-provider';
//             break;
//         case 'tenant':
//             buttonText = 'Request Service';
//             buttonLink = '/request-service';
//             break;
//         default:
//             buttonText = 'Dashboard';
//             buttonLink = '/dashboard';
//     }

//     return (
//         <nav className={`w-full select-none ${bgColor} flex items-center justify-between px-4 lg:px-12 py-3 relative`}>
//             <div className="flex items-center space-x-2 md:absolute md:left-1/2 md:transform md:-translate-x-1/2 cursor-default">
//                 <Lock className="text-black" size={18} strokeWidth={4} />
//                 <h1 className="text-black text-base lg:text-xl font-inter font-extrabold">BUILD</h1>
//             </div>

//             <div className="ml-auto flex items-center gap-4 lg:gap-6">
//                 {role === 'landlord' ? (
//                     <div className="relative">
//                         <button
//                             onClick={() => setShowDropdown(!showDropdown)}
//                             className="bg-theme-secondary text-black transition-colors duration-500 hover:bg-white flex items-center justify-center rounded-full p-2 w-10 h-10 lg:w-auto lg:h-auto lg:px-6 lg:py-2"
//                         >
//                             <Settings className="block lg:hidden" size={18} />
//                             <span className="hidden lg:block text-sm lg:text-base">{buttonText}</span>
//                         </button>

//                         {showDropdown && (
//                             <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
//                                 <div className="py-1">
//                                     <Link
//                                         to="/add-property"
//                                         className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                                         onClick={() => setShowDropdown(false)}
//                                     >
//                                         <Plus className="mr-3 h-4 w-4" />
//                                         Add Property
//                                     </Link>
//                                     <Link
//                                         to="/my-properties"
//                                         className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                                         onClick={() => setShowDropdown(false)}
//                                     >
//                                         <List className="mr-3 h-4 w-4" />
//                                         My Properties
//                                     </Link>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 ) : (
//                     <Link
//                         to={buttonLink}
//                         className="bg-theme-secondary text-black transition-colors duration-500 hover:bg-white flex items-center justify-center rounded-full p-2 w-10 h-10 lg:w-auto lg:h-auto lg:px-6 lg:py-2"
//                     >
//                         <span className="hidden lg:block text-sm lg:text-base">{buttonText}</span>
//                     </Link>
//                 )}

//                 <Link to="/profile">
//                     <img
//                         src={avatarUrl}
//                         alt="User Avatar"
//                         className="w-10 lg:w-14 h-10 lg:h-14 rounded-full object-cover backdrop-blur bg-white/10 cursor-pointer"
//                     />
//                 </Link>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;

'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Plus, List, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ bgColor = 'bg-theme-primary', avatarUrl }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('role');
    if (storedUser) setRole(JSON.parse(storedUser));
  }, []);

  let buttonText = '';
  let buttonLink = '';

  switch (role) {
    case 'landlord':
      buttonText = 'Manage Properties';
      buttonLink = '/my-properties';
      break;
    case 'serviceProvider':
      buttonText = 'Service Provider';
      buttonLink = '/service-request';
      break;
    case 'tenant':
      buttonText = 'Tenant Menu';
      buttonLink = '/tenant-requests';
      break;
    case 'admin':
      buttonText = 'admin Menu';
      buttonLink = '/admin';
      break;
    default:
      buttonText = 'Dashboard';
      buttonLink = '/dashboard';
  }

  const hasDropdown = ['landlord', 'serviceProvider', 'tenant'].includes(role);

  return (
    <nav className={`w-full select-none ${bgColor} flex items-center justify-between px-4 lg:px-12 py-3 relative`}>
      <div className="flex items-center space-x-2 md:absolute md:left-1/2 md:transform md:-translate-x-1/2 cursor-default">
        <Lock className="text-black" size={18} strokeWidth={4} />
        <h1 className="text-black text-base lg:text-xl font-inter font-extrabold">BUILD</h1>
      </div>

      <div className="ml-auto flex items-center gap-4 lg:gap-6">
        {hasDropdown ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-theme-secondary text-black transition-colors duration-500 hover:bg-white flex items-center justify-center rounded-full p-2 w-10 h-10 lg:w-auto lg:h-auto lg:px-6 lg:py-2"
            >
              <Settings className="block lg:hidden" size={18} />
              <span className="hidden lg:block text-sm lg:text-base">{buttonText}</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  {role === 'landlord' && (
                    <>
                      <Link to="/add-property" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowDropdown(false)}>
                        <Plus className="mr-3 h-4 w-4" /> Add Property
                      </Link>
                      <Link to="/my-properties" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowDropdown(false)}>
                        <List className="mr-3 h-4 w-4" /> My Properties
                      </Link>
                    </>
                  )}
                  {role === 'serviceProvider' && (
                    <>
                      <Link to="/service-request" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowDropdown(false)}>
                        <Plus className="mr-3 h-4 w-4" /> Form
                      </Link>
                      <Link to="/services" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowDropdown(false)}>
                        <List className="mr-3 h-4 w-4" /> Services
                      </Link>
                    </>
                  )}
                  {role === 'tenant' && (
                    <>
                      <Link to="/service-request" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowDropdown(false)}>
                        <Plus className="mr-3 h-4 w-4" /> Request Service
                      </Link>
                      <Link to="/service-request-list" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowDropdown(false)}>
                        <List className="mr-3 h-4 w-4" /> My Requests
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to={buttonLink} className="bg-theme-secondary text-black transition-colors duration-500 hover:bg-white flex items-center justify-center rounded-full p-2 w-10 h-10 lg:w-auto lg:h-auto lg:px-6 lg:py-2">
            <span className="hidden lg:block text-sm lg:text-base">{buttonText}</span>
          </Link>
        )}

        <Link to="/profile">
          <img src={avatarUrl} alt="User Avatar" className="w-10 lg:w-14 h-10 lg:h-14 rounded-full object-cover backdrop-blur bg-white/10 cursor-pointer" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
