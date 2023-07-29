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

  init(): void {
    const [topObserver] = intersectionObserver(this.root, async ([entry]) => {
      if (entry.intersectionRatio > 0.1) {
        await this.update(ScrollDirection.UP);
      }
    });
    const [bottomObserver] = intersectionObserver(
      this.root,
      async ([entry]) => {
        if (entry.intersectionRatio > 0.1) {
          await this.update(ScrollDirection.DOWN);
        }
      }
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
  #handleBottomIntersection = async () => {};

  getComponentId(): string {
    return "feed";
  }
}
