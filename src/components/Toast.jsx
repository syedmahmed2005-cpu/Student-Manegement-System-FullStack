function Toast({ message, type, onClose }) {
  function getToastStyle() {
    if (type === "success") {
      return "border-green-500 bg-green-600 text-white dark:border-green-600 dark:bg-green-700";
    }

    if (type === "warning") {
      return "border-amber-400 bg-amber-500 text-slate-950 dark:border-amber-500 dark:bg-amber-600 dark:text-white";
    }

    return "border-red-500 bg-red-600 text-white dark:border-red-600 dark:bg-red-700";
  }

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      aria-live="polite"
      className={`fixed left-4 right-4 top-5 z-50 rounded-xl border px-5 py-3 shadow-xl sm:left-auto sm:right-5 sm:max-w-md ${getToastStyle()}`}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-medium">
          {message}
        </span>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="grid h-7 min-h-0 w-7 shrink-0 place-items-center rounded-full text-xl font-bold transition hover:bg-black/10 dark:hover:bg-white/10"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast;