import { Home, Key, Tags, UserCheck } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: <Home className="text-2xl text-accent" />,
      title: "Buy Property",
      description: "Find your dream home from our wide range of properties available for purchase."
    },
    {
      icon: <Key className="text-2xl text-secondary" />,
      title: "Rent Property",
      description: "Explore rental options that suit your lifestyle and budget requirements."
    },
    {
      icon: <Tags className="text-2xl text-primary" />,
      title: "Sell Property",
      description: "List your property with us for maximum exposure and the best possible price."
    },
    {
      icon: <UserCheck className="text-2xl text-success" />,
      title: "Property Management",
      description: "We handle everything from tenant screening to maintenance for your investment properties."
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="block text-secondary font-medium mb-1">Our Services</span>
          <h2 className="text-2xl md:text-3xl font-poppins font-bold text-primary mb-4">What We Offer</h2>
          <p className="max-w-2xl mx-auto text-neutral-400">
            We provide comprehensive real estate services to help you find, buy, sell, or rent your perfect property with ease and confidence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 mx-auto bg-opacity-10 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${index === 0 ? 'rgba(52, 152, 219, 0.1)' : 
                              index === 1 ? 'rgba(231, 76, 60, 0.1)' : 
                              index === 2 ? 'rgba(44, 62, 80, 0.1)' : 
                              'rgba(46, 204, 113, 0.1)'}`}}
              >
                {service.icon}
              </div>
              <h3 className="text-lg font-poppins font-bold text-primary mb-2">{service.title}</h3>
              <p className="text-neutral-400 text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
