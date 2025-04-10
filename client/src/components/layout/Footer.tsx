import { Link } from "wouter";
import { Home, MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary-dark text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1 */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Home className="text-secondary text-2xl" />
              <h3 className="text-xl font-poppins font-bold">HomeVerse</h3>
            </div>
            <p className="text-neutral-100 opacity-80 mb-4">
              Making your real estate dreams a reality. Find, buy, sell, or rent your ideal property with our expert assistance.
            </p>
            <div className="flex space-x-3">
              <a 
                href="#" 
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-poppins font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-neutral-100 opacity-80 hover:text-secondary transition-colors">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/properties">
                  <a className="text-neutral-100 opacity-80 hover:text-secondary transition-colors">Properties</a>
                </Link>
              </li>
              <li>
                <Link href="/auth">
                  <a className="text-neutral-100 opacity-80 hover:text-secondary transition-colors">Login/Register</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-neutral-100 opacity-80 hover:text-secondary transition-colors">Contact</a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3 */}
          <div>
            <h3 className="text-lg font-poppins font-bold mb-4">Property Types</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties?type=house">
                  <a className="text-neutral-100 opacity-80 hover:text-secondary transition-colors">Houses</a>
                </Link>
              </li>
              <li>
                <Link href="/properties?type=apartment">
                  <a className="text-neutral-100 opacity-80 hover:text-secondary transition-colors">Apartments</a>
                </Link>
              </li>
              <li>
                <Link href="/properties?type=villa">
                  <a className="text-neutral-100 opacity-80 hover:text-secondary transition-colors">Villas</a>
                </Link>
              </li>
              <li>
                <Link href="/properties?type=condo">
                  <a className="text-neutral-100 opacity-80 hover:text-secondary transition-colors">Condos</a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 4 */}
          <div>
            <h3 className="text-lg font-poppins font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mt-1 mr-3 text-secondary h-5 w-5 flex-shrink-0" />
                <span className="text-neutral-100 opacity-80">123 Real Estate Ave, New York, NY 10001</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 text-secondary h-5 w-5 flex-shrink-0" />
                <span className="text-neutral-100 opacity-80">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 text-secondary h-5 w-5 flex-shrink-0" />
                <span className="text-neutral-100 opacity-80">info@homeverse.com</span>
              </li>
              <li className="flex items-center">
                <Clock className="mr-3 text-secondary h-5 w-5 flex-shrink-0" />
                <span className="text-neutral-100 opacity-80">Mon-Fri: 9AM - 6PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-6 border-t border-neutral-700 text-center">
          <p className="text-neutral-100 opacity-80 text-sm">
            &copy; {new Date().getFullYear()} HomeVerse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
