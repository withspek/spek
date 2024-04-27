"use client";

import React from "react";
import NProgress from "nprogress";

export type LoaderProps = {
  color?: string;
  initialPosition?: number;
  crawlSpeed?: number;
  height?: number;
  crawl?: boolean;
  showSpinner?: boolean;
  easing?: string;
  speed?: number;
  shadow?: string | false;
  template?: string;
  zIndex?: number;
  showAtBottom?: boolean;
};

export const ProgressBar = ({
  color: propColor,
  height: propHeight,
  showSpinner,
  crawl,
  crawlSpeed,
  initialPosition,
  easing,
  speed,
  shadow,
  template,
  zIndex = 1600,
  showAtBottom = false,
}: LoaderProps): JSX.Element => {
  const defaultColor = "var(--alabaster-100)";
  const defaultHeight = 3;

  const color = propColor ?? defaultColor;
  const height = propHeight ?? defaultHeight;

  // Any falsy (except undefined) will disable the shadow
  const boxShadow =
    !shadow && shadow !== undefined
      ? ""
      : shadow
        ? `box-shadow:${shadow}`
        : `box-shadow:0 0 10px ${color},0 0 5px ${color}`;

  // Check if to show at bottom
  const positionStyle = showAtBottom ? "bottom: 0;" : "top: 0;";
  const spinnerPositionStyle = showAtBottom ? "bottom: 15px;" : "top: 15px;";

  /**
   * CSS Styles for the NextTopLoader
   */
  const styles = (
    <style>
      {`#nprogress{pointer-events:none}#nprogress .bar{background:${color};position:fixed;z-index:${zIndex};${positionStyle}left:0;width:100%;height:${height}px}#nprogress .peg{display:block;position:absolute;right:0;width:100px;height:100%;${boxShadow};opacity:1;-webkit-transform:rotate(3deg) translate(0px,-4px);-ms-transform:rotate(3deg) translate(0px,-4px);transform:rotate(3deg) translate(0px,-4px)}#nprogress .spinner{display:block;position:fixed;z-index:${zIndex};${spinnerPositionStyle}right:15px}#nprogress .spinner-icon{width:18px;height:18px;box-sizing:border-box;border:2px solid transparent;border-top-color:${color};border-left-color:${color};border-radius:50%;-webkit-animation:nprogress-spinner 400ms linear infinite;animation:nprogress-spinner 400ms linear infinite}.nprogress-custom-parent{overflow:hidden;position:relative}.nprogress-custom-parent #nprogress .bar,.nprogress-custom-parent #nprogress .spinner{position:absolute}@-webkit-keyframes nprogress-spinner{0%{-webkit-transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg)}}@keyframes nprogress-spinner{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}
    </style>
  );

  /**
   * Convert the url to Absolute URL based on the current window location.
   * @param url {string}
   * @returns {string}
   */
  const toAbsoluteURL = (url: string): string => {
    return new URL(url, window.location.href).href;
  };

  /**
   * Check if it is hash anchor or same page anchor
   * @param currentUrl {string} Current Url Location
   * @param newUrl {string} New Url detected with each anchor
   * @returns {boolean}
   */
  const isHashAnchor = (currentUrl: string, newUrl: string): boolean => {
    const current = new URL(toAbsoluteURL(currentUrl));
    const next = new URL(toAbsoluteURL(newUrl));
    return current.href.split("#")[0] === next.href.split("#")[0];
  };

  /**
   * Check if it is Same Host name
   * @param currentUrl {string} Current Url Location
   * @param newUrl {string} New Url detected with each anchor
   * @returns {boolean}
   */
  const isSameHostName = (currentUrl: string, newUrl: string): boolean => {
    const current = new URL(toAbsoluteURL(currentUrl));
    const next = new URL(toAbsoluteURL(newUrl));
    return (
      current.hostname.replace(/^www\./, "") ===
      next.hostname.replace(/^www\./, "")
    );
  };

  React.useEffect((): ReturnType<React.EffectCallback> => {
    NProgress.configure({
      showSpinner: showSpinner ?? true,
      trickle: crawl ?? true,
      trickleSpeed: crawlSpeed ?? 200,
      minimum: initialPosition ?? 0.08,
      easing: easing ?? "ease",
      speed: speed ?? 200,
      template:
        template ??
        '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>',
    });

    /**
     * Check if the Current Url is same as New Url
     * @param currentUrl {string}
     * @param newUrl {string}
     * @returns {boolean}
     */
    function isAnchorOfCurrentUrl(currentUrl: string, newUrl: string): boolean {
      const currentUrlObj = new URL(currentUrl);
      const newUrlObj = new URL(newUrl);
      // Compare hostname, pathname, and search parameters
      if (
        currentUrlObj.hostname === newUrlObj.hostname &&
        currentUrlObj.pathname === newUrlObj.pathname &&
        currentUrlObj.search === newUrlObj.search
      ) {
        // Check if the new URL is just an anchor of the current URL page
        const currentHash = currentUrlObj.hash;
        const newHash = newUrlObj.hash;
        return (
          currentHash !== newHash &&
          currentUrlObj.href.replace(currentHash, "") ===
            newUrlObj.href.replace(newHash, "")
        );
      }
      return false;
    }

    var nProgressClass: NodeListOf<HTMLHtmlElement> =
      document.querySelectorAll("html");

    const removeNProgressClass = (): void =>
      nProgressClass.forEach((el: Element) =>
        el.classList.remove("nprogress-busy")
      );

    /**
     * Find the closest anchor to trigger
     * @param element {HTMLElement | null}
     * @returns element {Element}
     */
    function findClosestAnchor(
      element: HTMLElement | null
    ): HTMLAnchorElement | null {
      while (element && element.tagName.toLowerCase() !== "a") {
        element = element.parentElement;
      }
      return element as HTMLAnchorElement;
    }

    /**
     *
     * @param event {MouseEvent}
     * @returns {void}
     */
    function handleClick(event: MouseEvent): void {
      try {
        const target = event.target as HTMLElement;
        const anchor = findClosestAnchor(target);
        const newUrl = anchor?.href;
        if (newUrl) {
          const currentUrl = window.location.href;
          // const newUrl = (anchor as HTMLAnchorElement).href;
          const isExternalLink =
            (anchor as HTMLAnchorElement).target === "_blank";

          // Check for Special Schemes
          const isSpecialScheme = [
            "tel:",
            "mailto:",
            "sms:",
            "blob:",
            "download:",
          ].some((scheme) => newUrl.startsWith(scheme));

          const isAnchor: boolean = isAnchorOfCurrentUrl(currentUrl, newUrl);
          const notSameHost = !isSameHostName(
            window.location.href,
            anchor.href
          );
          if (notSameHost) {
            return;
          }
          if (
            newUrl === currentUrl ||
            isAnchor ||
            isExternalLink ||
            isSpecialScheme ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.altKey ||
            isHashAnchor(window.location.href, anchor.href) ||
            !toAbsoluteURL(anchor.href).startsWith("http")
          ) {
            NProgress.start();
            NProgress.done();
            removeNProgressClass();
          } else {
            NProgress.start();
          }
        }
      } catch (err) {
        // Log the error in development only!
        // console.log('NextTopLoader error: ', err);
        NProgress.start();
        NProgress.done();
      }
    }

    /**
     * Complete TopLoader Progress on adding new entry to history stack
     * @param {History}
     * @returns {void}
     */
    ((history: History): void => {
      const pushState = history.pushState;
      history.pushState = (...args) => {
        NProgress.done();
        removeNProgressClass();
        return pushState.apply(history, args);
      };
    })((window as Window).history);

    /**
     * Complete TopLoader Progress on replacing current entry of history stack
     * @param {History}
     * @returns {void}
     */
    ((history: History): void => {
      const replaceState = history.replaceState;
      history.replaceState = (...args) => {
        NProgress.done();
        removeNProgressClass();
        return replaceState.apply(history, args);
      };
    })((window as Window).history);

    function handlePageHide(): void {
      NProgress.done();
      removeNProgressClass();
    }

    /**
     * Handle Browser Back and Forth Navigation
     * @returns {void}
     */
    function handleBackAndForth(): void {
      NProgress.done();
    }

    // Add the global click event listener
    window.addEventListener("popstate", handleBackAndForth);
    document.addEventListener("click", handleClick);
    window.addEventListener("pagehide", handlePageHide);

    // Clean up the global click event listener when the component is unmounted
    return (): void => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("popstate", handleBackAndForth);
    };
  }, []);

  return styles;
};
