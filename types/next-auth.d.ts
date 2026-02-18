import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    githubProfile?: {
      login: string;
      avatar_url: string;
      name: string;
      bio: string;
      public_repos: number;
      followers: number;
      following: number;
      html_url: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    githubProfile?: {
      login: string;
      avatar_url: string;
      name: string;
      bio: string;
      public_repos: number;
      followers: number;
      following: number;
      html_url: string;
    };
  }
}
