import { useState } from 'react';

// https://github.com/epicweb-dev/epic-stack/blob/a55ca78909007099c2cdab073377fc74e262753b/app/utils/misc.ts#L178-L209
export function useDoubleCheck() {
  const [doubleCheck, setDoubleCheck] = useState(false);

  function getButtonProps(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const onBlur: React.FocusEventHandler<HTMLButtonElement> = () => setDoubleCheck(false);

    const onClick = doubleCheck
      ? undefined
      : (e: React.MouseEvent<HTMLButtonElement, Element>) => {
          e.preventDefault();
          setDoubleCheck(true);
        };

    return {
      ...props,
      onBlur: callAll(onBlur, props?.onBlur),
      onClick: doubleCheck
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (e: any) => {
            props?.onClick?.(e);
            onBlur(e);
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
