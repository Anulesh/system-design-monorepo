type TElmentConfig = {
  className?: string;
  insertPosition?: InsertPosition;
  tag?: string;
};

const defaulElementConfig: TElmentConfig = {
  insertPosition: "beforeend",
  tag: "div",
};

const defaultObserverConfig: IntersectionObserverInit = { threshold: 0.25 };
/**
 * @param root - Root element where we want to insert the newly created element
 * @param callback - Callback function that is called when the viewport is intersected with element
 * @param observerConfig - {@link IntersectionObserverInit} init config for Intersection Observer
 * @param elementConfig - utility attributues for HTMLElement
 */

export function intersectionObserver(
  root: HTMLElement,
  callback: IntersectionObserverCallback,
  observerConfig?: IntersectionObserverInit,
  elementConfig?: TElmentConfig
): [HTMLElement, IntersectionObserver] {
  // initialize config objects
  const { insertPosition, className, tag } = Object.assign(
    elementConfig ?? {},
    defaulElementConfig
  );
  observerConfig = Object.assign(observerConfig ?? {}, defaultObserverConfig);
  const observer = new IntersectionObserver(callback, observerConfig); // init observerconfig
  const element = document.createElement(tag); // create a target element
  let classNameList = []
  if(className) {
    classNameList = className.split(" ")
  }
  element.classList.add("intersection-observer", ...classNameList);
  root.insertAdjacentElement(insertPosition, element);
  setTimeout(() => observer.observe(element), 100);
  return [element, observer];
}
