export type OpenPayCard = {
  card_number: string;
  holder_name: string;
  expiration_year: string;
  expiration_month: string;
  cvv2: string;
  address: {
    city: string;
    line3?: string;
    postal_code: string;
    line1: string;
    line2?: string;
    state: string;
    country_code: string;
  };
};

export type CardTypes = { [key: string]: CardType };

type CardType = {
  name: string;
  regx: RegExp;
  length: number[];
  icon: string;
  accept: boolean;
};
