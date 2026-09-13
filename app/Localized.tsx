"use client";

import { Children, cloneElement, isValidElement, useSyncExternalStore, useCallback, type ReactNode, type FormEvent } from "react";
import { translate, type Language } from "./translations";

export const LANGUAGE_STORAGE_KEY = "linetech-language-v1";
export const LANGUAGE_EVENT = "linetech:languagechange";
let fallbackLanguage: Language = "en";

function readLanguage(): Language {
  try { const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY); return saved === "ar" ? "ar" : saved === "en" ? "en" : fallbackLanguage; }
  catch { return fallbackLanguage; }
}
function subscribe(callback: () => void) {
  window.addEventListener(LANGUAGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(LANGUAGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
export function useLanguage() {
  return useSyncExternalStore(subscribe, readLanguage, () => "en" as Language);
}
export function useTranslation() {
  const language = useLanguage();
  return useCallback((value: string) => translate(value, language), [language]);
}
export function setLanguage(language: Language) {
  fallbackLanguage = language;
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.cookie = `${LANGUAGE_STORAGE_KEY}=${language}; Path=/; Max-Age=31536000; SameSite=Lax`;
  } catch {}
  window.dispatchEvent(new CustomEvent(LANGUAGE_EVENT, { detail: { language } }));
}

// Translate React output, never DOM nodes owned by React. Original props stay
// intact, so language changes and dynamic updates cannot restore stale text.
function localize(node: ReactNode, language: Language): ReactNode {
  if (typeof node === "string") return translate(node, language);
  if (Array.isArray(node)) return Children.map(node, child => localize(child, language));
  if (!isValidElement<Record<string, unknown>>(node)) return node;
  const props = node.props;
  if (props["data-no-translate"] || props.translate === "no" ||
      ["script", "style", "code", "pre"].includes(String(node.type))) return node;
  const translated: Record<string, unknown> = {};
  for (const key of ["placeholder", "title", "aria-label", "aria-description", "aria-valuetext", "alt"]) {
    if (typeof props[key] === "string") translated[key] = translate(props[key], language);
  }
  if (["input", "select", "textarea"].includes(String(node.type)) && props.required) {
    type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    translated.onInvalid = (event: FormEvent<Control>) => {
      const control = event.currentTarget;
      control.setCustomValidity("");
      const message = control.validity.valueMissing
        ? props.type === "checkbox" ? "Please accept the terms to continue." : "Please fill out this field."
        : control.validity.typeMismatch ? "Please enter a valid email address." : "Please check this value.";
      control.setCustomValidity(translate(message, language));
      (props.onInvalid as ((event: FormEvent<Control>) => void) | undefined)?.(event);
    };
    translated.onInput = (event: FormEvent<Control>) => {
      event.currentTarget.setCustomValidity("");
      (props.onInput as ((event: FormEvent<Control>) => void) | undefined)?.(event);
    };
  }
  // Option values are identifiers, not labels. Keep them stable in both languages.
  if (node.type === "option" && props.value === undefined && typeof props.children === "string") {
    translated.value = props.children;
  }
  // Textarea values and all input values belong to the user.
  if (props.children !== undefined && node.type !== "textarea") {
    translated.children = localize(props.children as ReactNode, language);
  }
  return cloneElement(node, translated);
}
export default function Localized({ children }: { children: ReactNode }) {
  return localize(children, useLanguage());
}
