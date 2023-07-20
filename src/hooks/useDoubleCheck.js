import { useState } from 'react';

// https://github.com/epicweb-dev/epic-stack/blob/a55ca78909007099c2cdab073377fc74e262753b/app/utils/misc.ts#L178-L209
export function useDoubleCheck() {
  const [doubleCheck, setDoubleCheck] = useState(false);

  function getButtonProps(props) {
    const onBlur = () => setDoubleCheck(false);

    const onClick = doubleCheck
      ? undefined
      : (e) => {
          e.preventDefault();
          setDoubleCheck(true);
        };

    return {
      ...props,
      onBlur: callAll(onBlur, props?.onBlur),
      onClick: doubleCheck
        ? () => {
            props?.onClick();
            onBlur();
          }
        : onClick,
    };
  }

  return { doubleCheck, getButtonProps };
}

function callAll(...fns) {
  return (...args) => fns.forEach((fn) => fn?.(...args));
}
