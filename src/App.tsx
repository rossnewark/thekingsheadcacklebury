import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Menu, X } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [rotation, setRotation] = useState(0);
  const lastScrollY = useRef(0);
  const scrollTimer = useRef(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine if we're scrolled past threshold
      setIsScrolled(currentScrollY > 50);

      // Only update rotation if we've scrolled at least 5px
      if (Math.abs(currentScrollY - lastScrollY.current) >= 5) {
        if (currentScrollY > lastScrollY.current) {
          // Scrolling down - rotate clockwise (limit to 180 degrees)
          setRotation(prev => Math.min(prev + 2, 180));
        } else if (currentScrollY < lastScrollY.current) {
          // Scrolling up - rotate counter-clockwise (minimum 0 degrees)
          setRotation(prev => Math.max(prev - 2, 0));
        }

        // Update last scroll position
        lastScrollY.current = currentScrollY;
      }

      // Set scrolling flag
      isScrolling.current = true;

      // Clear previous timer
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }

      // Set new timer to detect when scrolling stops
      scrollTimer.current = setTimeout(() => {
        isScrolling.current = false;

        // If we've scrolled back to the top, reset rotation
        if (window.scrollY === 0) {
          setRotation(0);
        }
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, []);

  const handleLogoClick = () => {
    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Reset rotation with a slight delay to allow scroll to complete
    setTimeout(() => {
      setRotation(0);
    }, 500);
  };

  const foodImages = [
    "/roast_lunch.jpg",
    "/roast_with_mum.jpg",
    "/customers_enjoying_a_roast.jpg",
  ];


  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <div className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#f3df63]' : ''}`}>
        <div className="container mx-auto px-4">
          <nav className={`flex justify-between items-center transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
            <div className="flex items-center gap-4">
              <div
                className={`transition-all duration-300 flex items-center justify-center cursor-pointer ${isScrolled ? 'w-10 h-10' : 'w-16 h-16'}`}
                onClick={handleLogoClick}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: 'transform 0.3s ease-out, width 0.3s ease, height 0.3s ease'
                }}
              >
                <img
                  src="/kingshead_cacklebury_logo.svg"
                  alt="Kings Head Logo"
                  className="w-full h-full"
                />
              </div>
              <h1 className={`text-[#f3df63] font-bold transition-all duration-300 ${isScrolled ? 'text-black text-2xl' : 'text-3xl md:text-4xl leading-tight'}`}>
                {isScrolled ? 'Kings Head Cacklebury' : (
                  <>
                    Kings Head<br />Cacklebury
                  </>
                )}
              </h1>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden p-2 transition-colors ${isScrolled ? 'text-black' : 'text-white'}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="absolute top-full right-0 w-64 bg-white rounded-lg shadow-xl py-4 md:hidden">
                <a href="#about" className="block px-6 py-2 hover:bg-[#f3df63]/10">About</a>
                <a href="#food" className="block px-6 py-2 hover:bg-[#f3df63]/10">Food</a>
                <a href="#events" className="block px-6 py-2 hover:bg-[#f3df63]/10">Events</a>
                <a href="#contact" className="block px-6 py-2 hover:bg-[#f3df63]/10">Contact</a>
                <div className="px-6 py-4 border-t border-gray-200">
                  <a href="tel:01323440447" className="flex items-center gap-2 text-[#e6a648]">
                    <Phone className="w-4 h-4" />
                    01323 440447
                  </a>
                </div>
              </div>
            )}

            {/* Desktop Menu */}
            <div className={`hidden md:flex space-x-6 transition-colors ${isScrolled ? 'text-black' : 'text-white'}`}>
              <a href="#about" className={`hover:text-[#e6a648] ${isScrolled ? 'text-black' : ''}`}>About</a>
              <a href="#food" className={`hover:text-[#e6a648] ${isScrolled ? 'text-black' : ''}`}>Food</a>
              <a href="#events" className={`hover:text-[#e6a648] ${isScrolled ? 'text-black' : ''}`}>Events</a>
              <a href="#contact" className={`hover:text-[#e6a648] ${isScrolled ? 'text-black' : ''}`}>Contact</a>
            </div>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative flex flex-col justify-center bg-cover bg-center h-[1505px] sm:h-[1480px] md:h-[700px] lg:h-[760px]"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=2074")',
          backgroundAttachment: 'fixed',
          width: '100%',
        }}>
        <div className="absolute inset-0 bg-black/40">
          <div className="container mx-auto px-4 py-6">
            <div className="pt-8">
              <div className="mt-12 md:mt-16 max-w-4xl mx-auto text-center">
                <h2 className="text-[#f3df63] text-3xl md:text-5xl font-bold mb-0">Your Local Community Pub Since 1850</h2>
                <p className="text-white text-xl md:text-2xl mb-2">Experience Sussex hospitality, Harvey's Ales & home-cooked food in our historic Hailsham pub</p>
                <a
                  href="tel:01323440447"
                  className="inline-flex items-center gap-2 bg-[#f3df63] text-black px-6 py-3 rounded-lg hover:bg-[#e6a648] hover:text-white transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Get in touch with us: 01323 440447
                </a>
              </div>

              <div className="relative z-10 mt-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Opening Hours */}
                  <div className="bg-white/95 rounded-lg shadow-xl backdrop-blur-sm overflow-hidden">
                    <div className="p-[2px]">
                      <img
                        src="../public/standard_opening_hours.png"
                        alt="Opening Hours Blackboard"
                        className="w-full h-48 sm:h-48 md:h-40 lg:h-64 object-cover rounded-t-lg"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="text-[#e6a648]" />
                        <h2 className="text-black text-xl font-semibold">Opening Hours</h2>
                      </div>
                      <div className="text-gray-700 space-y-2">
                        <p>Mon-Wed: 4pm - 11pm</p>
                        <p>Thu-Fri: 2pm - 11pm</p>
                        <p>Sat-Sun: 12pm - 11pm</p>
                      </div>
                    </div>
                  </div>

                  {/* Location with Pub Image */}
                  <div className="bg-white/95 rounded-lg shadow-xl backdrop-blur-sm overflow-hidden">
                    <div className="p-[2px]">
                      <img
                        src="../public/kingshead_cacklebury_pub_outside.jpg"
                        alt="Kings Head Cacklebury Exterior"
                        className="w-full h-48 sm:h-48 md:h-40 lg:h-64 object-cover rounded-t-lg"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="text-[#e6a648]" />
                        <h2 className="text-black text-xl font-semibold">Find Us</h2>
                      </div>
                      <p className="text-gray-700">
                        146 South Road<br />
                        Hailsham, East Sussex<br />
                        BN27 3NJ
                      </p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="bg-white/95 rounded-lg shadow-xl backdrop-blur-sm overflow-hidden">
                    <div className="p-[2px]">
                      <img
                        src="../public/contact_a_board.png"
                        alt="Contact A-Board"
                        className="w-full h-48 sm:h-48 md:h-40 lg:h-64 object-cover rounded-t-lg"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Phone className="text-[#e6a648]" />
                        <h2 className="text-black text-xl font-semibold">Contact Us</h2>
                      </div>
                      <div className="text-gray-700 space-y-4">
                        <a href="tel:01323440447" className="flex items-center gap-2 hover:text-[#e6a648]">
                          <Phone className="w-4 h-4" />
                          01323 440447
                        </a>
                        <a href="mailto:lisa.kingshead@hotmail.com" className="flex items-center gap-2 hover:text-[#e6a648]">
                          <Mail className="w-4 h-4" />
                          lisa.kingshead@hotmail.com
                        </a>
                        <div className="flex gap-4 mt-4">
                          <a
                            href="https://www.facebook.com/KingsHeadCacklebury"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-[#e6a648]"
                          >
                            <Facebook className="w-4 h-4" />
                            <span className="leading-none">facebook.com/KingsHeadCacklebury</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <section id="food" className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8">Our Legendary Sunday Roasts</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Swiper Slider - Adjusted for better mobile display */}
            <div className="w-full overflow-hidden">
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop={true}
                className="rounded-lg shadow-xl w-full"
              >
                {foodImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="w-full rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover object-bottom"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Roast Details */}
            <div className="flex flex-col justify-start">
              <h3 className="text-2xl font-semibold mb-4">Join Us Every Sunday</h3>
              <p className="text-lg text-gray-700 mb-6">
                Our legendary Sunday roasts are the talk of Hailsham, and for good reason! Every plate is crafted with
                <strong> locally sourced, top-quality ingredients</strong>, ensuring the freshest flavors in every bite.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Choose from <strong>succulent roast beef, tender pork, mouthwatering chicken</strong>, or our <em>delicious vegetarian option</em>,
                each cooked to perfection and served with <strong>crispy golden roast potatoes, homemade Yorkshire puddings, seasonal vegetables,
                  and rich, velvety gravy</strong>.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                What makes our roasts truly special? They're personally prepared by our landlord, <strong>Pete Loft – better
                  known as ‘Lofty’</strong>. A <em>highly trained chef</em> with experience in some of London’s finest eateries,
                Lofty brings his passion for great food to every dish, making your Sunday lunch an experience to remember.
              </p>

              <p className="text-lg text-gray-700 mb-8">
                <strong>Join us this Sunday and taste the difference!</strong>
              </p>

              {/* Sunday Roast Times Section */}
              <div className="bg-[#f3df63]/10 p-6 rounded-lg py-8">
                <p className="text-xl font-semibold mb-2">Sunday Roast Times</p>
                <p className="text-gray-700">Served 12pm - 4pm every Sunday</p>
                <p className="text-gray-700 mt-2">
                  <a
                    href="tel:01323440447"
                    className="inline-flex items-center gap-2 bg-[#e6a648] text-white px-6 py-3 rounded-lg hover:bg-[#f3df63] hover:text-black transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    Book Your Table Now: 01323 440447
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Harvey's Section */}
      <section className="py-16 bg-[#f3df63]/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Proud to Serve Harvey's Ales</h2>
              <p className="text-gray-700 text-lg mb-6">
                As a proud Harvey's pub, we serve the finest selection of Sussex ales,
                brewed in Lewes using traditional methods and local ingredients.
              </p>
              <p className="text-gray-700 text-lg">
                From the classic Sussex Best Bitter to seasonal specialties,
                experience the authentic taste of Sussex in every pint.
              </p>
            </div>
            <div>
              <img
                src="/harveys_pumps.jpg"
                alt="Harvey's beer on tap"
                className="rounded-lg shadow-xl w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">What's On</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-[#e6a648]">
              <img
                src="/roast_lunch.jpg"
                alt="Sunday Roast"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Sunday Roast</h3>
                <p className="text-gray-600">Every Sunday</p>
                <p className="mt-2">Join us for our famous Sunday roast with all the trimmings!</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-[#e6a648]">
              <img
                src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=2074"
                alt="Pub Quiz"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Pub Quiz Night</h3>
                <p className="text-gray-600">Every Sunday Evening</p>
                <p className="mt-2">Test your knowledge and win great prizes!</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-[#e6a648]">
              <img
                src="/live_music.jpg"
                alt="Live Music"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Live Music</h3>
                <p className="text-gray-600">Watch this space!</p>
                <p className="mt-2">Local bands & singers on our purpose built stage in the large pub garden</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#e6a648] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img
                    src="/kingshead_cacklebury_logo.svg"
                    alt="Kings Head Logo"
                    className="w-12 h-12"
                  />
                </div>
                <h3 className="text-black text-xl font-semibold">Kings Head Cacklebury</h3>
              </div>
              <p>Your local community pub in Hailsham since 1850</p>
            </div>
            <div>
              <h3 className="text-black text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="hover:text-black">About Us</a></li>
                <li><a href="#food" className="hover:text-black">Food</a></li>
                <li><a href="#events" className="hover:text-black">Events</a></li>
                <li><a href="#contact" className="hover:text-black">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-black text-xl font-semibold mb-4">Contact Details</h3>
              <ul className="space-y-2">
                <li>
                  <a href="tel:01323440447" className="flex items-center gap-2 hover:text-black">
                    <Phone className="w-4 h-4" />
                    01323 440447
                  </a>
                </li>
                <li>
                  <a href="mailto:lisa.kingshead@hotmail.com" className="flex items-center gap-2 hover:text-black">
                    <Mail className="w-4 h-4" />
                    lisa.kingshead@hotmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  146 South Road, Hailsham
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-black text-xl font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/KingsHeadCacklebury" target="_blank" rel="noopener noreferrer" className="text-white hover:text-black">
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;