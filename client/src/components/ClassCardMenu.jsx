import { useClassCardContext } from "./ClassCard";

const ClassCardMenu = () => {
  const { showClassCardMenu, toggleCardMenu } = useClassCardContext();

  return (
    <section className={showClassCardMenu ? "flex" : "hidden"}>
      <div
        className={
          "w-fit h-fit bg-white p-6 rounded-lg shadow-xl shadow-gray-800 drop-shadow-lg transition-all ease-in-out duration-300 top-0 z-50"
        }
      >
        <ul className="text-xl">
          <li className="m-2 hover:text-gray-500">
            <button onClick={toggleCardMenu}>duplicate</button>
          </li>
          <li className="m-2 hover:text-gray-500">
            <button onClick={toggleCardMenu}>edit</button>
          </li>
          <li className="m-2 hover:text-red-500 text-red-700">
            <button onClick={toggleCardMenu}>delete</button>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default ClassCardMenu;
