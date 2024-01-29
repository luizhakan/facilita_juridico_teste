// Modal.jsx
// eslint-disable-next-line react/prop-types
const Modal = ({ title, children, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-md p-4 max-w-xl w-full">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
            >
              Fechar
            </button>
          </div>
          <div className="mt-4">
            {children}
          </div>
        </div>
      </div>
    );
  };
  
  export default Modal;
  