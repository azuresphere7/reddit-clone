import React from "react";
import { PRIMARY_COLOR } from "@/utils/constants";
import type { IconProps } from "@/utils/interface";

const CommentIcon = (props: IconProps) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.33337 7.33342C1.33337 6.40441 1.33337 5.93991 1.39493 5.55125C1.73379 3.41178 3.41174 1.73384 5.5512 1.39498C5.93987 1.33342 6.40437 1.33342 7.33337 1.33342H8.00004C9.54999 1.33342 10.325 1.33342 10.9608 1.50379C12.6863 1.96613 14.034 3.31386 14.4963 5.03932C14.6667 5.67516 14.6667 6.45013 14.6667 8.00009V12.7806C14.6667 13.9041 13.4411 14.598 12.4777 14.02V14.02C11.7289 13.5707 10.8721 13.3334 9.99889 13.3334H7.33337C6.40437 13.3334 5.93987 13.3334 5.5512 13.2719C3.41174 12.933 1.73379 11.2551 1.39493 9.11559C1.33337 8.72693 1.33337 8.26243 1.33337 7.33342V7.33342Z"
        stroke={props.color ? props.color : PRIMARY_COLOR}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CommentIcon;
