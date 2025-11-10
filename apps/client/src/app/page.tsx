import { getLoanItems } from "@/lib/actions";

export default async function Home() {
  const data = await getLoanItems();

  return <div></div>;
}
