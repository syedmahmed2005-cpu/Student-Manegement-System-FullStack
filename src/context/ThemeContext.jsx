import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

const ThemeContext = createContext(null);

const THEME_STORAGE_KEY = "educore-theme";
const allowedThemes = ["light", "dark", "system"];

function getStoredTheme() {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  return allowedThemes.includes(storedTheme)
    ? storedTheme
    : "system";
}

function getResolvedTheme(theme) {
  if (theme === "light" || theme === "dark") {
    return theme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  const resolvedTheme = getResolvedTheme(theme);
  const root = document.documentElement;

  root.classList.toggle("dark", resolvedTheme === "dark");
  root.style.colorScheme = resolvedTheme;
}

export function ThemeProvider({
  children,
  user,
  setUser
}) {
  const [theme, setTheme] = useState(getStoredTheme);
  const [updatingTheme, setUpdatingTheme] = useState(false);

  useEffect(
    function () {
      if (!user) {
        return;
      }

      const accountTheme = allowedThemes.includes(
        user.themePreference
      )
        ? user.themePreference
        : "system";

      setTheme(accountTheme);
    },
    [user?.id, user?.themePreference]
  );

  useEffect(
    function () {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      applyTheme(theme);

      if (theme !== "system") {
        return;
      }

      const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

      function handleSystemThemeChange() {
        applyTheme("system");
      }

      if (systemTheme.addEventListener) {
        systemTheme.addEventListener(
          "change",
          handleSystemThemeChange
        );

        return function () {
          systemTheme.removeEventListener(
            "change",
            handleSystemThemeChange
          );
        };
      }

      systemTheme.addListener(handleSystemThemeChange);

      return function () {
        systemTheme.removeListener(handleSystemThemeChange);
      };
    },
    [theme]
  );

  async function updateTheme(nextTheme) {
    if (!allowedThemes.includes(nextTheme)) {
      return;
    }

    const previousTheme = theme;

    setTheme(nextTheme);

    if (!user) {
      return;
    }

    setUpdatingTheme(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/theme-preference`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            themePreference: nextTheme
          })
        }
      );

      const contentType =
  response.headers.get("content-type") || "";

const data = contentType.includes("application/json")
  ? await response.json()
  : {};

if (!response.ok) {
  throw new Error(
    data.message ||
      `Failed to update theme (${response.status})`
  );
}

      if (setUser) {
        setUser(function (currentUser) {
          if (!currentUser) {
            return currentUser;
          }

          return {
            ...currentUser,
            themePreference: data.themePreference
          };
        });
      }
    } catch (error) {
      setTheme(previousTheme);
      throw error;
    } finally {
      setUpdatingTheme(false);
    }
  }

  const value = useMemo(
    function () {
      return {
        theme,
        updateTheme,
        updatingTheme
      };
    },
    [theme, updatingTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}