import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { ClipLoader } from "react-spinners";
import {
  persistSignupAuth,
  validateSignupForm,
} from "../../../utils/signupUtils";
import { InputField } from "../../../components/FormField/InputField";
import { SingleCheckboxField } from "../../../components/FormField/CheckboxField";
import { signupUserApi } from "../Service/SignupService";

const Signup = ({ onSignup }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = validateSignupForm({ name, email, password });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const { profile, token } = await signupUserApi({
        name,
        email,
        password,
        rememberMe,
      });

      if (!profile) profile = { name, email };
      persistSignupAuth({ profile, token, rememberMe });
      if (typeof onSignup === "function") {
        try {
          onSignup(profile, rememberMe, token);
        } catch (callErr) {
          console.warn("onSignup threw:", callErr);
          navigate("/");
        }
      } else {
        navigate("/");
      }
      setPassword("");
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrors({ api: error.response.data.message });
      } else {
        setErrors({
          api:
            error?.message || "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-purple-50 to-violet-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-linear-to-r from-purple-500 to-violet-600 p-6 text-center relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 p-2 text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-purple-100 mt-2">
            Join Spendora to manage your finances
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-6">
              <div className="relative">
                <div className="absolute left-3 top-11.5 z-10 pointer-events-none text-gray-400">
                  <User className="w-5 h-5" />
                </div>

                <InputField
                  label="Full Name"
                  labelPosition="top"
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  size="m"
                  required
                  value={name}
                  onChange={(value) => setName(value)}
                  error={errors.name}
                  inputClassName="pl-10"
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="relative">
                <div className="absolute left-3 top-11.5 z-10 pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>

                <InputField
                  label="Email"
                  labelPosition="top"
                  name="email"
                  type="email"
                  placeholder="user@example.com"
                  size="m"
                  required
                  value={email}
                  onChange={(value) => setEmail(value)}
                  error={errors.email}
                  inputClassName="pl-10"
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="relative">
                <div className="absolute left-3 top-11.5 z-10 pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>

                <InputField
                  label="Password"
                  labelPosition="top"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  size="m"
                  required
                  value={password}
                  onChange={(value) => setPassword(value)}
                  error={errors.password}
                  inputClassName="pl-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-11.5 z-10 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <SingleCheckboxField
                name="remember"
                label="Remember Me"
                labelPosition="right"
                size="m"
                value={rememberMe}
                onChange={(checked) => setRememberMe(checked)}
              />
            </div>

            <button
              type="submit"
              className={`w-full bg-linear-to-r from-purple-500 to-violet-600 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center ${
                isLoading ? "opacity-80 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ClipLoader size={18} color="#FFFFFF" />
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account{" "}
              <Link
                to="/login"
                className="font-medium text-purple-600 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
