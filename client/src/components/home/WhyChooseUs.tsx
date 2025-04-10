import { Medal, Star, DollarSign, Headphones } from "lucide-react";

const WhyChooseUs = () => {
  const features = [
    {
      icon: <Medal className="text-2xl text-accent-light" />,
      title: "Trusted by Thousands",
      description: "Over 10,000 satisfied customers have found their perfect property with us."
    },
    {
      icon: <Star className="text-2xl text-accent-light" />,
      title: "Top-Rated Agents",
      description: "Our team consists of experienced professionals with deep local knowledge."
    },
    {
      icon: <DollarSign className="text-2xl text-accent-light" />,
      title: "Best Price Guarantee",
      description: "We work hard to ensure you get the best value for your investment."
    },
    {
      icon: <Headphones className="text-2xl text-accent-light" />,
      title: "24/7 Support",
      description: "Our dedicated team is always available to answer your questions and concerns."
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="block text-accent-light font-medium mb-1">Our Advantages</span>
          <h2 className="text-2xl md:text-3xl font-poppins font-bold text-white mb-4">Why Choose HomeVerse</h2>
          <p className="max-w-2xl mx-auto text-neutral-100 opacity-80">
            We're committed to providing exceptional service and value to our clients at every step of their real estate journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-primary-light p-6 rounded-lg text-center">
              <div className="w-16 h-16 mx-auto bg-white bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-poppins font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-neutral-100 opacity-80 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
