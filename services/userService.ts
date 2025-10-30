const USERNAME_KEY = "koe_username";

interface RandomUserResponse {
  results: Array<{
    name: {
      title: string;
      first: string;
      last: string;
    };
  }>;
}

/**
 * Get username from session storage or fetch from random user API
 */
export const getUsername = async (): Promise<string> => {
  // Check session storage first
  if (typeof window !== "undefined") {
    const storedUsername = sessionStorage.getItem(USERNAME_KEY);
    if (storedUsername) {
      return storedUsername;
    }

    // Fetch from random user API
    try {
      const response = await fetch("https://randomuser.me/api");
      const data: RandomUserResponse = await response.json();
      const username = data.results[0].name.first;

      // Save to session storage
      sessionStorage.setItem(USERNAME_KEY, username);
      return username;
    } catch (error) {
      console.error("Failed to fetch random user:", error);
      // Fallback to a default username
      const fallbackUsername = `User${Math.floor(Math.random() * 10000)}`;
      sessionStorage.setItem(USERNAME_KEY, fallbackUsername);
      return fallbackUsername;
    }
  }

  return "Guest";
};

/**
 * Get avatar URL based on username
 */
export const getAvatarUrl = (username: string): string => {
  return `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${username}`;
};
