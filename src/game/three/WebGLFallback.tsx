import { Component, type ReactNode, type ErrorInfo } from 'react';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
};

export class WebGLFallback extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn('[WebGLFallback] Canvas error:', error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F1C96A',
              fontSize: '1rem',
              textAlign: 'center',
              padding: '2rem',
            }}
          >
            3D görüntüleme desteklenmiyor. Lütfen tarayıcınızı güncelleyin.
          </div>
        )
      );
    }
    return this.props.children;
  }
}
