function Toast({ message, type, onClose }) {
  return (
    <div
      className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-lg text-white ${
        type === "success"
          ? "bg-green-600"
          : type === "warning"
          ? "bg-yellow-500"
          : "bg-red-600"
      }`}
    >
      <div className="flex items-center gap-4">
        <span>{message}</span>

        <button
          type="button"
          onClick={onClose}
          className="font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast;