import React from "react";

function Adult({ fillColor, svgSize, onMouseEnter, onMouseLeave }) {
  return (
    <svg
      width={svgSize}
      height={svgSize}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0)">
        <path
          d="M289.445 157.307C293.595 157.307 296.96 153.943 296.96 149.792V137.764C296.96 133.614 293.595 130.249 289.445 130.249C285.295 130.249 281.93 133.614 281.93 137.764V149.792C281.93 153.943 285.294 157.307 289.445 157.307Z"
          fill={fillColor}
        />
        <path
          d="M223.648 157.307C227.798 157.307 231.163 153.943 231.163 149.792V137.764C231.163 133.614 227.798 130.249 223.648 130.249C219.498 130.249 216.133 133.614 216.133 137.764V149.792C216.133 153.943 219.498 157.307 223.648 157.307Z"
          fill={fillColor}
        />
        <path
          d="M230.391 189.038C232.705 194.572 240.776 203.842 256.546 203.842C272.316 203.842 280.387 194.573 282.701 189.038C283.131 188.09 283.377 187.041 283.377 185.933C283.377 181.776 280.007 178.405 275.849 178.405C272.712 178.405 270.02 180.321 268.889 183.049C268.889 183.048 268.889 183.049 268.889 183.048C268.606 183.635 265.858 188.783 256.545 188.783C247.232 188.783 244.484 183.635 244.201 183.048C244.201 183.049 244.202 183.048 244.201 183.049C243.07 180.321 240.378 178.405 237.241 178.405C233.084 178.405 229.713 181.775 229.713 185.933C229.715 187.041 229.961 188.09 230.391 189.038Z"
          fill={fillColor}
        />
        <path
          d="M434.198 322.648H380.24C366.937 282.617 344.551 258.275 327.756 244.76C319.428 238.058 311.667 233.305 305.489 230.049C322.957 216.959 335.015 197.047 337.726 174.306C339.053 174.47 340.395 174.56 341.754 174.56C359.602 174.56 374.122 160.04 374.122 142.192C374.122 131.87 369.26 122.669 361.712 116.738C367.209 100.339 368.143 82.452 364.267 65.707C363.331 61.663 359.294 59.144 355.252 60.08C351.208 61.016 348.689 65.052 349.625 69.095C352.758 82.633 352.141 97.069 347.962 110.428C345.952 110.036 343.877 109.824 341.753 109.824C338.077 109.824 334.51 110.432 331.101 111.625C310.036 100.278 287.127 67.957 286.89 67.618C285.698 65.922 283.859 64.794 281.806 64.5C279.752 64.204 277.672 64.773 276.052 66.066C275.542 66.473 225.367 106.211 183.385 112.155C179.559 110.614 175.52 109.823 171.339 109.823C169.033 109.823 166.783 110.07 164.612 110.531C162.124 83.16 167.871 61.143 181.756 44.995C200.753 22.901 232.846 15.029 256.546 15.029C279.934 15.029 292.88 28.009 293.387 28.529C295.114 30.341 297.664 31.167 300.133 30.746C300.304 30.717 317.375 27.941 331.622 38.412C334.026 40.179 336.308 42.383 338.407 44.963C341.025 48.183 345.759 48.67 348.979 46.052C352.199 43.434 352.686 38.701 350.068 35.481C347.166 31.912 343.955 28.824 340.524 26.302C325.503 15.262 308.762 14.966 301.351 15.507C295.253 10.45 279.837 0 256.547 0C243.428 0 198.442 2.538 170.361 35.197C152.71 55.725 145.966 83.45 150.273 117.649C143.362 123.59 138.972 132.385 138.972 142.192C138.972 160.04 153.492 174.56 171.34 174.56C172.698 174.56 174.041 174.47 175.367 174.306C178.078 197.045 190.135 216.956 207.602 230.046C198.753 234.708 186.658 242.447 174.286 254.594C171.325 257.502 171.281 262.259 174.189 265.221C177.098 268.184 181.856 268.225 184.816 265.318C198.501 251.882 211.846 244.484 219.441 240.972L232.321 273.613L223.368 322.647H148.753C153.422 309.786 159.397 297.928 166.577 287.29C168.899 283.85 167.993 279.179 164.552 276.858C161.112 274.536 156.442 275.443 154.12 278.882C145.301 291.948 138.175 306.655 132.865 322.647H77.802C57.084 322.647 40.229 339.502 40.229 360.22V474.425C40.229 495.143 57.084 511.998 77.802 511.998H337.201C341.351 511.998 344.716 508.633 344.716 504.483C344.716 500.333 341.351 496.968 337.201 496.968H77.802C65.371 496.968 55.258 486.855 55.258 474.424V360.222C55.258 347.791 65.371 337.678 77.802 337.678H434.198C446.629 337.678 456.742 347.791 456.742 360.222V474.427C456.742 486.858 446.629 496.971 434.198 496.971H367.259C363.109 496.971 359.744 500.336 359.744 504.486C359.744 508.636 363.108 512.001 367.259 512.001H434.198C454.916 512.001 471.771 495.146 471.771 474.428V360.222C471.771 339.503 454.916 322.648 434.198 322.648ZM267.883 265.338H245.211L236.758 243.916C243.098 245.498 249.723 246.35 256.546 246.35C263.369 246.35 269.995 245.497 276.335 243.916L267.883 265.338ZM359.092 142.192C359.092 151.753 351.314 159.531 341.753 159.531C340.586 159.531 339.445 159.397 338.325 159.172V125.212C339.445 124.987 340.586 124.853 341.753 124.853C351.314 124.854 359.092 132.632 359.092 142.192ZM154.001 142.192C154.001 132.631 161.779 124.853 171.34 124.853C172.507 124.853 173.648 124.987 174.768 125.212V159.172C173.649 159.397 172.507 159.531 171.34 159.531C161.779 159.531 154.001 151.753 154.001 142.192ZM189.797 164.572V126.334C208.028 122.964 228.992 114.258 252.234 100.394C263.893 93.439 273.422 86.773 279.236 82.507C287.426 93.119 305.215 114.392 323.296 124.49V164.572C323.296 201.378 293.352 231.321 256.547 231.321C219.74 231.321 189.797 201.378 189.797 164.572ZM238.644 322.648L246.364 280.367H266.73L274.45 322.648H238.644ZM289.726 322.648L280.774 273.615L293.657 240.963C308.432 247.789 345.023 269.438 364.342 322.648H289.726Z"
          fill={fillColor}
        />
        <path
          d="M86.8 470C86.8 463.84 87.6867 458.24 89.46 453.2C91.2333 448.067 93.8 443.587 97.16 439.76C100.52 435.933 103.88 432.713 107.24 430.1C110.6 427.487 114.613 424.827 119.28 422.12C123.573 419.507 126.933 417.313 129.36 415.54C131.787 413.673 134.027 411.2 136.08 408.12C138.227 405.04 139.3 401.773 139.3 398.32C139.3 393.56 137.527 389.593 133.98 386.42C130.527 383.247 125.907 381.66 120.12 381.66C109.293 381.66 102.34 386.467 99.26 396.08L88.34 391.18C90.3 385.02 94.1733 380.027 99.96 376.2C105.747 372.28 112.607 370.32 120.54 370.32C130.247 370.32 137.9 372.933 143.5 378.16C149.1 383.293 151.9 390.107 151.9 398.6C151.9 401.96 151.387 405.087 150.36 407.98C149.333 410.873 148.073 413.347 146.58 415.4C145.18 417.453 143.127 419.6 140.42 421.84C137.713 424.08 135.287 425.9 133.14 427.3C131.087 428.607 128.287 430.333 124.74 432.48C117.833 436.493 112.373 440.46 108.36 444.38C104.44 448.3 101.967 452.873 100.94 458.1H152.74V470H86.8Z"
          fill={fillColor}
        />
        <path
          d="M184.703 470V391.88H168.323V383.62C178.869 383.62 185.449 379.747 188.063 372H196.883V470H184.703Z"
          fill={fillColor}
        />
        <path
          d="M226.569 434.16V422.4H259.329V434.16H226.569Z"
          fill={fillColor}
        />
        <path
          d="M324.487 470V445.64H274.367V438.36L325.187 372H336.667V434.72H350.527V445.64H336.667V470H324.487ZM324.487 434.72V389.22L290.327 434.72H324.487Z"
          fill={fillColor}
        />
        <path
          d="M402.62 471.68C396.367 471.68 390.907 470.233 386.24 467.34C381.574 464.353 377.98 460.387 375.46 455.44C373.034 450.4 371.214 445.033 370 439.34C368.88 433.647 368.32 427.533 368.32 421C368.32 415.027 368.834 409.333 369.86 403.92C370.887 398.413 372.614 393.047 375.04 387.82C377.467 382.5 381.014 378.253 385.68 375.08C390.44 371.907 396.087 370.32 402.62 370.32C408.874 370.32 414.334 371.813 419 374.8C423.667 377.693 427.214 381.66 429.64 386.7C432.16 391.74 433.98 397.107 435.1 402.8C436.314 408.493 436.92 414.56 436.92 421C436.92 426.973 436.36 432.713 435.24 438.22C434.214 443.633 432.487 449 430.06 454.32C427.634 459.547 424.04 463.747 419.28 466.92C414.614 470.093 409.06 471.68 402.62 471.68ZM402.62 460.2C406.82 460.2 410.414 459.033 413.4 456.7C416.387 454.367 418.58 451.147 419.98 447.04C421.474 442.933 422.5 438.827 423.06 434.72C423.714 430.52 424.04 425.947 424.04 421C424.04 415.773 423.714 410.967 423.06 406.58C422.407 402.193 421.287 398.087 419.7 394.26C418.207 390.34 416.014 387.26 413.12 385.02C410.227 382.78 406.727 381.66 402.62 381.66C398.327 381.66 394.687 382.873 391.7 385.3C388.714 387.633 386.474 390.853 384.98 394.96C383.487 398.973 382.414 403.127 381.76 407.42C381.2 411.62 380.92 416.147 380.92 421C380.92 426.227 381.247 431.033 381.9 435.42C382.554 439.713 383.674 443.82 385.26 447.74C386.847 451.66 389.087 454.74 391.98 456.98C394.967 459.127 398.514 460.2 402.62 460.2Z"
          fill={fillColor}
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="512" height="512" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default Adult;