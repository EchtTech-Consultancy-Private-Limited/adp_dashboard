import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    console.log(props, "jdshdjsdhh")
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.We are coming soon.</h1>;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;