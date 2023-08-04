import { Component } from "../data/component";
import { intersectionObserver } from "../data/observer.utils";

type Props<T> = {
  pageSize: number;
  load: (start: number, limit: number) => Promise<T[]>;
  templateFn: (item: T) => string;
  updateItem: (element: HTMLElement, datum: T) => HTMLElement;
};

type State = {
  start: number;
  end: number;
};
const enum ScrollDirection {
  UP = "up",
  DOWN = "down",
}
export class VirtualListComponent<T> extends Component<Props<T>, State> {
  TOP_OBSERVER_ELEMENT: HTMLElement = null;
  BOTTOM_OBSERVER_ELEMENT: HTMLElement = null;
  ELEMENTS_LIMIT = this.props.pageSize * 2;
  ELEMENTS_POOL = [];

  init(): void {
    const [topObserver] = intersectionObserver(
      this.root,
      async ([entry]) => {
        if (entry.intersectionRatio > 0.1) {
          await this.update(ScrollDirection.UP);
        }
      },
      undefined,
      { className: "top-observer" }
    );
    const [bottomObserver] = intersectionObserver(
      this.root,
      async ([entry]) => {
        if (entry.intersectionRatio > 0.1) {
          await this.update(ScrollDirection.DOWN);
        }
      },
      undefined,
      { className: "bottom-observer" }
    );
    this.TOP_OBSERVER_ELEMENT = topObserver;
    this.BOTTOM_OBSERVER_ELEMENT = bottomObserver;
  }
  async update(trigger: ScrollDirection) {
    switch (trigger) {
      case ScrollDirection.UP: {
        await this.#handleTopIntersection();
        break;
      }
      case ScrollDirection.DOWN: {
        await this.#handleBottomIntersection();
        break;
      }
    }
  }
  #handleTopIntersection = async () => {};
  #handleBottomIntersection = async () => {
    const { pageSize } = this.props;
    // number of elements rendered
    const count = this.state.start - this.state.end;
    const data = await this.props.load(this.state.end, pageSize);
    // handling the case when elements limit has not reached yet
    if (count < this.ELEMENTS_LIMIT) {
      this.#initElementsPool(data);
      this.state.end += this.props.pageSize;
    } else if (count == this.ELEMENTS_LIMIT) {
      // logic
    }
  };

  #initElementsPool(chunk: T[]): void {
    // creat a html element for each piece of data T
    const elements = chunk.map((data) => {
      const element = document.createElement("div");
      element.innerHTML = this.props.templateFn(data);
      return element.firstElementChild;
    });
    // save references to elements pool
    this.ELEMENTS_POOL.push(...elements);
    // render each element at the bottom of the list
    for (const element of elements) {
      this.element.insertBefore(
        element,
        /**
         * BOTTOM_OBSERVER_ELEMENT is cannot be initialised due to the callback
         * is setup before variable is assigned
         */
        this.BOTTOM_OBSERVER_ELEMENT ??
          document.querySelector(".bottom-observer")
      );
    }
  }
  getComponentId(): string {
    return "feed";
  }
  #genList = (items: T[]) => items.map(this.props.templateFn).join("").trim();

}
