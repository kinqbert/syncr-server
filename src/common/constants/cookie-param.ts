export const COOKIE_PARAM = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
};

export type COOKIE_PARAM = (typeof COOKIE_PARAM)[keyof typeof COOKIE_PARAM];
