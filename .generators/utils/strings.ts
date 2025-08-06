export function snakeToPascal(str: string) {
  return str
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

export function kebabToPascal(str: string) {
  return str
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

export function kebabToCamel(str: string) {
  const r = str
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");

  return r.charAt(0).toLowerCase() + r.slice(1);
}

/**
TODO: Implement and use below structure to represent the names of the tokens in generators
 **/

type TokenName = {
  snake: string;
  get camel(): string;
  get pascal(): string;
  get kebab(): string;
}

export function tokenize(str: string): TokenName {
  return {
    snake: str,
    get camel() {
      return kebabToCamel(str);
    },
    get pascal() {
      return kebabToPascal(str);
    },
    get kebab() {
      return str;
    }
  }
}
