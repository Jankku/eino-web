import { useState } from 'react';

// https://github.com/epicweb-dev/epic-stack/blob/a55ca78909007099c2cdab073377fc74e262753b/app/utils/misc.ts#L178-L209
export function useDoubleCheck() {
  const [doubleCheck, setDoubleCheck] = useState(false);

  const onBlur = () => setDoubleCheck(false);

  function getButtonProps(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const onClick = doubleCheck
      ? undefined
      : (e: React.MouseEvent<HTMLButtonElement, Element>) => {
          e.preventDefault();
          setDoubleCheck(true);
        };

    return {
      ...props,
      onBlur: callAll<[React.FocusEvent<HTMLButtonElement>]>(onBlur, props?.onBlur),
      onClick: doubleCheck
        ? (e: React.MouseEvent<HTMLButtonElement>) => {
            props?.onClick?.(e);
            onBlur();
          }
        : onClick,
    };
  }

  return { doubleCheck, getButtonProps };
}

function callAll<Args extends Array<unknown>>(
  ...fns: Array<((...args: Args) => unknown) | undefined>
) {
  return (...args: Args) => fns.forEach((fn) => fn?.(...args));
}
