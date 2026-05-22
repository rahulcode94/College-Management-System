import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { GraduationCap, Users, BookOpen, Shield, ArrowRight, } from "lucide-react";

// Home (Landing) page component
const Index = () => {
  const navigate = useNavigate();

  // Extract userToken from redux store (if logged in)
  const { userToken } = useSelector((state) => state || {});

  // If user already logged in, redirect them to their dashboard
  useEffect(() => {
    if (userToken) {
      const userType = localStorage.getItem("userType");
      if (userType) {
        navigate(`/${userType.toLowerCase()}`);
      }
    }
  }, [userToken, navigate]);
  // Features section data (used for mapping cards later)
  const features = [
    {
      icon: Shield, title: "Admin Dashboard", description: "Complete control over students, faculty, and courses with comprehensive reporting.",
    },
    {
      icon: Users, title: "Faculty Portal", description: "Manage courses, grade students, and track academic progress seamlessly.",
    },
    {
      icon: BookOpen, title: "Student Hub", description: "Access courses, view grades, and stay organized with your academic schedule.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white font-inter">
      {/* ------------------ Navigation Bar ------------------ */}
      <nav className="p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              CollegeMS
            </h1>
          </div>
          {/* Sign in button */}
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 backdrop-blur-md transition duration-200 flex items-center gap-2"
          >
            <span>Sign In</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </nav>
      {/* ------------------ Hero Section ------------------ */}
      <section className="px-6 py-24 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            College Management <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>
          {/* Subtext */}
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Streamline your educational institution with our all-in-one
            management system— built for administrators, faculty, and students.
          </p>
          {/* CTA Button */}
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition duration-300 inline-flex items-center gap-2"
          >
            <span>Get Started Today</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* Decorative blur effect background */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl opacity-30 pointer-events-none z-0" />
      </section>
      {/* ------------------ Features Section ------------------ */}
      <section className="px-6 py-24 bg-white text-gray-800 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for Every Role
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you're managing the institution, teaching courses, or
              pursuing your education, our platform adapts to your needs.
            </p>
          </div>
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="rounded-2xl p-8 bg-white border border-gray-200 shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
                >
                  {/* Icon */}
                  <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-xl mb-5">
                    <Icon className="h-8 w-8" />
                  </div>
                  {/* Title + Description */}
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* ------------------ Stats Section ------------------ */}
      <section className="px-6 py-20 bg-gradient-to-tr from-purple-800 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { label: "Students", value: "500+" },
            { label: "Faculty", value: "50+" },
            { label: "Courses", value: "100+" },
            { label: "Satisfaction", value: "99%" },
          ].map((stat, i) => (
            <div key={i} className="hover:scale-105 transition duration-200">
              <h3 className="text-4xl font-bold mb-1">{stat.value}</h3>
              <p className="text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
      {/* ------------------ Footer ------------------ */}
      <footer className="px-6 py-8 border-t border-white/10 bg-black/30 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} CollegeMS. Built with modern tech for
            educational excellence.
          </p>
        </div>
      </footer>
    </div>
  );
};
export default Index;
