import React from "react";
import Image from "next/image";
import { withRouter } from "next/router"; 

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props); 

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI

    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // You can use your own error logging service here
    console.log({ error, errorInfo });
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex flex-col items-center">
          <Image src={"/500.jpg"} width={500} height={500} />
          <button
            type="button"
            className="p-2 border-black border-2 rounded-md mt-5"
            onClick={() => window.location.replace("/")}
          >
            Go To Home
          </button>
        </div>
      );
    }

    // Return children components in case of no error

    return this.props.children;
  }
}

export default ErrorBoundary;
