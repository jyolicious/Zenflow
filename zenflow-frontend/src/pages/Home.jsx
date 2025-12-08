import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="min-h-screen">
      {/* Hero Section - Full Screen Impact */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600&q=80" 
            alt="Yoga practice" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/70 to-purple-900/50"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-6 max-w-5xl">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in">
            Your Journey to Inner Peace
          </h1>
          <p className="text-2xl md:text-3xl mb-12 font-light tracking-wide">
            Begin where you are. Breathe. Move. Transform.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              to="/asanas" 
              className="px-12 py-5 bg-teal-500 text-white text-xl font-semibold rounded-full hover:bg-teal-400 transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              Start Your Practice
            </Link>
            <Link 
              to="/contact" 
              className="px-12 py-5 bg-white/20 backdrop-blur-sm text-white text-xl font-semibold rounded-full border-2 border-white hover:bg-white/30 transform hover:scale-105 transition-all duration-300"
            >
              Book Free Trial
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Quick Access Grid */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-teal-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center text-gray-800 mb-16">
            Explore ZenFlow
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Asanas */}
            <Link to="/asanas" className="group relative h-80 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80" 
                alt="Asanas" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-900/90 via-teal-900/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-bold mb-2">Asanas</h3>
                <p className="text-lg opacity-90">47 yoga poses for every need</p>
                <span className="inline-block mt-4 text-teal-300 group-hover:translate-x-2 transition-transform duration-300">
                  Explore Poses →
                </span>
              </div>
            </Link>

            {/* Meditations */}
            <Link to="/meditations" className="group relative h-80 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80" 
                alt="Meditations" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-bold mb-2">Meditations</h3>
                <p className="text-lg opacity-90">Guided practices for mindfulness</p>
                <span className="inline-block mt-4 text-purple-300 group-hover:translate-x-2 transition-transform duration-300">
                  Find Peace →
                </span>
              </div>
            </Link>

            {/* Instructors */}
            <Link to="/instructors" className="group relative h-80 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=80" 
                alt="Instructors" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-bold mb-2">Instructors</h3>
                <p className="text-lg opacity-90">Learn from expert teachers</p>
                <span className="inline-block mt-4 text-blue-300 group-hover:translate-x-2 transition-transform duration-300">
                  Meet Our Team →
                </span>
              </div>
            </Link>

            {/* Book Trial */}
            <Link to="/contact" className="group relative h-80 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80" 
                alt="Book Trial" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-900/90 via-orange-900/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-bold mb-2">Book Trial</h3>
                <p className="text-lg opacity-90">Try your first class free</p>
                <span className="inline-block mt-4 text-orange-300 group-hover:translate-x-2 transition-transform duration-300">
                  Reserve Spot →
                </span>
              </div>
            </Link>

            {/* News */}
            <Link to="/news" className="group relative h-80 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&q=80" 
                alt="News" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-bold mb-2">News</h3>
                <p className="text-lg opacity-90">Latest in yoga & wellness</p>
                <span className="inline-block mt-4 text-indigo-300 group-hover:translate-x-2 transition-transform duration-300">
                  Read More →
                </span>
              </div>
            </Link>

            {/* Newsletters */}
            <Link to="/newsletters" className="group relative h-80 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <img 
                src="https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?w=600&q=80" 
                alt="Newsletters" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-900/90 via-pink-900/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-bold mb-2">Newsletters</h3>
                <p className="text-lg opacity-90">Weekly wellness inspiration</p>
                <span className="inline-block mt-4 text-pink-300 group-hover:translate-x-2 transition-transform duration-300">
                  Subscribe →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Inspiration Quote Section */}
      <section className="py-32 px-6 bg-gradient-to-br from-teal-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            “When the mind becomes still, the soul begins to speak.”
          </blockquote>
          <p className="text-xl opacity-90 font-medium">— Bhagavad Gita</p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Ready to Begin?
          </h2>
          <p className="text-2xl text-gray-600 mb-12">
            Join thousands finding balance, strength, and peace through yoga.
          </p>
          <Link 
            to="/contact" 
            className="inline-block px-16 py-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-2xl font-semibold rounded-full hover:from-teal-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            Book Your Free Trial Class
          </Link>
        </div>
      </section>
    </div>
  )
}
