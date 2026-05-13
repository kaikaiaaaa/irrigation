import React, { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-red-600" size={32} />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-2">出错了</h2>
            <p className="text-gray-600 mb-6">
              应用遇到了意外错误，请尝试刷新页面。
            </p>
            
            {this.state.error && (
              <div className="bg-gray-50 rounded-lg p-3 mb-6 text-left">
                <p className="text-sm text-gray-500 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-700 text-white rounded-lg touch-target"
            >
              <RefreshCw size={18} />
              <span>刷新页面</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
