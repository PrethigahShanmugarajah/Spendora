// Client / src / pages / Login / View / Login.jsx
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { InputField } from "../../../components/FormField/InputField";
import { SingleCheckboxField } from "../../../components/FormField/CheckboxField";
import { loginUserApi } from "../Service/LoginService";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { profile, token } = await loginUserApi({
        email,
        password,
        rememberMe,
      });

      if (typeof onLogin === "function") {
        try {
          onLogin(profile, rememberMe, token);
        } catch (error) {
          console.warn("onLogin warn:", error);
        }
      } else {
        navigate("/");
      }

      setPassword("");
    } catch (error) {
      const serverMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Login was unsuccessful. Please verify your credentials and try again.";
      setError(serverMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-purple-50 to-violet-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-linear-to-r from-purple-500 to-violet-600 p-6 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-purple-100 mt-2">
            Sign in to your Spendora account
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="relative">
                <div className="absolute left-3 top-11.5 z-10 pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>

                <InputField
                  label="Email Address"
                  labelPosition="top"
                  name="email"
                  type="email"
                  placeholder="user@example.com"
                  size="m"
                  value={email}
                  onChange={(value) => setEmail(value)}
                  required
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
                  value={password}
                  onChange={(value) => setPassword(value)}
                  required
                  size="m"
                  inputClassName="pl-10 pr-12"
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
              disabled={isLoading}
              className={`w-full bg-linear-to-r from-purple-500 to-violet-600 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center ${
                isLoading ? "opacity-80 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <ClipLoader size={18} color="#FFFFFF" />
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Do not have an account{" "}
              <Link
                to="/signup"
                className="font-medium text-purple-600 hover:underline"
              >
                Create One
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
