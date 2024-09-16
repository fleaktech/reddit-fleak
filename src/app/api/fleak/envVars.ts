export const getEnvVar = (name: string): string => {
    const value = process.env[name];
  
    if (typeof value === "undefined") {
      throw new Error(`${name} environment variable is not set`);
    }
    return value;
  };
  