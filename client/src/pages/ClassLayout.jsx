import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchClassById } from "../features/classGroup/classAPI";
import { fetchCurrentUser } from "../features/users/userAPI";
// import { useLoaderData } from 'react-router-dom';
// import customFetch from '../utils/customFetch';
// import { toast } from 'react-toastify';
import QuizContainer from "../components/QuizContainer";

// export const loader = async ({ params }) => {
// 	try {
// 		const { data } = await customFetch.get(`/class/${params.id}`);
// 		console.log('Fetched data:', data);
// 		return data;
// 	} catch (error) {
// 		toast.error(error?.response?.data?.msg);
// 		return error;
// 	}
// };
const ClassLayout = ({ _id }) => {
  // const { classGroup } = useLoaderData();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.class.currentUser);
  const currentClass = useSelector((state) => state.class.classes);
  const { loading, error } = useSelector((state) => state.class);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      dispatch(fetchCurrentUser())
        .unwrap()
        .catch(() => {
          navigate("/");
        });
    }
  }, [userData, dispatch, navigate]);

  useEffect(() => {
    dispatch(fetchClassById(_id));
  }, [dispatch, _id]);

  if (loading) return <div>Loading classes...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // NO CLASSES TO DISPLAY
  if (!currentClass) {
    return (
      <div className="h-screen w-screen flex justify-center">
        <h2 className="text-3xl font-display font-bold italic mt-44">
          You currently have no classes to display.
        </h2>
      </div>
    );
  }

  console.log("single class: ", currentClass);

  return (
    <section className="w-screen h-screen flex justify-center align-middle">
      <div className="mt-56">
        <h2 className="text-4xl font-serif text-blue-800">
          {currentClass.className}
        </h2>
      </div>
      <div>
        <QuizContainer />
      </div>
    </section>
  );
};

export default ClassLayout;
