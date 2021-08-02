import { useEffect, useRef } from 'react';

const useDidMountEffect = (func, deps) => {
  const didMount = useRef(false);

  useEffect(() => {
    let unmount;
    if (didMount.current) unmount = func();
    else didMount.current = true;

    return () => {
      didMount.current = true;
      unmount && unmount();
    };
  }, deps);
};

export default useDidMountEffect;
