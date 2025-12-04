import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Rate relative to USD
}

export const currencies: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1 },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79 },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", rate: 149.5 },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", rate: 1.36 },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 1.53 },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc", rate: 0.88 },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", rate: 7.24 },
  { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 83.5 },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", rate: 3.67 },
];

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceInUSD: number) => string;
  convertPrice: (priceInUSD: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCY_STORAGE_KEY = "luxstay-currency";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(currencies[0]!);

  // Load currency from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (stored) {
      const found = currencies.find((c) => c.code === stored);
      if (found) {
        setCurrencyState(found);
      }
    }
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency.code);
  };

  const convertPrice = (priceInUSD: number): number => {
    return priceInUSD * currency.rate;
  };

  const formatPrice = (priceInUSD: number): string => {
    const converted = convertPrice(priceInUSD);
    
    // Format with appropriate decimal places
    const formatted = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: currency.code === "JPY" ? 0 : 2,
      maximumFractionDigits: currency.code === "JPY" ? 0 : 2,
    }).format(converted);

    return `${currency.symbol}${formatted}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
