import type { NextConfig } from "next";

// A throwaway consumer: no agent files in the temporary install.
const nextConfig: NextConfig = {
  agentRules: false,
};

export default nextConfig;
