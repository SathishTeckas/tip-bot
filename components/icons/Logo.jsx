import * as React from "react";

function Logo({ fill = "#60A644", ...rest }) {
  return (
    <svg viewBox="0 0 135 30" className="h-7">
      <path
        d="M15 2.292a3.317 3.317 0 012.981 1.841l9.375 18.75a3.333 3.333 0 01-2.981 4.825H5.625a3.333 3.333 0 01-2.98-4.825l9.374-18.75A3.317 3.317 0 0115 2.292M15 0a5.625 5.625 0 00-5.031 3.108L.594 21.858A5.625 5.625 0 005.625 30h18.75a5.625 5.625 0 005.03-8.142l-9.374-18.75A5.625 5.625 0 0015 0z"
        fill="currentColor"
        className="text-logoColor"
      ></path>
    </svg>
  );
}

export default Logo;
