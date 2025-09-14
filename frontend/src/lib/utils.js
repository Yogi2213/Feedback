import { clsx } from "clsx";

export function cn(...inputs) {
  return clsx(inputs);
}

export function cva(base, config) {
  return (props) => {
    const { variants, defaultVariants } = config;
    let classes = base;
    
    if (variants && props) {
      Object.keys(variants).forEach(key => {
        const value = props[key] || defaultVariants?.[key];
        if (value && variants[key][value]) {
          classes += ` ${variants[key][value]}`;
        }
      });
    }
    
    if (props?.className) {
      classes += ` ${props.className}`;
    }
    
    return classes;
  };
}
