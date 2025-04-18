import { lazy, Suspense, ComponentType, ReactNode } from 'react';

interface DynamicOptions {
  loading?: ComponentType;
  ssr?: boolean;
  suspense?: boolean;
}

export default function dynamic<P = {}>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  options: DynamicOptions = {}
): ComponentType<P> {
  const LazyComponent = lazy(importFunc);

  const DynamicComponent = (props: P) => {
    const { loading: LoadingComponent, suspense } = options;

    if (suspense) {
      return (
        <Suspense fallback={LoadingComponent ? <LoadingComponent /> : null}>
          <LazyComponent {...props} />
        </Suspense>
      );
    }

    return (
      <Suspense fallback={LoadingComponent ? <LoadingComponent /> : null}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };

  // Set display name for better debugging
  const displayName = importFunc.toString().match(/[\/\\](\w+)$/)?.[1] || 'Component';
  DynamicComponent.displayName = `Dynamic(${displayName})`;

  return DynamicComponent;
}
