import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudMeatball } from '@fortawesome/free-solid-svg-icons'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="h-100 w-100 text-center pt-5">
          <FontAwesomeIcon className="text-warning"
             icon={faCloudMeatball} style={{fontSize: "5em"}}/>
        </div>)
    }

    return this.props.children;
  }
}
