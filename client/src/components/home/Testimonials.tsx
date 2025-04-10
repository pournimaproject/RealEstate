import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      image: "https://randomuser.me/api/portraits/women/56.jpg",
      name: "Jennifer Anderson",
      role: "Home Buyer",
      comment: "HomeVerse made finding our dream home incredibly easy. Our agent was knowledgeable, responsive, and really understood what we were looking for. We couldn't be happier with our new home!",
      rating: 5
    },
    {
      image: "https://randomuser.me/api/portraits/men/54.jpg",
      name: "David Thompson",
      role: "Property Seller",
      comment: "I was amazed at how quickly HomeVerse sold my property. Their marketing strategy was excellent, and they got me a better price than I expected. The whole process was smooth and stress-free.",
      rating: 4.5
    },
    {
      image: "https://randomuser.me/api/portraits/women/33.jpg",
      name: "Maria Sanchez",
      role: "Apartment Renter",
      comment: "As someone new to the city, I was worried about finding a good apartment. HomeVerse made it so simple. They showed me great options within my budget and helped with all the paperwork. Highly recommend!",
      rating: 5
    }
  ];

  // Helper function to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-secondary text-secondary" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="text-secondary" />
          <Star className="absolute top-0 left-0 fill-secondary text-secondary overflow-hidden w-[50%]" />
        </div>
      );
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-secondary" />);
    }
    
    return stars;
  };

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="block text-secondary font-medium mb-1">Testimonials</span>
          <h2 className="text-2xl md:text-3xl font-poppins font-bold text-primary mb-4">What Our Clients Say</h2>
          <p className="max-w-2xl mx-auto text-neutral-400">
            Hear from our satisfied clients about their experience working with HomeVerse to find their dream properties.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-neutral-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <img src={testimonial.image} alt={testimonial.name} className="w-14 h-14 rounded-full mr-4" />
                <div>
                  <h4 className="font-poppins font-bold text-primary">{testimonial.name}</h4>
                  <p className="text-neutral-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-neutral-500 mb-4">{testimonial.comment}</p>
              <div className="flex text-secondary">
                {renderStars(testimonial.rating)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
