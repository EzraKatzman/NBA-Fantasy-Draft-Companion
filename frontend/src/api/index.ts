
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface Item {
    id: number;
    name: string;
}

export async function fetchItems(): Promise<Item[]> {
    const res = await fetch(`${API_URL}/items`);

    if (!res.ok) {
        throw new Error("Failed to fetch items");
    }
    
    return res.json()
}