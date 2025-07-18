// pages/LoginPage.jsx
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-100">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src='public/Weather.mp4' type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-opacity-50 z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col md:flex-row w-full max-w-5xl bg-white bg-opacity-90 rounded-xl shadow-2xl overflow-hidden">
        {/* Left Image */}
        <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/auth-illustration.png')" }} />

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-10">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-blue-800">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Don’t have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
