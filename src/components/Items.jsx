import { useEffect, useRef, useState } from "react";

const PAGE_SIZE = 5;

export default function Items() {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1); // 1-based
    const [loading, setLoading] = useState(false);

    const itemNameRef = useRef();
    const itemCategoryRef = useRef();
    const itemPriceRef = useRef();

    async function loadItems(newPage = page) {
        try {
            setLoading(true);
            const skip = (newPage - 1) * PAGE_SIZE;
            const uri = `http://localhost:3000/api/item?skip=${skip}&limit=${PAGE_SIZE}`;
            const response = await fetch(uri);
            const data = await response.json();
            setItems(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log("loadItems error:", err);
            alert("Loading items failed");
        } finally {
            setLoading(false);
        }
    }

    async function onItemSave() {
        try {
            const uri = "http://localhost:3000/api/item";
            const body = {
                name: itemNameRef.current.value,
                category: itemCategoryRef.current.value,
                price: itemPriceRef.current.value
            };
            const result = await fetch(uri, {
                method: "POST",
                body: JSON.stringify(body)
            });

            if (!result.ok) {
                const err = await result.json().catch(() => ({}));
                alert(err.message || "Insert failed");
                return;
            }

            // clear inputs
            itemNameRef.current.value = "";
            itemPriceRef.current.value = "";
            itemCategoryRef.current.value = "Stationary";

            // reload current page
            loadItems(page);
        } catch (err) {
            console.log("onItemSave error:", err);
            alert("Insert failed");
        }
    }

    async function onDelete(itemId) {
        const ok = confirm("Delete this item?");
        if (!ok) return;

        try {
            const uri = `http://localhost:3000/api/item/${itemId}`;
            const result = await fetch(uri, { method: "DELETE" });

            if (!result.ok) {
                const err = await result.json().catch(() => ({}));
                alert(err.message || "Delete failed");
                return;
            }

            // If page becomes empty after delete, go back a page (simple UX)
            if (items.length === 1 && page > 1) {
                const prev = page - 1;
                setPage(prev);
                loadItems(prev);
            } else {
                loadItems(page);
            }
        } catch (err) {
            console.log("onDelete error:", err);
            alert("Delete failed");
        }
    }

    function nextPage() {
        const next = page + 1;
        setPage(next);
        loadItems(next);
    }

    function prevPage() {
        if (page === 1) return;
        const prev = page - 1;
        setPage(prev);
        loadItems(prev);
    }

    useEffect(() => {
        loadItems(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h2>Items (Pagination)</h2>

            <div style={{ marginBottom: 10 }}>
                <button onClick={prevPage} disabled={page === 1 || loading}>Prev</button>
                <span style={{ margin: "0 10px" }}>Page: {page}</span>
                <button onClick={nextPage} disabled={loading}>Next</button>
            </div>

            {loading && <p>Loading...</p>}

            <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th style={{ width: 160 }}>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {items.map((item, index) => (
                        <tr key={item._id || index}>
                            <td>{item._id}</td>
                            <td>{item.itemName}</td>
                            <td>{item.itemCategory}</td>
                            <td>{item.itemPrice}</td>
                            <td>{item.status}</td>
                            <td>
                                <a href={`/items/${item._id}`}>Edit</a>
                                {" | "}
                                <button onClick={() => onDelete(item._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}

                    {/* Add new item row */}
                    <tr>
                        <td>-</td>
                        <td><input type="text" ref={itemNameRef} placeholder="Item name" /></td>
                        <td>
                            <select ref={itemCategoryRef} defaultValue="">
                                <option>Stationary</option>
                                <option>Kitchenware</option>
                                <option>Appliance</option>
                            </select>
                        </td>
                        <td><input type="text" ref={itemPriceRef} placeholder="" /></td>
                        <td>ACTIVE</td>
                        <td><button onClick={onItemSave}>Add Item</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}