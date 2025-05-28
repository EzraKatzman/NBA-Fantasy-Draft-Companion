import { fetchItems, type Item } from "@/api";


export default async function Home() {
  const items: Item[] = await fetchItems();

  return (
    <div className="">
      {items.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
