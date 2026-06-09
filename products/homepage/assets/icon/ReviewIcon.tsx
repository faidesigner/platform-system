export type ReviewIconKey = "bakery" | "cafeteria" | "resort";

interface ReviewIconProps {
  name: ReviewIconKey;
}

export default function ReviewIcon({ name }: ReviewIconProps) {
  switch (name) {
    case "bakery":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
          <path
            d="M1.5 4.5C1.5 3.395 2.395 2.5 3.5 2.5H6.5C7.605 2.5 8.5 3.395 8.5 4.5V5.5C8.5 6.605 7.605 7.5 6.5 7.5H3.5C2.395 7.5 1.5 6.605 1.5 5.5V4.5Z"
            fill="var(--color-icon-tag-category-yellow, #E8A317)"
          />
          <path
            d="M2.5 2.5C2.5 1.672 3.172 1 4 1H6C6.828 1 7.5 1.672 7.5 2.5"
            stroke="var(--color-icon-tag-category-yellow, #E8A317)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      );
    case "cafeteria":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
          <path
            d="M1 3.5H9V4.5C9 5.605 8.105 6.5 7 6.5H3C1.895 6.5 1 5.605 1 4.5V3.5Z"
            fill="var(--color-icon-tag-category-green, #36CD1E)"
          />
          <path
            d="M3 6.5V8.5M7 6.5V8.5"
            stroke="var(--color-icon-tag-category-green, #36CD1E)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      );
    case "resort":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
          <path
            d="M1 8.5H9M2 8.5V4.5L5 1.5L8 4.5V8.5"
            stroke="var(--color-icon-tag-category-purple, #9B5DE5)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 8.5V6H6V8.5"
            fill="var(--color-icon-tag-category-purple, #9B5DE5)"
          />
        </svg>
      );
    default:
      return null;
  }
}
