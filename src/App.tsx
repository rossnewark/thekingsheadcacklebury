import { useState, useEffect, useRef } from "react";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Menu, X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Define a type for the timer to fix the NodeJS namespace issue
type TimeoutType = ReturnType<typeof setTimeout>;

// Opening hours: [open hour (24h), close hour (24h)] for each day (0=Sun, 1=Mon, ..., 6=Sat)
const OPENING_HOURS: Record<number, [number, number]> = {
  0: [12, 22], // Sun: 12pm - 10pm
  1: [16, 23], // Mon: 4pm - 11pm
  2: [16, 23], // Tue: 4pm - 11pm
  3: [16, 23], // Wed: 4pm - 11pm
  4: [16, 23], // Thu: 4pm - 11pm
  5: [14, 23], // Fri: 2pm - 11pm
  6: [12, 23], // Sat: 12pm - 11pm
};

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function formatHour(hour: number): string {
  if (hour === 0 || hour === 24) return "12am";
  if (hour === 12) return "12pm";
  return hour > 12 ? `${hour - 12}pm` : `${hour}am`;
}

function getPubStatus(): { isOpen: boolean; message: string } {
  const now = new Date();
  // Use en-US format so Date constructor can parse it (MM/DD/YYYY)
  const ukTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/London" }));
  const day = ukTime.getDay();
  const hour = ukTime.getHours();
  const minutes = ukTime.getMinutes();
  const currentTime = hour + minutes / 60;

  const [openHour, closeHour] = OPENING_HOURS[day];

  if (currentTime >= openHour && currentTime < closeHour) {
    return { isOpen: true, message: `Open until ${formatHour(closeHour)}` };
  }

  // Closed - find next opening time
  if (currentTime < openHour) {
    // Haven't opened yet today
    return { isOpen: false, message: `Opens today at ${formatHour(openHour)}` };
  }

  // Past closing time - show tomorrow's opening
  const tomorrow = (day + 1) % 7;
  const [tomorrowOpen] = OPENING_HOURS[tomorrow];
  return { isOpen: false, message: `Opens ${DAY_NAMES[tomorrow]} at ${formatHour(tomorrowOpen)}` };
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [pubStatus, setPubStatus] = useState(getPubStatus);
  const [hoveredContact, setHoveredContact] = useState<string | null>(null);
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

  useEffect(() => {
    const interval = setInterval(() => setPubStatus(getPubStatus()), 60000);
    return () => clearInterval(interval);
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

  const gardenImages = ["/garden_view.png"];

  const dartsImages = [
    "/darts_team.png",
    "/darts_match.png",
    "/darts_board.png",
  ];

  const poolImages = ["/pool_ball.png", "/pool_table.png", "/pool_balls.png"];

  const quizImages = [
    "/quiz_flyer.jpg",
    "/quiz.jpg",
    "/quiz_friends_laughing.jpg",
    "/quiz_table_game.jpg",
  ];

  const sportImages = ["/bar.jpg", "/kings_head_cacklebury_sign.png", "/live_music.jpg"];

  const hireImages = ["/live_music_outside.jpg", "/customers_enjoying_a_roast.png", "/garden_view.png"];

  const runImages = [
    "https://register.enthuse.com/assets/3559/59364/WhatsAppImage2025-08-27at17114.13",
    "https://register.enthuse.com/assets/3559/59364/WhatsAppImage2025-08-27at17219.13",
    "https://register.enthuse.com/assets/3559/59364/WhatsAppImage2025-08-27at17611.13",
    "https://register.enthuse.com/assets/3559/59364/WhatsAppImage2025-08-27at17333.13",
  ];

  const historyImages = [
    "/kingshead_cacklebury_line_drawing.png",
    "/kingshead_outside.png",
    "/pub_vintage.png",
  ];

  function useVideoScaling() {
    const [videoStyle, setVideoStyle] = useState({});

    useEffect(() => {
      const updateVideoStyle = () => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
          setVideoStyle({
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 20%",
            transform: "translateY(-20%)",
          });
        } else {
          setVideoStyle({
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
          });
        }
      };

      updateVideoStyle();
      window.addEventListener("resize", updateVideoStyle);
      return () => window.removeEventListener("resize", updateVideoStyle);
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
                  href="#garden"
                  className="block px-6 py-2 hover:bg-[#f3df63]/10"
                  role="menuitem"
                >
                  Pub Garden
                </a>
                <a
                  href="#darts"
                  className="block px-6 py-2 hover:bg-[#f3df63]/10"
                  role="menuitem"
                >
                  Darts Team
                </a>
                <a
                  href="#pool"
                  className="block px-6 py-2 hover:bg-[#f3df63]/10"
                  role="menuitem"
                >
                  Pool Team
                </a>
                <a
                  href="#history"
                  className="block px-6 py-2 hover:bg-[#f3df63]/10"
                  role="menuitem"
                >
                  Our History
                </a>
                <a
                  href="#sport"
                  className="block px-6 py-2 hover:bg-[#f3df63]/10"
                  role="menuitem"
                >
                  Live Sport
                </a>
                <a
                  href="#quiz"
                  className="block px-6 py-2 hover:bg-[#f3df63]/10"
                  role="menuitem"
                >
                  Quiz Night
                </a>
                <a
                  href="#hire"
                  className="block px-6 py-2 hover:bg-[#f3df63]/10"
                  role="menuitem"
                >
                  Book an Event
                </a>
                <a
                  href="#community-run"
                  className="block px-6 py-2 hover:bg-[#f3df63]/10"
                  role="menuitem"
                >
                  Run 2026
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
                <div className="px-6 py-4 border-t border-gray-200">
                  <a
                    href="https://www.instagram.com/kings_head_cacklebury/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-[#e6a648] break-words max-w-full"
                  >
                    <Instagram className="w-4 h-4" />
                    <span className="leading-none break-all">
                      kings_head_cacklebury
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
              <div className="relative group">
                <span
                  className={`cursor-pointer hover:text-[#ffffff] ${
                    isScrolled ? "text-black" : ""
                  }`}
                >
                  Activities
                </span>
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg hidden group-hover:block z-50">
                  <a
                    href="#garden"
                    className="block px-4 py-2 text-black hover:bg-[#f3df63]/10"
                  >
                    Pub Garden
                  </a>
                  <a
                    href="#darts"
                    className="block px-4 py-2 text-black hover:bg-[#f3df63]/10"
                  >
                    Darts Team
                  </a>
                  <a
                    href="#pool"
                    className="block px-4 py-2 text-black hover:bg-[#f3df63]/10"
                  >
                    Pool Team
                  </a>
                  <a
                    href="#history"
                    className="block px-4 py-2 text-black hover:bg-[#f3df63]/10"
                  >
                    Our History
                  </a>
                  <a
                    href="#sport"
                    className="block px-4 py-2 text-black hover:bg-[#f3df63]/10"
                  >
                    Live Sport
                  </a>
                </div>
              </div>
              <a
                href="#quiz"
                className={`hover:text-[#ffffff] ${
                  isScrolled ? "text-black" : ""
                }`}
              >
                Quiz Night
              </a>
              <a
                href="#community-run"
                className={`hover:text-[#ffffff] ${
                  isScrolled ? "text-black" : ""
                }`}
              >
                Run 2026
              </a>
              <a
                href="#hire"
                className={`hover:text-[#ffffff] ${
                  isScrolled ? "text-black" : ""
                }`}
              >
                Book
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
        className="relative bg-cover bg-center bg-[#f3df63]"
        style={{
          width: "100%",
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

        <div className="relative z-10">
          {/* Dark overlay for hero text area only */}
          <div className="bg-black/40">
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
              </div>
            </div>
          </div>

          {/* Cards area - no dark overlay, sits on yellow background */}
          <div className="container mx-auto px-4 py-6">
                <div id="contact" className="grid md:grid-cols-3 gap-6">
                  {/* Opening Hours */}
                  <div className="bg-white/95 rounded-lg shadow-xl backdrop-blur-sm overflow-hidden border border-white/20 hover:translate-y-[-5px] transition-transform duration-300">
                    <div className="responsive-image-container responsive-image-container--4-3 rounded-t-lg border-b border-white/20">
                      <img
                        src="/standard_opening_hours.png"
                        alt="Opening Hours Blackboard"
                        className="responsive-image"
                        style={{ backgroundColor: '#191b1d' }}
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="text-[#e6a648]" />
                        <h2 className="text-black text-xl font-semibold">
                          Opening Hours
                        </h2>
                      </div>
                      <div className="text-gray-700 text-sm leading-tight space-y-0.5">
                        <p>Mon-Thurs: 4pm - 11pm</p>
                        <p>Fri: 2pm - 11pm</p>
                        <p>Sat: 12pm - 11pm</p>
                        <p>Sun: 12pm - 10pm</p>
                      </div>
                      {/* Retro pub open/closed sign */}
                      <div className={`mt-3 rounded-lg border-2 p-3 flex items-center gap-3 shadow-inner ${
                        pubStatus.isOpen
                          ? "bg-[#e6a648] border-[#c88a2e] text-white"
                          : "bg-[#3a3a3a] border-[#222] text-[#f3df63]"
                      }`}>
                        <img
                          src="/kingshead_cacklebury_logo.svg"
                          alt=""
                          className="w-10 h-10"
                          style={{ opacity: pubStatus.isOpen ? 1 : 0.5 }}
                        />
                        <div>
                          <div className="text-lg font-bold tracking-wide" style={{ fontFamily: "'Georgia', serif" }}>
                            {pubStatus.isOpen ? "We're Open!" : "Sorry, We're Closed"}
                          </div>
                          <div className="text-xs opacity-90">
                            {pubStatus.isOpen
                              ? pubStatus.message
                              : `But we open ${pubStatus.message.replace("Opens ", "").replace("Open ", "")}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location with Pub Image + Map */}
                  <div className="bg-white/95 rounded-lg shadow-xl backdrop-blur-sm overflow-hidden border border-white/20 hover:translate-y-[-5px] transition-transform duration-300">
                    <div className="responsive-image-container responsive-image-container--4-3 rounded-t-lg border-b border-white/20">
                      <img
                        src="/kingshead_outside.png"
                        alt="Kings Head Cacklebury Exterior"
                        className="responsive-image responsive-image--mobile-contain md:responsive-image--cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="text-[#e6a648]" />
                        <h2 className="text-black text-xl font-semibold">
                          Find Us
                        </h2>
                      </div>
                      <address className="text-gray-700 not-italic text-sm leading-tight">
                        Kings Head Cacklebury,
                        146 South Road, Hailsham,
                        East Sussex, BN27 3NJ.
                      </address>
                      {/* Mini map */}
                      <a
                        href="https://maps.app.goo.gl/VNFm6WBPrCrzyuaS9"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block relative mt-2 rounded-lg overflow-hidden border border-gray-200"
                        style={{ height: "100px" }}
                      >
                        <iframe
                          title="Kings Head Cacklebury Location"
                          src="https://maps.google.com/maps?q=Kings+Head+Cacklebury+146+South+Road+Hailsham+BN27+3NJ&t=&z=15&ie=UTF8&iwloc=&output=embed"
                          className="w-full h-full border-0 pointer-events-none"
                          loading="lazy"
                        />
                        <div className="absolute bottom-1 left-1 z-10 bg-[#e6a648] text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          Pop in for a pint!
                        </div>
                      </a>
                      <a
                        href="https://maps.app.goo.gl/VNFm6WBPrCrzyuaS9"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-1 text-sm font-medium text-[#e6a648] hover:text-black transition-colors"
                      >
                        <MapPin className="w-4 h-4" />
                        Get Directions
                      </a>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="bg-white/95 rounded-lg shadow-xl backdrop-blur-sm overflow-hidden border border-white/20 hover:translate-y-[-5px] transition-transform duration-300">
                    <div className="responsive-image-container responsive-image-container--4-3 rounded-t-lg border-b border-white/20">
                      {[
                        { key: null, src: "/landlord.png", alt: "Pete Loft - Landlord", pos: "center 20%" },
                        { key: "phone", src: "/landlord_phone.png", alt: "Give us a call", pos: "center 15%" },
                        { key: "email", src: "/landlord_email.png", alt: "Send us an email", pos: "center 20%" },
                        { key: "facebook", src: "/landlord_facebook.png", alt: "Find us on Facebook", pos: "center 10%" },
                        { key: "instagram", src: "/landlord_instagram.png", alt: "Follow us on Instagram", pos: "center 15%" },
                      ].map((img) => (
                        <img
                          key={img.src}
                          src={img.src}
                          alt={img.alt}
                          className="responsive-image"
                          style={{
                            objectFit: "cover",
                            objectPosition: img.pos,
                            opacity: img.key === null
                              ? (hoveredContact === null ? 1 : 0)
                              : (hoveredContact === img.key ? 1 : 0),
                            transition: "opacity 0.4s ease",
                          }}
                        />
                      ))}
                    </div>
                    <div className="p-4 relative overflow-hidden">
                      <div className="flex items-center gap-2 mb-3">
                        <Phone className="text-[#e6a648]" />
                        <h2 className="text-black text-xl font-semibold">
                          Contact Us
                        </h2>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-gray-700 space-y-2 text-sm flex-1 min-w-0">
                          <a
                            href="tel:01323440447"
                            className={`flex items-center gap-2 transition-colors ${hoveredContact === 'phone' ? 'text-[#e6a648]' : 'hover:text-[#e6a648]'}`}
                            onMouseEnter={() => setHoveredContact('phone')}
                            onMouseLeave={() => setHoveredContact(null)}
                          >
                            <Phone className="w-4 h-4 flex-shrink-0" />
                            01323 440447
                          </a>
                          <a
                            href="mailto:lisa.kingshead@hotmail.com?subject=Enquiry&body=Hello, I'd like to know more about..."
                            className={`flex items-center gap-2 transition-colors ${hoveredContact === 'email' ? 'text-[#e6a648]' : 'hover:text-[#e6a648]'}`}
                            onMouseEnter={() => setHoveredContact('email')}
                            onMouseLeave={() => setHoveredContact(null)}
                          >
                            <Mail className="w-4 h-4 flex-shrink-0" />
                            lisa.kingshead@hotmail.com
                          </a>
                          <a
                            href="https://www.facebook.com/KingsHeadCacklebury"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 transition-colors ${hoveredContact === 'facebook' ? 'text-[#e6a648]' : 'hover:text-[#e6a648]'}`}
                            aria-label="Visit our Facebook page"
                            onMouseEnter={() => setHoveredContact('facebook')}
                            onMouseLeave={() => setHoveredContact(null)}
                          >
                            <Facebook className="w-4 h-4 flex-shrink-0" />
                            KingsHeadCacklebury
                          </a>
                          <a
                            href="https://www.instagram.com/kings_head_cacklebury/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 transition-colors ${hoveredContact === 'instagram' ? 'text-[#e6a648]' : 'hover:text-[#e6a648]'}`}
                            aria-label="Visit our Instagram page"
                            onMouseEnter={() => setHoveredContact('instagram')}
                            onMouseLeave={() => setHoveredContact(null)}
                          >
                            <Instagram className="w-4 h-4 flex-shrink-0" />
                            kings_head_cacklebury
                          </a>
                        </div>
                        {/* Icon badges - 2x2 grid beside links on mobile & large, hidden at md where cards are narrow */}
                        <div className="grid grid-cols-2 gap-2 flex-shrink-0 md:hidden lg:grid">
                          <a href="tel:01323440447" className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-colors ${hoveredContact === 'phone' ? 'bg-[#f3df63]' : 'bg-[#e6a648] hover:bg-[#f3df63]'}`} onMouseEnter={() => setHoveredContact('phone')} onMouseLeave={() => setHoveredContact(null)}>
                            <Phone className="w-6 h-6 text-white" />
                          </a>
                          <a href="mailto:lisa.kingshead@hotmail.com?subject=Enquiry&body=Hello, I'd like to know more about..." className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-colors ${hoveredContact === 'email' ? 'bg-[#f3df63]' : 'bg-[#e6a648] hover:bg-[#f3df63]'}`} onMouseEnter={() => setHoveredContact('email')} onMouseLeave={() => setHoveredContact(null)}>
                            <Mail className="w-6 h-6 text-white" />
                          </a>
                          <a href="https://www.facebook.com/KingsHeadCacklebury" target="_blank" rel="noopener noreferrer" className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-colors ${hoveredContact === 'facebook' ? 'bg-[#f3df63]' : 'bg-[#e6a648] hover:bg-[#f3df63]'}`} onMouseEnter={() => setHoveredContact('facebook')} onMouseLeave={() => setHoveredContact(null)}>
                            <Facebook className="w-6 h-6 text-white" />
                          </a>
                          <a href="https://www.instagram.com/kings_head_cacklebury/" target="_blank" rel="noopener noreferrer" className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-colors ${hoveredContact === 'instagram' ? 'bg-[#f3df63]' : 'bg-[#e6a648] hover:bg-[#f3df63]'}`} onMouseEnter={() => setHoveredContact('instagram')} onMouseLeave={() => setHoveredContact(null)}>
                            <Instagram className="w-6 h-6 text-white" />
                          </a>
                        </div>
                      </div>
                      {/* Icon badges - horizontal row below links, only visible at md */}
                      <div className="hidden md:flex lg:hidden justify-center gap-3 mt-3">
                        <a href="tel:01323440447" className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors ${hoveredContact === 'phone' ? 'bg-[#f3df63]' : 'bg-[#e6a648] hover:bg-[#f3df63]'}`} onMouseEnter={() => setHoveredContact('phone')} onMouseLeave={() => setHoveredContact(null)}>
                          <Phone className="w-5 h-5 text-white" />
                        </a>
                        <a href="mailto:lisa.kingshead@hotmail.com?subject=Enquiry&body=Hello, I'd like to know more about..." className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors ${hoveredContact === 'email' ? 'bg-[#f3df63]' : 'bg-[#e6a648] hover:bg-[#f3df63]'}`} onMouseEnter={() => setHoveredContact('email')} onMouseLeave={() => setHoveredContact(null)}>
                          <Mail className="w-5 h-5 text-white" />
                        </a>
                        <a href="https://www.facebook.com/KingsHeadCacklebury" target="_blank" rel="noopener noreferrer" className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors ${hoveredContact === 'facebook' ? 'bg-[#f3df63]' : 'bg-[#e6a648] hover:bg-[#f3df63]'}`} onMouseEnter={() => setHoveredContact('facebook')} onMouseLeave={() => setHoveredContact(null)}>
                          <Facebook className="w-5 h-5 text-white" />
                        </a>
                        <a href="https://www.instagram.com/kings_head_cacklebury/" target="_blank" rel="noopener noreferrer" className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors ${hoveredContact === 'instagram' ? 'bg-[#f3df63]' : 'bg-[#e6a648] hover:bg-[#f3df63]'}`} onMouseEnter={() => setHoveredContact('instagram')} onMouseLeave={() => setHoveredContact(null)}>
                          <Instagram className="w-5 h-5 text-white" />
                        </a>
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
                Our Legendary Sunday Roasts
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
                <strong>Call us to find out when roasts are available and to book your table!</strong>
              </p>

              {/* Sunday Roast Times Section */}
              <div className="bg-[#f3df63]/10 p-6 rounded-lg py-8">
                <p className="text-xl font-semibold mb-2">Sunday Roast</p>
                <p className="text-gray-700 mb-4">Served 12pm - 4pm on Sundays — call ahead to check availability.</p>
                <a
                  href="tel:01323440447"
                  className="inline-flex items-center gap-2 bg-[#e6a648] text-white px-6 py-3 rounded-lg hover:bg-[#f3df63] hover:text-black transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Call to Check Availability: 01323 440447
                </a>
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
                quality beers, including Cruzcampo and Guinness.
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

      {/* Pub Garden Section */}
      <section id="garden" className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Swiper Slider - Garden */}
            <div className="w-full overflow-hidden">
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop={true}
                className="rounded-lg shadow-xl w-full"
              >
                {gardenImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="rounded-lg overflow-hidden">
                      <div className="responsive-image-container responsive-image-container--4-3">
                        <img
                          src={image}
                          alt={`Beer Garden Photo ${index + 1}`}
                          className="responsive-image responsive-image--mobile-contain responsive-image--cover-bottom md:responsive-image--cover"
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Garden Description */}
            <div>
              <h2 className="text-4xl font-bold text-center mb-4">
                Our Beautiful Beer Garden
              </h2>
              <p className="text-gray-700 text-lg mb-6">
                Escape to our spacious beer garden, one of Hailsham's best-kept
                secrets! This large, enclosed outdoor space offers a perfect
                retreat for sunny days and warm evenings.
              </p>
              <p className="text-gray-700 text-lg mb-6">
                Our garden features a dedicated{" "}
                <strong>stage for live bands</strong>. We host live music events
                both in the garden and inside the pub — check our{" "}
                <a href="https://www.facebook.com/KingsHeadCacklebury" target="_blank" rel="noopener noreferrer" className="text-[#e6a648] hover:underline">Facebook page</a>{" "}
                for the latest updates on upcoming bands and gigs.
              </p>
              <p className="text-gray-700 text-lg mb-6">
                We have a <strong>smoking area outside</strong> for those who
                need it. With plenty of picnic benches scattered throughout the
                garden, there's always a spot to relax with friends.
              </p>
              <p className="text-gray-700 text-lg">
                The secluded and fully enclosed nature of our garden makes it a{" "}
                <strong>safe space for families</strong> and a peaceful retreat
                from the bustle of town. It's also a favorite spot for our
                four-legged friends!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Darts Team Section */}
      <section id="darts" className="py-8 bg-[#f3df63]/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Darts Team Description */}
            <div>
              <h2 className="text-4xl font-bold text-center mb-4">
                Our Champion Darts Team
              </h2>
              <p className="text-gray-700 text-lg mb-6">
                We're lucky to have not one but two fantastic dart teams
                representing us!
              </p>
              <p className="text-gray-700 text-lg mb-6">
                <strong>King's Head South Road team</strong> or{" "}
                <strong>KHSR</strong> for short! They're ready to take on the
                competition, and we can't wait to cheer them on. Stay tuned for
                more updates and match results!
              </p>
              <p className="text-gray-700 text-lg mb-6">
                Our darts teams compete in local leagues and are always looking
                for new members. Whether you're a seasoned player or just
                starting out, you're welcome to join our practice sessions.
              </p>
              <p className="text-gray-700 text-lg">
                Come down on <strong>Monday evenings</strong> to watch our
                teams in action or speak to any team member about getting
                involved!
              </p>
            </div>

            {/* Swiper Slider - Darts */}
            <div className="w-full overflow-hidden">
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop={true}
                className="rounded-lg shadow-xl w-full"
              >
                {dartsImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="rounded-lg overflow-hidden">
                      <div className="responsive-image-container responsive-image-container--4-3">
                        <img
                          src={image}
                          alt={`Darts Team Photo ${index + 1}`}
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

      {/* Pool Team Section */}
      <section id="pool" className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Swiper Slider - Pool */}
            <div className="w-full overflow-hidden">
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop={true}
                className="rounded-lg shadow-xl w-full"
              >
                {poolImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="rounded-lg overflow-hidden">
                      <div className="responsive-image-container responsive-image-container--4-3">
                        <img
                          src={image}
                          alt={`Pool Team Photo ${index + 1}`}
                          className="responsive-image responsive-image--mobile-contain responsive-image--cover-bottom md:responsive-image--cover"
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Pool Team Description */}
            <div>
              <h2 className="text-4xl font-bold text-center mb-4">
                Meet Our Pool Sharks
              </h2>
              <p className="text-gray-700 text-lg mb-6">
                The King's Head Pool Team brings together a talented group of
                local players who share a passion for the game and a competitive
                spirit. Known for their precision shots and strategic gameplay,
                our team has become a formidable presence in the Hailsham
                league.
              </p>
              <p className="text-gray-700 text-lg mb-6">
                From seasoned veterans to promising newcomers, our team welcomes
                players of all skill levels. We're proud of the camaraderie
                that's developed around the pool table, making match nights both
                competitive and fun.
              </p>
              <p className="text-gray-700 text-lg mb-6">
                The team practices regularly at the pub, and you'll often find
                members sharing tips and techniques with anyone interested in
                improving their game.
              </p>
              <p className="text-gray-700 text-lg">
                Pool league match nights are <strong>Thursday evenings</strong> – come along
                to support the team or inquire about joining. Our pool table is
                available to all patrons throughout the week when not in use for
                team practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our History Section */}
      <section id="history" className="py-8 bg-[#f3df63]/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* History Description */}
            <div>
              <h2 className="text-4xl font-bold text-center mb-4">
                Our Rich History
              </h2>
              <p className="text-gray-700 text-lg mb-6">
                The King's Head Cacklebury in Hailsham, East Sussex is a
                traditional Harvey's Community Grade 2 Listed Pub with roots
                dating back to 1850. Throughout the years, we've maintained our
                commitment to offering great ales, warm hospitality, and a place
                for the community to gather.
              </p>
              <p className="text-gray-700 text-lg mb-6">
                Our pub features a cozy log fire for winter months and a large
                enclosed garden for sunny days. We pride ourselves on being a
                true community hub where friends old and new can meet and enjoy
                quality time together.
              </p>
              <p className="text-gray-700 text-lg mb-6">
                As a dog-friendly establishment, your four-legged companions are
                always welcome, and well-behaved pups might even receive a treat
                from our staff. Families with children are welcome until 9pm.
              </p>
              <p className="text-gray-700 text-lg mb-6">
                Beyond just drinks, we offer a variety of pub games including
                pool, darts, shove ha'penny, toad-in-the-hole, dominoes,
                cribbage, and board games to borrow. Our Sunday Quiz Night kicks
                off at <strong>7pm</strong> – free entry, just for fun!
              </p>
              <div className="bg-white p-4 rounded-lg mt-4">
                <h3 className="font-semibold text-xl mb-2">Facilities</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Beautiful Beer Garden</li>
                  <li>Cask Marque Accredited</li>
                  <li>Ample Off Road Parking</li>
                  <li>Disabled Access</li>
                  <li>Family & Dog Friendly</li>
                  <li>Open Fireplace</li>
                  <li>Tradional Pub Games</li>
                  <li>Live Music</li>
                </ul>
              </div>
            </div>

            {/* Swiper Slider - History */}
            <div className="w-full overflow-hidden">
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop={true}
                className="rounded-lg shadow-xl w-full"
              >
                {historyImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="rounded-lg overflow-hidden">
                      <div className="responsive-image-container responsive-image-container--4-3">
                        <img
                          src={image}
                          alt={`Pub History Photo ${index + 1}`}
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

      {/* Quiz Night Section */}
      <section id="quiz" className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Swiper Slider - Quiz */}
            <div className="w-full overflow-hidden">
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop={true}
                className="rounded-lg shadow-xl w-full"
              >
                {quizImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="rounded-lg overflow-hidden">
                      <div className="responsive-image-container responsive-image-container--4-3">
                        <img
                          src={image}
                          alt={`Quiz Night Photo ${index + 1}`}
                          className="responsive-image responsive-image--mobile-contain responsive-image--cover-bottom md:responsive-image--cover"
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Quiz Description */}
            <div>
              <h2 className="text-4xl font-bold text-center mb-4">
                Sunday Quiz Night
              </h2>
              <p className="text-gray-700 text-lg mb-4">
                Our Sunday Quiz Night is one of the best nights of the week at
                the King's Head Cacklebury — and one of the most popular events
                in Hailsham! Put your knowledge to the test, challenge your
                friends, and see if your team can take the top spot.
              </p>
              <p className="text-gray-700 text-lg mb-4">
                Whether you're a seasoned quiz master or just in it for the
                laughs, everyone is welcome. The atmosphere is always brilliant
                — expect plenty of banter, head-scratching, and the occasional
                argument over an answer!
              </p>
              <p className="text-gray-700 text-lg mb-6">
                We occasionally run <strong>charity quiz nights</strong> raising
                money for good causes — keep an eye on our Facebook page for
                upcoming themed and charity events.
              </p>

              <div className="bg-[#f3df63]/20 border-2 border-[#e6a648] rounded-lg p-6 mb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="font-bold text-lg">When</p>
                    <p className="text-gray-700">Sunday evenings from 7pm</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">Teams</p>
                    <p className="text-gray-700">Up to 4 people</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">Entry</p>
                    <p className="text-gray-700">Free — just for fun!</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">Availability</p>
                    <p className="text-gray-700">Call ahead to confirm</p>
                  </div>
                </div>
                <a
                  href="tel:01323440447"
                  className="inline-flex items-center gap-2 bg-[#e6a648] text-white px-5 py-2.5 rounded-lg hover:bg-[#f3df63] hover:text-black transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  Check availability: 01323 440447
                </a>
              </div>

              <a
                href="https://www.facebook.com/KingsHeadCacklebury"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#e6a648] hover:text-black transition-colors font-medium"
              >
                <Facebook className="w-5 h-5" />
                Follow us on Facebook for quiz night updates
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Live Sport Section */}
      <section id="sport" className="py-8 bg-[#f3df63]/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-center mb-4">
                Live Sport on the Big Screen
              </h2>
              <p className="text-gray-700 text-lg mb-6">
                We show select sporting occasions on our{" "}
                <strong>big screen above the fireplace</strong> — the perfect spot
                to settle in with a pint and enjoy the atmosphere with good company.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-3xl mb-2">🏉</div>
                  <p className="font-semibold text-sm">Six Nations Rugby</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-3xl mb-2">⚽</div>
                  <p className="font-semibold text-sm">World Cup Football</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <div className="text-3xl mb-2">🏇</div>
                  <p className="font-semibold text-sm">Grand National</p>
                </div>
              </div>
              <p className="text-gray-700 text-lg mb-4">
                On warmer days, take the party outside — our{" "}
                <strong>outside bar</strong> keeps the garden well stocked for
                sunny matchdays.
              </p>
              <a
                href="https://www.facebook.com/KingsHeadCacklebury"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#e6a648] hover:text-black transition-colors font-medium"
              >
                <Facebook className="w-5 h-5" />
                Follow us on Facebook for what's showing
              </a>
            </div>
            <div className="w-full overflow-hidden">
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop={true}
                className="rounded-lg shadow-xl w-full"
              >
                {sportImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="rounded-lg overflow-hidden">
                      <div className="responsive-image-container responsive-image-container--4-3">
                        <img
                          src={image}
                          alt={`Kings Head Cacklebury Photo ${index + 1}`}
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

      {/* Private Hire Section */}
      <section id="hire" className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="w-full overflow-hidden">
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop={true}
                className="rounded-lg shadow-xl w-full"
              >
                {hireImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="rounded-lg overflow-hidden">
                      <div className="responsive-image-container responsive-image-container--4-3">
                        <img
                          src={image}
                          alt={`Private hire at Kings Head Cacklebury ${index + 1}`}
                          className="responsive-image responsive-image--mobile-contain responsive-image--cover-bottom md:responsive-image--cover"
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-center mb-4">
                Book the Pub for Your Event
              </h2>
              <p className="text-gray-700 text-lg mb-4">
                Looking for the perfect venue for a special occasion? The King's Head
                Cacklebury is available for <strong>private hire</strong> and we'd love
                to help make your event one to remember.
              </p>
              <p className="text-gray-700 text-lg mb-6">
                We've hosted birthday parties, baby showers, wakes, celebrations, and
                more. With our spacious beer garden, outside bar, and cosy pub interior,
                we can cater for a wide range of events whatever the occasion or weather.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {["Birthday Parties", "Baby Showers", "Celebrations", "Wakes & Memorials", "Team Events", "Private Gatherings"].map((event) => (
                  <div key={event} className="flex items-center gap-2 text-gray-700">
                    <span className="text-[#e6a648] font-bold">✓</span>
                    {event}
                  </div>
                ))}
              </div>
              <div className="bg-[#f3df63]/20 border-2 border-[#e6a648] rounded-lg p-6">
                <p className="font-semibold text-lg mb-3">Get in touch with Lisa to discuss your event:</p>
                <div className="flex flex-col gap-3">
                  <a
                    href="tel:01323440447"
                    className="inline-flex items-center gap-2 bg-[#e6a648] text-white px-5 py-2.5 rounded-lg hover:bg-[#f3df63] hover:text-black transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call Lisa: 01323 440447
                  </a>
                  <a
                    href="mailto:lisa.kingshead@hotmail.com?subject=Private Hire Enquiry&body=Hello Lisa, I'd like to enquire about booking the pub for..."
                    className="inline-flex items-center gap-2 bg-[#e6a648] text-white px-5 py-2.5 rounded-lg hover:bg-[#f3df63] hover:text-black transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Email Lisa
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hailsham Community Run Section */}
      <section id="community-run" className="py-8 bg-[#f3df63]/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Description */}
            <div>
              <h2 className="text-4xl font-bold text-center mb-4">
                Hailsham Community Run 2026
              </h2>
              <p className="text-gray-700 text-lg mb-4">
                The King's Head Cacklebury is proud to be a{" "}
                <strong>sponsor of the Hailsham Community Run 2026</strong> — one of the town's
                favourite community events, bringing together runners of all ages and abilities.
              </p>
              <p className="text-gray-700 text-lg mb-4">
                Taking place on <strong>Sunday 12th July 2026</strong>, the event features races
                for everyone — from a 1 Mile inclusive race and 3k for youngsters, to 5k and
                10k challenges for more seasoned runners. The event sold out for the last two
                years, so get your entry in quick!
              </p>
              <p className="text-gray-700 text-lg mb-6">
                Whether you're running or cheering on the sidelines, come celebrate with us
                afterwards at the pub.
              </p>

              {/* Medal offer callout */}
              <div className="bg-[#f3df63]/20 border-2 border-[#e6a648] rounded-lg p-6 mb-6">
                <p className="text-2xl font-bold mb-2">Bring your medal — free drink on us! 🏅🍻</p>
                <p className="text-gray-700 mb-3">
                  Completed the Hailsham Community Run? Come straight to the King's Head
                  Cacklebury, show us your medal, and enjoy a <strong>free drink on us</strong>.
                  You've earned it!
                </p>
                <p className="text-sm text-gray-600">
                  <strong>T&Cs:</strong> Choice of a pint of beer, medium glass of wine, single
                  spirit and mixer, or pint of any draft soft drink. One drink per person.
                </p>
              </div>

              <a
                href="https://register.enthuse.com/ps/event/HailshamCommunityRun2026/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#e6a648] text-white px-6 py-3 rounded-lg hover:bg-[#f3df63] hover:text-black transition-colors"
              >
                Register for the Run
              </a>
            </div>

            {/* Swiper Slider - Run images */}
            <div className="w-full overflow-hidden">
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop={true}
                className="rounded-lg shadow-xl w-full"
              >
                {runImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="rounded-lg overflow-hidden">
                      <div className="responsive-image-container responsive-image-container--4-3">
                        <img
                          src={image}
                          alt={`Hailsham Community Run Photo ${index + 1}`}
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

      {/* Google Reviews Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-xl mx-auto">
            <div className="text-4xl mb-3">⭐⭐⭐⭐⭐</div>
            <h2 className="text-3xl font-bold mb-3">Enjoyed your visit?</h2>
            <p className="text-gray-700 text-lg mb-6">
              A Google review means the world to us — and helps other locals in Hailsham
              discover their new favourite pub.
            </p>
            <a
              href="https://search.google.com/local/writereview?placeid=ChIJw9WiHz1u30fOLl5ZFAiv5Q"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white border-2 border-[#e6a648] text-black px-8 py-4 rounded-lg hover:bg-[#e6a648] hover:text-white transition-colors text-lg font-semibold shadow-md"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Leave us a Google Review
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
                  <a href="#garden" className="hover:text-black">
                    Pub Garden
                  </a>
                </li>
                <li>
                  <a href="#darts" className="hover:text-black">
                    Darts Team
                  </a>
                </li>
                <li>
                  <a href="#pool" className="hover:text-black">
                    Pool Team
                  </a>
                </li>
                <li>
                  <a href="#history" className="hover:text-black">
                    Our History
                  </a>
                </li>
                <li>
                  <a href="#quiz" className="hover:text-black">
                    Quiz Night
                  </a>
                </li>
                <li>
                  <a href="#sport" className="hover:text-black">
                    Live Sport
                  </a>
                </li>
                <li>
                  <a href="#hire" className="hover:text-black">
                    Book an Event
                  </a>
                </li>
                <li>
                  <a href="#community-run" className="hover:text-black">
                    Run 2026
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
                    146 South Road, Hailsham, East Sussex, BN27 3NJ.
                  </address>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-xl font-semibold mb-4">
                Follow Us
              </h3>
              <div className="flex flex-col gap-2">
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
                <a
                  href="https://www.instagram.com/kings_head_cacklebury/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-black break-words max-w-full"
                  aria-label="Instagram Page"
                >
                  <Instagram className="w-4 h-4" />
                  <span className="leading-none break-all">
                    kings_head_cacklebury
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
