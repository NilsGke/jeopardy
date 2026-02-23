import { useEffect, useState } from "react";

const VERSION_URL = new URL("version", import.meta.env.VITE_PROD_URL);
const CURRENT_VERSION = __APP_VERSION__;

export default function NewVersionInfo() {
  const [latestVersion, setLatestVersion] = useState<string | null>(null);

  useEffect(() => {
    fetch(VERSION_URL)
      .then((response) => response.text())
      .then((version) => setLatestVersion(version));
  }, []);

  if (!latestVersion || latestVersion == CURRENT_VERSION) return null;

  return (
    <div className="w-full text-center text-xs my-2">
      You are using an older version, consider upgrading to {latestVersion}
    </div>
  );
}
