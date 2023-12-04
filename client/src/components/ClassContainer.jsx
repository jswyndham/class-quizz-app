import { useEffect, memo } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import ClassCard from "./ClassCard";
import {
  fetchClasses,
  fetchCurrentUser,
} from "../features/classGroup/classAPI";

const MemoizedClassCard = memo(ClassCard);

const ClassContainer = () => {
  const { userData, classesData } = useSelector(
    (state) => ({
      userData: state.class.currentUser,
      classesData: state.class.classes,
      loading: state.class.loading,
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (!userData) {
      dispatch(fetchCurrentUser());
    }
  }, [userData, dispatch]);

  useEffect(() => {
    console.log("Fetching classes...");
    dispatch(fetchClasses());
  }, [dispatch]);

  console.log("ClassContainer rendering with classes:", classesData);

  // NO CLASSES TO DISPLAY
  if (classesData.length === 0) {
    return (
      <div className="h-screen w-screen flex justify-center">
        <h2 className="text-3xl font-display font-bold italic mt-44">
          You currently have no classes to display.
        </h2>
      </div>
    );
  }

  // RETURN CLASSES ARRAY
  return (
    <section className="flex justify-center h-screen w-screen py-36 px-4">
      <div className="2xl:w-7/12 w-full mx-2 md:mx-12 grid grid-cols-1 gap-4">
        {classesData.map((classGroup) => {
          return <MemoizedClassCard key={classesData._id} {...classGroup} />;
        })}
      </div>
    </section>
  );
};

export default ClassContainer;
