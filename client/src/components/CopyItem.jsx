import { useDispatch, useSelector } from "react-redux";
import { fetchClasses } from "../features/classGroup/classAPI";
import { useEffect } from "react";
import { TiDelete } from "react-icons/ti";
import { FaCopy } from "react-icons/fa";

const CopyItem = ({ quizOnClick, isShowClassList, classListClose }) => {
  const classList = useSelector((state) => state.class.class);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  return (
    <article>
      {/* <div className="fixed h-full w-full top-0 left-0 bg-gray-700 inset-0 opacity-70 z-10"></div> */}
      <div
        className={`absolute w-fit h-fit bg-white rounded-lg shadow-xl shadow-gray-500 drop-shadow-lg transition-transform ease-in-out duration-100 origin-top-right transform ${
          isShowClassList
            ? "scale-100 opacity-100 visible"
            : "scale-0 opacity-0 invisible"
        } top-7 right-1 lg:top-8 lg:right-3 z-30`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex justify-between bg-third w-full text-end px-6 py-2 rounded-t-lg">
          <div className="absolute w-3 h-3 bg-primary top-5 left-4"></div>
          <div
            onClick={classListClose}
            className="relative mt-1 -ml-4 text-3xl text-red-600 hover:cursor-pointer hover:text-red-700"
          >
            <TiDelete />
          </div>
          <div className="flex flex-row text-lg md:text-xl text-primary mr-1">
            <FaCopy className="mt-2 mr-6" />
            <p className="mr-2 mt-1 ">Copy</p>
          </div>
        </div>
        <div className="ml-3 mt-2 italic text-red-800">
          <p>Choose your class</p>
        </div>
        <ul className="text-lg md:text-xl p-2 transition-all ease-in-out duration-300">
          {classList.map((classItem) => (
            <li
              key={classItem._id}
              onClick={(e) => quizOnClick(e, classItem._id)}
              className="p-2 hover:bg-gray-200 hover:w-full active:bg-gray-300"
            >
              {classItem.className}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};

export default CopyItem;
