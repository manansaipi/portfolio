import React from 'react';

class ErrorBoundary3D extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("3D Museum Context Error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed', inset: 0, background: '#0a0a0a', color: '#fff',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Inter, system-ui, sans-serif', padding: '20px', textAlignment: 'center', zIndex: 9999
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#ef4444' }}>
            3D Graphics Rendering Error
          </h2>
          <p style={{ opacity: 0.8, maxWidth: '500px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
            A WebGL context issue occurred while rendering the museum environment.
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              padding: '10px 24px', background: '#3b82f6', color: '#fff', border: 'none',
              borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem'
            }}
          >
            Reload Museum Scene
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary3D;
