import { forwardRef, useRef, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputExpiry = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const [card, setCard] = useState<any | null>();
  const fallbackRef = useRef<HTMLInputElement | null>(null);
  const domRef = ref || fallbackRef;

  const expriy_format = (value: string) => {
    const expdate = value;
    const expDateFormatter =
      expdate.replace(/\//g, "").substring(0, 2) +
      (expdate.length > 2 ? "/" : "") +
      expdate.replace(/\//g, "").substring(2, 4);

    return expDateFormatter;
  };

  return (
    <>
      <input
        type="text"
        {...props}
        value={expriy_format((props.value as string) || "")}
        ref={domRef}
      />
    </>
  );
});

InputExpiry.displayName = "InputCard";

export default InputExpiry;
