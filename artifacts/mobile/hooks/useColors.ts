import colors from "../constants/colors";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Returns the design tokens for the active theme.
 * Reads from ThemeContext (user preference, persisted in AsyncStorage),
 * not the system color scheme.
 */
export function useColors() {
  const { theme } = useTheme();
  const palette = theme === "dark" ? colors.dark : colors.light;
  return { ...palette, radius: colors.radius };
}
