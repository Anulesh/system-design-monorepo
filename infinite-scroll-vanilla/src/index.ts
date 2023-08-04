import { db } from "./data/db.utils";
import { FeedItem, getFeedItem } from "./data/utils";
import { LazyListComponent } from "./lazy-list/lazy-list";
import { ListComponent } from "./list/list";
import { VirtualListComponent } from "./virtual-list/virtual-list";
const templateFn = ({ name, description, url }: FeedItem) =>
  `<section class="feed__item">
  <img class="feed__item__img" alt="av" src="${url}" />
  <div class="feed__item__description">
  <h2 class="h2-header">${name}</h2>
  <p class="p-text">${description}</p>
  </div>
  </section`.trim();

const updateItem = (
  element: HTMLElement,
  { name, description, url }: FeedItem
) => {
  element.style.display = null;
  element.querySelector<HTMLImageElement>(".feed__item__img").src = url;
  element.querySelector("h2").innerHTML = name;
  element.querySelector("p").innerHTML = description;
  return element;
};
const DB_SIZE = 1000;
const root: HTMLDivElement = document.getElementById("`app") as HTMLDivElement;
const DB = db(DB_SIZE, DB_SIZE, getFeedItem);
const feed = new VirtualListComponent<FeedItem>(root, {
  templateFn,
  load: (start, limit) => DB.load(start, limit).then((cursor) => cursor.chunk),
  pageSize: 10,
  updateItem,
});
feed.render();
