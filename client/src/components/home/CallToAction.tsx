import { Link } from "wouter";

const CallToAction = () => {
  return (
    <section className="py-12 md:py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="bg-primary rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h2 className="text-2xl md:text-3xl font-poppins font-bold text-white mb-2">Ready to Find Your Dream Home?</h2>
            <p className="text-neutral-100 opacity-90">Join thousands of satisfied clients who found their perfect property with HomeVerse.</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Link href="/properties">
              <a className="px-6 py-3 font-poppins font-medium bg-secondary text-white rounded-md hover:bg-secondary-dark transition-colors text-center">
                Browse Properties
              </a>
            </Link>
            <Link href="/contact">
              <a className="px-6 py-3 font-poppins font-medium bg-transparent border border-white text-white rounded-md hover:bg-white hover:text-primary transition-colors text-center">
                Contact Agent
              </a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
