/* eslint-disable @typescript-eslint/ban-ts-comment */
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onChange: (value: string) => void;
}

const InputCard = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const [card, setCard] = useState<any | null>();
  const fallbackRef = useRef<HTMLInputElement | null>(null);
  const domRef = ref || fallbackRef;

  const handleChange = useCallback(() => {
    if (domRef) {
      //@ts-ignore
      if (domRef.current) {
        //@ts-ignore
        const cardValue = domRef.current.value
          .replace(/\D/g, "")
          .match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/);
        props.onChange && props.onChange(cardValue[0]);
        if (cardValue) {
          //@ts-ignore
          domRef.current.value = !cardValue[2]
            ? cardValue[1]
            : `${cardValue[1]}-${cardValue[2]}${`${cardValue[3] ? `-${cardValue[3]}` : ""}`}${`${
                cardValue[4] ? `-${cardValue[4]}` : ""
              }`}`;
          //@ts-ignore
          const numbers = domRef.current.value.replace(/(\D)/g, "");
          setCard(numbers);
        }
      }
    }
  }, [domRef]);

  useEffect(() => {
    handleChange();
  }, [card, handleChange]);

  return (
    <>
      <input type="text" {...props} ref={domRef} onChange={handleChange} />
    </>
  );
});

InputCard.displayName = "InputCard";

export default InputCard;
