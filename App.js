import { ExpoRoot } from "expo-router";

export default function App() {
  const ctx = require.context("./artifacts/mobile/app");
  return <ExpoRoot context={ctx} />;
}
