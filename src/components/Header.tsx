import React, { useState } from 'react';
import { Menu, X, Building2, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBranchesOpen, setIsBranchesOpen] = useState(false);
  const [isGratisToolsOpen, setIsGratisToolsOpen] = useState(false);
  const [isOverOnsOpen, setIsOverOnsOpen] = useState(false);
  const [branchesTimer, setBranchesTimer] = useState<NodeJS.Timeout | null>(null);
  const [gratisToolsTimer, setGratisToolsTimer] = useState<NodeJS.Timeout | null>(null);
  const [overOnsTimer, setOverOnsTimer] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const handleMouseEnterBranches = () => {
    if (branchesTimer) {
      clearTimeout(branchesTimer);
      setBranchesTimer(null);
    }
    setIsBranchesOpen(true);
  };

  const handleMouseLeaveBranches = () => {
    const timer = setTimeout(() => {
      setIsBranchesOpen(false);
    }, 250);
    setBranchesTimer(timer);
  };

  const handleMouseEnterGratisTools = () => {
    if (gratisToolsTimer) {
      clearTimeout(gratisToolsTimer);
      setGratisToolsTimer(null);
    }
    setIsGratisToolsOpen(true);
  };

  const handleMouseLeaveGratisTools = () => {
    const timer = setTimeout(() => {
      setIsGratisToolsOpen(false);
    }, 250);
    setGratisToolsTimer(timer);
  };

  const handleMouseEnterOverOns = () => {
    if (overOnsTimer) {
      clearTimeout(overOnsTimer);
      setOverOnsTimer(null);
    }
    setIsOverOnsOpen(true);
  };

  const handleMouseLeaveOverOns = () => {
    const timer = setTimeout(() => {
      setIsOverOnsOpen(false);
    }, 250);
    setOverOnsTimer(timer);
  };

  const handleLogoClick = () => {
    navigate('/');
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  const handlePlanKennismakingClick = () => {
    // Check if we're on the homepage
    if (window.location.pathname === '/') {
      document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Navigate to homepage and then scroll to contact form
      navigate('/', { replace: true });
      setTimeout(() => {
        document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleNavClick = (sectionId: string) => {
    // Close mobile menu when clicking on a nav item
    setIsMenuOpen(false);
    
    // Check if we're on the homepage
    if (window.location.pathname === '/') {
      if (sectionId === 'contact') {
        document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to homepage and then scroll to section
      navigate('/', { replace: true });
      setTimeout(() => {
        if (sectionId === 'contact') {
          document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
        } else {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleMobilePlanKennismakingClick = () => {
    // Close mobile menu first
    setIsMenuOpen(false);
    
    // Then handle the navigation
    if (window.location.pathname === '/') {
      document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { replace: true });
      setTimeout(() => {
        document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleBranchClick = () => {
    setIsMenuOpen(false);
  };

  const handleGratisToolsClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo - Now clickable to go to homepage top */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <img 
              src="/Slim Geregeld Administratie - Volledig logo transparant 1200x628.png" 
              alt="Slim Geregeld Administratie" 
              className="h-12 w-auto"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Branches Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnterBranches}
              onMouseLeave={handleMouseLeaveBranches}
            >
              <Link
                to="/branches"
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                <span>Branches</span>
                <ChevronDown className="h-4 w-4" />
              </Link>

              {isBranchesOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                >
                  <Link
                    to="/bouw"
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
                  >
                    Bouw & installatie
                  </Link>
                  <Link
                    to="/creatief"
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
                  >
                    Creatieve beroepen
                  </Link>
                  <Link
                    to="/persoonlijk"
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
                  >
                    Persoonlijke dienstverlening
                  </Link>
                  <Link
                    to="/tech"
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
                  >
                    Techniek & ICT
                  </Link>
                  <Link
                    to="/ecommerce"
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
                  >
                    E-commerce & detailhandel
                  </Link>
                </div>
              )}
            </div>

            <button onClick={() => handleNavClick('pakketten')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Pakketten</button>
            <button onClick={() => handleNavClick('reviews')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Reviews</button>
            <button onClick={() => handleNavClick('contact')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Contact</button>

            {/* Over Ons Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnterOverOns}
              onMouseLeave={handleMouseLeaveOverOns}
            >
              <Link
                to="/over-ons"
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                <span>Over Ons</span>
                <ChevronDown className="h-4 w-4" />
              </Link>

              {isOverOnsOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                >
                  <Link
                    to="/over-ons#over-kyle"
                    onClick={() => setIsOverOnsOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
                  >
                    Over Kyle
                  </Link>
                  <Link
                    to="/nieuws"
                    onClick={() => setIsOverOnsOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
                  >
                    Nieuws
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setIsOverOnsOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
                  >
                    Contact
                  </Link>
                </div>
              )}
            </div>

            {/* Gratis Tools Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnterGratisTools}
              onMouseLeave={handleMouseLeaveGratisTools}
            >
              <Link
                to="/gratis-tools"
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                <span>Gratis tools</span>
                <ChevronDown className="h-4 w-4" />
              </Link>

              {isGratisToolsOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                >
                  <Link
                    to="/slim-chatbot"
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
                  >
                    Slim Chatbot
                  </Link>
                  <Link
                    to="/nettocheck"
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
                  >
                    NettoCheck
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Contact Button - Always visible when menu is closed */}
          <div className="hidden md:block">
            <button 
              onClick={handlePlanKennismakingClick}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Plan een gratis kennismaking
            </button>
          </div>

          {/* Mobile: Contact Button (visible when menu is closed) + Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {!isMenuOpen && (
              <button 
                onClick={handlePlanKennismakingClick}
                className="bg-blue-600 text-white px-3 py-2 rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold text-sm shadow-lg"
              >
                Kennismaken
              </button>
            )}
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              {/* Mobile Branches */}
              <div>
                <Link
                  to="/branches"
                  className="flex items-center justify-between w-full text-gray-600 hover:text-blue-600 transition-colors font-medium py-2"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsBranchesOpen(!isBranchesOpen);
                  }}
                >
                  <span>Branches</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isBranchesOpen ? 'rotate-180' : ''}`} />
                </Link>
                {isBranchesOpen && (
                  <div className="pl-4 space-y-2 mt-2">
                    <Link
                      to="/bouw"
                      onClick={handleBranchClick}
                      className="block text-gray-500 hover:text-blue-600 transition-colors py-1 font-medium"
                    >
                      Bouw & installatie
                    </Link>
                    <Link
                      to="/creatief"
                      onClick={handleBranchClick}
                      className="block text-gray-500 hover:text-blue-600 transition-colors py-1 font-medium"
                    >
                      Creatieve beroepen
                    </Link>
                    <Link
                      to="/persoonlijk"
                      onClick={handleBranchClick}
                      className="block text-gray-500 hover:text-blue-600 transition-colors py-1 font-medium"
                    >
                      Persoonlijke dienstverlening
                    </Link>
                    <Link
                      to="/tech"
                      onClick={handleBranchClick}
                      className="block text-gray-500 hover:text-blue-600 transition-colors py-1 font-medium"
                    >
                      Techniek & ICT
                    </Link>
                    <Link
                      to="/ecommerce"
                      onClick={handleBranchClick}
                      className="block text-gray-500 hover:text-blue-600 transition-colors py-1 font-medium"
                    >
                      E-commerce & detailhandel
                    </Link>
                  </div>
                )}
              </div>
              
              <button onClick={() => handleNavClick('pakketten')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-left">Pakketten</button>
              <button onClick={() => handleNavClick('reviews')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-left">Reviews</button>
              <button onClick={() => handleNavClick('contact')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-left">Contact</button>

              {/* Mobile Over Ons */}
              <div>
                <Link
                  to="/over-ons"
                  className="flex items-center justify-between w-full text-gray-600 hover:text-blue-600 transition-colors font-medium py-2"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsOverOnsOpen(!isOverOnsOpen);
                  }}
                >
                  <span>Over Ons</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isOverOnsOpen ? 'rotate-180' : ''}`} />
                </Link>
                {isOverOnsOpen && (
                  <div className="pl-4 space-y-2 mt-2">
                    <Link
                      to="/over-ons#over-kyle"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsOverOnsOpen(false);
                      }}
                      className="block text-gray-500 hover:text-blue-600 transition-colors py-1 font-medium"
                    >
                      Over Kyle
                    </Link>
                    <Link
                      to="/nieuws"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsOverOnsOpen(false);
                      }}
                      className="block text-gray-500 hover:text-blue-600 transition-colors py-1 font-medium"
                    >
                      Nieuws
                    </Link>
                    <Link
                      to="/contact"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsOverOnsOpen(false);
                      }}
                      className="block text-gray-500 hover:text-blue-600 transition-colors py-1 font-medium"
                    >
                      Contact
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Gratis Tools */}
              <div>
                <Link
                  to="/gratis-tools"
                  className="flex items-center justify-between w-full text-gray-600 hover:text-blue-600 transition-colors font-medium py-2"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsGratisToolsOpen(!isGratisToolsOpen);
                  }}
                >
                  <span>Gratis tools</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isGratisToolsOpen ? 'rotate-180' : ''}`} />
                </Link>
                {isGratisToolsOpen && (
                  <div className="pl-4 space-y-2 mt-2">
                    <Link
                      to="/slim-chatbot"
                      onClick={handleGratisToolsClick}
                      className="block text-gray-500 hover:text-blue-600 transition-colors py-1 font-medium"
                    >
                      Slim Chatbot
                    </Link>
                    <Link
                      to="/nettocheck"
                      onClick={handleGratisToolsClick}
                      className="block text-gray-500 hover:text-blue-600 transition-colors py-1 font-medium"
                    >
                      NettoCheck
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Mobile Contact Button - Only visible in open menu */}
              <button 
                onClick={handleMobilePlanKennismakingClick}
                className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold text-center shadow-lg mt-4"
              >
                Plan een gratis kennismaking
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;