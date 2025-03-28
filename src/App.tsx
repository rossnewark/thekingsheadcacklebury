import { useState, useEffect, useRef } from "react";
import { MapPin, Phone, Mail, Clock, Facebook, Menu, X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import FacebookPosts from "./components/facebookPosts";
import FacebookEvents from "./components/facebookEvents";
import "swiper/css";
import "swiper/css/pagination";

// Define a type for the timer to fix the NodeJS namespace issue
type TimeoutType = ReturnType<typeof setTimeout>;

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [rotation, setRotation] = useState(0);
  const lastScrollY = useRef(0);
  const scrollTimer = useRef<TimeoutType | null>(null);
  const isScrolling = useRef(false);
  const logoRotationStyle = { transform: `rotate(${rotation}deg)` };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine if we're scrolled past threshold
      setIsScrolled(currentScrollY > 50);

      // Only update rotation if we've scrolled at least 5px
      if (Math.abs(currentScrollY - lastScrollY.current) >= 5) {
        if (currentScrollY > lastScrollY.current) {
          // Scrolling down - rotate clockwise
          setRotation((prev) => Math.min(prev + 2, 360));
        } else if (currentScrollY < lastScrollY.current) {
          // Scrolling up - rotate counter-clockwise (minimum 0 degrees)
          setRotation((prev) => Math.max(prev - 2, 0));
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

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, []);

  const handleLogoClick = () => {
    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Reset rotation with a slight delay to allow scroll to complete
    setTimeout(() => {
      setRotation(0);
    }, 500);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const foodImages = [
    "/roast_lunch.png",
    "/roast_lunch_chicken.png",
    "/customers_enjoying_a_roast.png",
  ];

  const harveysImages = [
    "/harveys_pumps.png",
    "/guiness.png",
    "/cruzcampo.png",
    "/harveys_best.png",
    "/guiness_glass.png",
    "/harveys_pale.png",
    "/wine.png",
  ];

  function useVideoScaling() {
    const [videoStyle, setVideoStyle] = useState({});
    
    useEffect(() => {
      const updateVideoStyle = () => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
          setVideoStyle({
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
            transform: 'translateY(-20%)'
          });
        } else {
          setVideoStyle({
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
          });
        }
      };
      
      updateVideoStyle();
      window.addEventListener('resize', updateVideoStyle);
      return () => window.removeEventListener('resize', updateVideoStyle);
    }, []);
    
    return videoStyle;
  }
  
  // Then in your component:
  const videoStyle = useVideoScaling();

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <div
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-[#f3df63] border-t-4 border-[#e6a648]" : ""
        }`}
      >
        <div className="container mx-auto px-4">
          <nav
            className={`flex justify-between items-center transition-all duration-300 ${
              isScrolled ? "py-2" : "py-4"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`transition-all duration-300 flex items-center justify-center cursor-pointer ${
                  isScrolled ? "w-10 h-10" : "w-16 h-16"
                }`}
                onClick={handleLogoClick}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition:
                    "transform 0.3s ease-out, width 0.3s ease, height 0.3s ease",
                }}
                aria-label="Kings Head Logo - Click to scroll to top"
              >
                <img
                  src="/kingshead_cacklebury_logo.svg"
                  alt="Kings Head Logo"
                  className="w-full h-full"
                />
              </div>
              <h1
                className={`text-[#f3df63] font-bold transition-all duration-300 ${
                  isScrolled
                    ? "text-black text-2xl"
                    : "text-3xl md:text-4xl leading-tight"
                }`}
              >
                {isScrolled ? (
                  "Kings Head Cacklebury"
                ) : (
                  <>
                    Kings Head
                    <br />
                    Cacklebury
                  </>
                )}
              </h1>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className={`md:hidden p-2 transition-colors ${
                isScrolled ? "text-black" : "text-white"
              }`}
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div
                className="absolute top-full right-0 w-64 bg-white rounded-lg shadow-xl py-4 md:hidden"
                role="menu"
                aria-orientation="vertical"
              >
                <a
                  href="#food"
                  className="block px-6 py-2 hover:bg-[#f3df63]/10"
                  role="menuitem"
                >
                  Sunday Lunch
                </a>
                <a
                  href="#harveys"
                  className="block px-6 py-2 hover:bg-[#f3df63]/10"
                  role="menuitem"
                >
                  Harvey's Ales
                </a>
                <a
                  href="#events"
                  className="block px-6 py-2 hover:bg-[#f3df63]/10"
                  role="menuitem"
                >
                  Events
                </a>
                <a
                  href="#facebook-feed"
                  className="block px-6 py-2 hover:bg-[#f3df63]/10"
                  role="menuitem"
                >
                  Facebook Feed
                </a>
                <div className="px-6 py-4 border-t border-gray-200">
                  <a
                    href="tel:01323440447"
                    className="flex items-center gap-2 hover:text-[#e6a648]"
                  >
                    <Phone className="w-4 h-4" />
                    01323 440447
                  </a>
                </div>
                <div className="px-6 py-4 border-t border-gray-200">
                  <a
                    href="mailto:lisa.kingshead@hotmail.com?subject=Enquiry&body=Hello, I'd like to know more about..."
                    className="flex items-center gap-2 hover:text-[#e6a648] break-words max-w-full"
                  >
                    <Mail className="w-4 h-4" />
                    lisa.kingshead@hotmail.com
                  </a>
                </div>
                <div className="px-6 py-4 border-t border-gray-200">
                  <a
                    href="https://www.facebook.com/KingsHeadCacklebury"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-[#e6a648] break-words max-w-full"
                  >
                    <Facebook className="w-4 h-4" />
                    <span className="leading-none break-all">
                      facebook.com/KingsHeadCacklebury
                    </span>
                  </a>
                </div>
              </div>
            )}

            {/* Desktop Menu */}
            <div
              className={`hidden md:flex space-x-6 transition-colors ${
                isScrolled ? "text-black" : "text-white"
              }`}
              role="navigation"
            >
              <a
                href="#food"
                className={`hover:text-[#ffffff] ${
                  isScrolled ? "text-black" : ""
                }`}
              >
                Sunday Lunch
              </a>
              <a
                href="#harveys"
                className={`hover:text-[#ffffff] ${
                  isScrolled ? "text-black" : ""
                }`}
              >
                Harvey's Ales
              </a>
              <a
                href="#events"
                className={`hover:text-[#ffffff] ${
                  isScrolled ? "text-black" : ""
                }`}
              >
                Events
              </a>
              <a
                href="#facebook-feed"
                className={`hover:text-[#ffffff] ${
                  isScrolled ? "text-black" : ""
                }`}
              >
                Facebook
              </a>
              <a
                href="#contact"
                className={`hover:text-[#ffffff] ${
                  isScrolled ? "text-black" : ""
                }`}
              >
                Contact
              </a>
            </div>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div
        id="hero"
        className="relative flex flex-col justify-center bg-cover bg-center h-[1900px] sm:h-[2256px] md:h-[700px] lg:h-[850px]"
        style={{
          width: "100%",
          minHeight: "760px",
          overflow: "hidden",
        }}
      >

        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
              preload="metadata" // Only preloads video metadata, not the entire file
              disablePictureInPicture // Prevents picture-in-picture mode
              disableRemotePlayback // Prevents casting to other devices
              style={videoStyle}
              autoPlay
              loop
              muted
              playsInline
              poster="/bar.jpg"
            
          >
            <source src="/bubbles.mp4" type="video/mp4" />
            {/* Fallback for browsers that don't support video */}
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="absolute inset-0 bg-black/40">
          <div className="container mx-auto px-4 py-6">
            <div className="pt-8">
              <div className="mt-12 md:mt-16 max-w-4xl mx-auto text-center">
                <h2 className="text-[#f3df63] text-3xl md:text-5xl font-bold mb-0">
                  Your Local Community Pub Since 1850
                </h2>
                <p className="text-white text-xl md:text-2xl mb-2">
                  Experience Sussex hospitality, Harvey's Ales & home-cooked
                  food in our historic Hailsham pub
                </p>
                <a
                  href="tel:01323440447"
                  className="inline-flex items-center gap-2 bg-[#f3df63] text-black px-6 py-3 rounded-lg hover:bg-[#e6a648] hover:text-white transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Get in touch with us: 01323 440447
                </a>
              </div>

              <div className="relative z-10 mt-6">
                <div id="contact" className="grid md:grid-cols-3 gap-6">
                  {/* Opening Hours */}
                  <div className="bg-white/95 rounded-lg shadow-xl backdrop-blur-sm overflow-hidden border border-white/20">
                    <div className="responsive-image-container responsive-image-container--4-3 rounded-t-lg border-b border-white/20">
                      <img
                        src="/standard_opening_hours.png"
                        alt="Opening Hours Blackboard"
                        className="responsive-image responsive-image--mobile-contain responsive-image--cover-top md:responsive-image--cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="text-[#e6a648]" />
                        <h2 className="text-black text-xl font-semibold">
                          Opening Hours
                        </h2>
                      </div>
                      <div className="text-gray-700 space-y-2">
                        <p>Mon-Wed: 4pm - 11pm</p>
                        <p>Thu-Fri: 2pm - 11pm</p>
                        <p>Sat-Sun: 12pm - 11pm</p>
                      </div>
                    </div>
                  </div>

                  {/* Location with Pub Image */}
                  <div className="bg-white/95 rounded-lg shadow-xl backdrop-blur-sm overflow-hidden border border-white/20">
                    <div className="responsive-image-container responsive-image-container--4-3 rounded-t-lg border-b border-white/20">
                      <img
                        src="/kingshead_outside.png"
                        alt="Kings Head Cacklebury Exterior"
                        className="responsive-image responsive-image--mobile-contain md:responsive-image--cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="text-[#e6a648]" />
                        <h2 className="text-black text-xl font-semibold">
                          Find Us
                        </h2>
                      </div>
                      <address className="text-gray-700 not-italic">
                        146 South Road
                        <br />
                        Hailsham, East Sussex
                        <br />
                        BN27 3NJ
                      </address>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="bg-white/95 rounded-lg shadow-xl backdrop-blur-sm overflow-hidden border border-white/20">
                    <div className="responsive-image-container responsive-image-container--4-3 rounded-t-lg border-b border-white/20">
                      <img
                        src="/landlord.png"
                        alt="Contact Us"
                        className="responsive-image responsive-image--mobile-contain md:responsive-image--cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Phone className="text-[#e6a648]" />
                        <h2 className="text-black text-xl font-semibold">
                          Contact Us
                        </h2>
                      </div>
                      <div className="text-gray-700 space-y-4">
                        <a
                          href="tel:01323440447"
                          className="flex items-center gap-2 hover:text-[#e6a648]"
                        >
                          <Phone className="w-4 h-4" />
                          01323 440447
                        </a>
                        <a
                          href="mailto:lisa.kingshead@hotmail.com?subject=Enquiry&body=Hello, I'd like to know more about..."
                          className="flex items-center gap-2 hover:text-[#e6a648] break-words max-w-full"
                        >
                          <Mail className="w-4 h-4" />
                          lisa.kingshead@hotmail.com
                        </a>
                        <div className="flex gap-4 mt-4">
                          <a
                            href="https://www.facebook.com/KingsHeadCacklebury"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-[#e6a648] break-words max-w-full"
                            aria-label="Visit our Facebook page"
                          >
                            <Facebook className="w-4 h-4" />
                            <span className="leading-none break-all">
                              facebook.com/KingsHeadCacklebury
                            </span>
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
          <h2 className="text-4xl font-bold text-center mb-8">
            Our Legendary Sunday Roasts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Swiper Slider - Food */}
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
                    <div className="rounded-lg overflow-hidden">
                      <div className="responsive-image-container responsive-image-container--4-3">
                        <img
                          src={image}
                          alt={`Sunday Roast Photo ${index + 1}`}
                          className="responsive-image responsive-image--mobile-contain responsive-image--cover-bottom md:responsive-image--cover"
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Roast Details */}
            <div className="flex flex-col justify-start">
              <h3 className="text-2xl font-semibold mb-4">
                Join Us Every Sunday
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                Our legendary Sunday roasts are the talk of Hailsham, and for
                good reason! Every plate is crafted with
                <strong> locally sourced, top-quality ingredients</strong>,
                ensuring the freshest flavors in every bite.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Choose from{" "}
                <strong>
                  succulent roast beef, tender pork, mouthwatering chicken
                </strong>
                , or our <em>delicious vegetarian option</em>, each cooked to
                perfection and served with{" "}
                <strong>
                  crispy golden roast potatoes, homemade Yorkshire puddings,
                  seasonal vegetables, and rich, velvety gravy
                </strong>
                .
              </p>
              <p className="text-lg text-gray-700 mb-6">
                What makes our roasts truly special? They're personally prepared
                by our landlord,{" "}
                <strong>Pete Loft – better known as 'Lofty'</strong>. A{" "}
                <em>highly trained chef</em> with experience in some of London's
                finest eateries, Lofty brings his passion for great food to
                every dish, making your Sunday lunch an experience to remember.
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
      <section id="harveys" className="py-8 bg-[#f3df63]/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-center mb-4">
                Proud to serve Harvey's Ales
              </h2>
              <p className="text-gray-700 text-lg mb-6">
                As a proud Harvey's pub, we serve the finest selection of Sussex
                ales, brewed in Lewes using traditional methods and local
                ingredients.
              </p>
              <p className="text-gray-700 text-lg mb-6">
                From the classic Sussex Best Bitter to seasonal specialties,
                experience the authentic taste of Sussex in every pint.
              </p>
              <p className="text-gray-700 text-lg mb-6">
                In addition to our exceptional ales, we offer a carefully
                curated selection of fine wines, premium gins, and a range of
                quality beers, including Cruzcampo, Stella Artois, and Guinness.
                Whatever your preference, you'll find something to perfectly
                complement your visit.
              </p>
            </div>
            {/* Swiper Slider - Harveys */}
            <div className="w-full overflow-hidden">
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop={true}
                className="rounded-lg shadow-xl w-full"
              >
                {harveysImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="rounded-lg overflow-hidden">
                      <div className="responsive-image-container responsive-image-container--4-3">
                        <img
                          src={image}
                          alt={`Harvey's Ale Photo ${index + 1}`}
                          className="responsive-image responsive-image--mobile-contain responsive-image--cover-bottom md:responsive-image--cover"
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-6 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-6">
            What's On at the Pub
          </h2>
          <FacebookEvents limit={3} />
        </div>
      </section>

      {/* Facebook Feed Section */}
      <section id="facebook-feed" className="py-8 bg-[#f3df63]/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Facebook className="text-[#e6a648] w-8 h-8" />
            <h2 className="text-4xl font-bold text-center">
              Latest from Our Facebook
            </h2>
          </div>

          <FacebookPosts limit={3} />

          <div className="text-center mt-8">
            <a
              href="https://www.facebook.com/KingsHeadCacklebury"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#e6a648] text-white px-6 py-3 rounded-lg hover:bg-[#f3df63] hover:text-black transition-colors"
            >
              <Facebook className="w-5 h-5" />
              Visit Our Facebook Page
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#e6a648] text-white py-12 border-t-4 border-[#f3df63]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img
                    src="/kingshead_cacklebury_logo.svg"
                    alt="Kings Head Cacklebury Logo"
                    className="w-12 h-12"
                  />
                </div>
                <h3 className="text-white text-xl font-semibold">
                  Kings Head Cacklebury
                </h3>
              </div>
              <p>Your local community pub in Hailsham since 1850</p>
            </div>
            <nav>
              <h3 className="text-white text-xl font-semibold mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#hero" className="hover:text-black">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#food" className="hover:text-black">
                    Sunday Lunch
                  </a>
                </li>
                <li>
                  <a href="#harveys" className="hover:text-black">
                    Harvey's Ales
                  </a>
                </li>
                <li>
                  <a href="#events" className="hover:text-black">
                    Events
                  </a>
                </li>
                <li>
                  <a href="#facebook-feed" className="hover:text-black">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-black">
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
            <div>
              <h3 className="text-white text-xl font-semibold mb-4">
                Contact Details
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="tel:01323440447"
                    className="flex items-center gap-2 hover:text-black"
                  >
                    <Phone className="w-4 h-4" />
                    01323 440447
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:lisa.kingshead@hotmail.com?subject=Enquiry&body=Hello, I'd like to know more about..."
                    className="flex items-center gap-2 hover:text-black"
                  >
                    <Mail className="w-4 h-4" />
                    lisa.kingshead@hotmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <address className="not-italic">
                    146 South Road, Hailsham
                  </address>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-xl font-semibold mb-4">
                Follow Us
              </h3>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/KingsHeadCacklebury"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-black break-words max-w-full"
                  aria-label="Facebook Page"
                >
                  <Facebook className="w-4 h-4" />
                  <span className="leading-none break-all">
                    facebook.com/KingsHeadCacklebury
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="mt-8 border-t border-[#f3df63] pt-4 text-center text-sm text-white">
            <p>
              © {new Date().getFullYear()} Kings Head Cacklebury. All rights
              reserved.
            </p>
            <p>
              Website created by{" "}
              <a
                href="mailto:rossnewark101@gmail.com"
                className="hover:text-black"
              >
                Ross Newark
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
