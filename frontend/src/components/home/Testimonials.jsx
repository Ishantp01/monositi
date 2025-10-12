import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Star, CheckCircle } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Rahul Sharma',
      role: 'Property Owner',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      content: 'Monositi made it incredibly easy to list my property. The verification process was smooth, and I found tenants within a week!',
      rating: 5,
      verified: true
    },
    {
      id: 2,
      name: 'Priya Patel',
      role: 'Student',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      content: 'Finding a PG was so simple with Monositi. The verified badge gave me confidence that I was choosing a safe place to stay.',
      rating: 5,
      verified: true
    },
    {
      id: 3,
      name: 'Vikram Singh',
      role: 'Business Owner',
      image: 'https://randomuser.me/api/portraits/men/67.jpg',
      content: 'The commercial property listings on Monositi are excellent. I found the perfect space for my new office in just a few days.',
      rating: 4,
      verified: true
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">What Our Users Say</h2>
          <p className="text-gray-600">Trusted by thousands of property seekers and owners</p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-gray-50 rounded-xl p-6 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        size={16}
                        className={i < testimonial.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 flex-grow">{testimonial.content}</p>
                  
                  {testimonial.verified && (
                    <div className="mt-4 flex items-center text-green-600 text-sm">
                      <CheckCircle size={16} className="mr-1" />
                      <span>Monositi Verified User</span>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 mt-12">
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium flex items-center">
            <CheckCircle size={18} className="mr-2" />
            Monositi Verified
          </div>
          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full font-medium flex items-center">
            <Star size={18} className="mr-2" />
            4.8/5 Average Rating
          </div>
          <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-full font-medium flex items-center">
            <CheckCircle size={18} className="mr-2" />
            1000+ Verified Properties
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;