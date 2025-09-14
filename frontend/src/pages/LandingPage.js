import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  Users, 
  Store, 
  Shield, 
  ArrowRight,
  Sparkles,
  Heart,
  Target,
  Zap,
  CheckCircle,
  TrendingUp,
  Award
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { MacbookScrollDemo } from '../components/MacbookScrollDemo';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features = [
    {
      icon: Star,
      title: "Easy Rating System",
      description: "Simple 5-star rating system that customers love to use"
    },
    {
      icon: Users,
      title: "Customer Insights",
      description: "Get detailed analytics about your customer satisfaction"
    },
    {
      icon: Shield,
      title: "Verified Reviews",
      description: "All reviews are verified to ensure authenticity"
    },
    {
      icon: TrendingUp,
      title: "Performance Tracking",
      description: "Track your store's performance over time with detailed charts"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Store Owner",
      content: "This platform has transformed how I understand my customers. The insights are incredible!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Restaurant Manager",
      content: "Easy to use and our customers love leaving feedback. Highly recommended!",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "Retail Manager",
      content: "The analytics dashboard gives me exactly what I need to improve my business.",
      rating: 5
    }
  ];

  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "500+", label: "Stores" },
    { number: "50K+", label: "Reviews" },
    { number: "4.9", label: "Average Rating" }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br from-pink-400/30 to-indigo-600/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-emerald-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400/60 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400/60 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-pink-400/60 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-indigo-400/60 rounded-full animate-bounce delay-500"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-20 pb-16">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/20 dark:to-purple-400/20 rounded-full mb-8 border border-blue-200/50 dark:border-blue-400/30 backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-pulse" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Transform Your Business Today</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-8 leading-tight">
              Store Rating Platform
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed">
              Empower your business with authentic customer feedback. Build trust, improve service, and grow your reputation with our comprehensive rating system.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-5 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="px-10 py-5 text-lg font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transform hover:scale-105 transition-all duration-300">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* MacBook Scroll Demo */}
            <div className="transform hover:scale-105 transition-all duration-500">
              <MacbookScrollDemo />
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center group hover:scale-110 transition-all duration-300 cursor-default"
                style={{
                  animationDelay: `${index * 200}ms`
                }}
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-semibold text-sm md:text-base group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-gray-800/50 dark:to-indigo-900/50"></div>
          <div className="container mx-auto px-6 relative">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
                Why Choose Our Platform?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Everything you need to collect, manage, and analyze customer feedback effectively.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="text-center hover:shadow-2xl transition-all duration-500 hover:scale-110 group border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                  style={{
                    animationDelay: `${index * 150}ms`
                  }}
                >
                  <CardContent className="p-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-500 group-hover:rotate-6">
                      <feature.icon className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <CardTitle className="text-xl mb-4 font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors duration-300">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-indigo-900"></div>
          <div className="container mx-auto px-6 relative">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Get started in just three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { step: "1", title: "Sign Up", description: "Create your account and add your store information", icon: "👤" },
                { step: "2", title: "Collect Ratings", description: "Share your unique link with customers to collect ratings", icon: "⭐" },
                { step: "3", title: "Analyze & Improve", description: "Use insights to enhance your customer experience", icon: "📊" }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="text-center group hover:scale-105 transition-all duration-500"
                  style={{
                    animationDelay: `${index * 200}ms`
                  }}
                >
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold shadow-2xl group-hover:shadow-3xl group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-500 group-hover:rotate-12">
                      {item.step}
                    </div>
                    <div className="absolute -top-2 -right-2 text-4xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                      {item.icon}
                    </div>
                    {index < 2 && (
                      <div className="hidden md:block absolute top-12 left-full w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transform translate-x-6"></div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors duration-300">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-gray-800/50 dark:to-purple-900/50"></div>
          <div className="container mx-auto px-6 relative">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent">
                What Our Users Say
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Join thousands of satisfied store owners
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <Card className="text-center p-12 hover:shadow-2xl transition-all duration-500 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 group">
                <CardContent>
                  <div className="flex justify-center mb-8">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-8 h-8 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-300" style={{ animationDelay: `${i * 100}ms` }} />
                    ))}
                  </div>
                  <blockquote className="text-2xl text-gray-700 dark:text-gray-300 mb-8 italic leading-relaxed group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors duration-300">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>
                  <div className="group-hover:scale-105 transition-transform duration-300">
                    <div className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 text-lg">
                      {testimonials[currentTestimonial].role}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center mt-8 gap-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      index === currentTestimonial 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 scale-125 shadow-lg' 
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 hover:scale-110'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-6 text-center relative">
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-16 max-w-5xl mx-auto border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 group">
              <CardContent>
                <div className="group-hover:scale-110 transition-transform duration-500 mb-8">
                  <Award className="w-20 h-20 mx-auto group-hover:rotate-12 transition-transform duration-500" />
                </div>
                <h2 className="text-5xl font-bold mb-6 group-hover:scale-105 transition-transform duration-300">
                  Ready to Transform Your Business?
                </h2>
                <p className="text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed group-hover:opacity-100 transition-opacity duration-300">
                  Join thousands of store owners who are already using our platform to improve their customer experience.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link to="/register">
                    <Button size="lg" variant="secondary" className="px-12 py-6 text-xl font-bold bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                      Start Free Trial <ArrowRight className="ml-3 w-6 h-6" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="px-12 py-6 text-xl font-bold border-2 border-white text-white hover:bg-white hover:text-blue-600 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
