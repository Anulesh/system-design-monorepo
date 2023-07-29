import { Component } from "../data/component";
import { intersectionObserver } from "../data/observer.utils";

type Props<T> = {
  pageSize: number;
  load: (start: number, limit: number) => Promise<T[]>;
  templateFn: (item: T) => string;
};
type State = {
  end: number;
};
export class LazyListComponent<T> extends Component<Props<T>, State> {
  State = {
    end: 0,
  };
  init(): void {
    intersectionObserver(this.root, async ([entry]) => {
      if (entry.intersectionRatio > 0.1) {
        const { end } = this.State;
        const data = await this.props.load(end, this.props.pageSize);
        this.update(data);
      }
    });
  }
  update(items: T[]) {
    this.State.end += this.props.pageSize;
    const content = this.#genList(items);
    this.element.insertAdjacentHTML("beforeend", content);
  }

  getComponentId(): string {
    return "feed";
  }
  #genList = (items: T[]) => items.map(this.props.templateFn).join("").trim();
}
