import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authAPI";
import { FormRow } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/images/quizgate-logo.png";
import loginBackGround from "../assets/images/quizLogIn.jpg";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(formData))
      .unwrap()
      .then(() => {
        navigate("/dashboard");
        toast.success("Login successful");
      })
      .catch(() => {
        toast.error(error || "Login failed");
      });
  };

  return (
    <section className="flex flex-row justify-center align-middle h-full w-screen bg-third">
      <img
        src={loginBackGround}
        alt="QuizGate logo"
        className="hidden lg:flex lg:bg-contain"
      />
      <article className="flex flex-col justify-start pl-4 align-middle lg:min-w-1/2 pt-40 rounded-xl">
        <div className="mx-8 my-12 h-12 w-96">
          <img src={logo} alt="QuizGate logo" />
        </div>
        <div className="flex items-center align-middle w-fit">
          <form onSubmit={handleSubmit} className="w-fit p-8 md:p-16">
            {/* EMAIL */}
            <FormRow
              type="email"
              name="email"
              labelText="email"
              value={formData.email}
              onChange={handleChange}
            />

            {/* PASSWORD */}
            <FormRow
              type="password"
              name="password"
              labelText="password"
              value={formData.password}
              onChange={handleChange}
            />

            {/* BUTTON */}
            <div className="flex flex-col justify-center w-fit">
              <button
                type="submit"
                disabled={loading}
                className="h-8 w-96 mt-10 mb-4 bg-white text-secondary font-bold border-solid border-2 border-secondary rounded-lg drop-shadow-lg hover:bg-secondary hover:text-white hover:font-bold hover:shadow-2xl hover:drop-shadow-xl active:shadow-sm active:bg-third"
              >
                {loading ? "submitting..." : "login"}
              </button>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <div className="flex flex-row justify-center mt-6">
                <p className="mx-2 text-xl">Not yet a member?</p>
                <Link to="/register" className="text-blue-400">
                  <p className="text-center text-primary text-xl">signup</p>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </article>
    </section>
  );
};

export default Login;
