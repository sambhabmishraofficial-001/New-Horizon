/** Stable demo identities for marketing previews (products page, etc.). */

export type DemoResearcher = {
  userId: string;
  name: string;
  initials: string;
};

export const DEMO_RESEARCHERS: DemoResearcher[] = [
  { userId: "nh-demo-amy-researcher", name: "Amy", initials: "AM" },
  { userId: "nh-demo-john-researcher", name: "John", initials: "JO" },
  { userId: "nh-demo-sam-researcher", name: "Sam", initials: "SA" },
];

export const DEMO_VRI_USER_ID = DEMO_RESEARCHERS[0].userId;
export const DEMO_CARDHOLDER_NAME = DEMO_RESEARCHERS[0].name;
