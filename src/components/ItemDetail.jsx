import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ItemDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const itemNameRef = useRef();
    const itemCategoryRef = useRef();
    const itemPriceRef = useRef();

    async function loadItem() {
        const uri = `http://localhost:3000/api/item/${id}`;
        const result = await fetch(uri);
        const data = await result.json();

        itemNameRef.current.value = data.itemName;
        itemCategoryRef.current.value = data.itemCategory
        itemPriceRef.current.value = data.itemPrice;
    }

    async function onUpdate() {
        const body = {
            name: itemNameRef.current.value,
            category: itemCategoryRef.current.value,
            price: itemPriceRef.current.value
        };

        const uri = `http://localhost:3000/api/item/${id}`;
        const result = await fetch(uri, {
            method: "PATCH",
            body: JSON.stringify(body)
        });

        if (result.status === 200) {
            alert("Updated!");
            loadItem();
        } else {
            const err = await result.json().catch(() => ({}));
            alert(err.message || "Update failed");
        }
    }

    async function onDelete() {
        const ok = confirm("Delete this item?");
        if (!ok) return;

        const uri = `http://localhost:3000/api/item/${id}`;
        const result = await fetch(uri, { method: "DELETE" });

        if (result.ok) {
            alert("Deleted!");
            navigate("/items");
        } else {
            const err = await result.json().catch(() => ({}));
            alert(err.message || "Delete failed");
        }
    }

    useEffect(() => {
        loadItem();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h2>Edit Item</h2>

            <table>
                <tbody>
                    <tr>
                        <th style={{ textAlign: "left" }}>Name</th>
                        <td style={{ paddingLeft: 20 }}>
                            <input type="text" ref={itemNameRef} />
                        </td>
                    </tr>
                    <tr>
                        <th style={{ textAlign: "left" }}>Category</th>
                        <td style={{ paddingLeft: 20 }}>
                            <select ref={itemCategoryRef} defaultValue="">
                                <option>Stationary</option>
                                <option>Kitchenware</option>
                                <option>Appliance</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th style={{ textAlign: "left" }}>Price</th>
                        <td style={{ paddingLeft: 20 }}>
                            <input type="text" ref={itemPriceRef} />
                        </td>
                    </tr>
                </tbody>
            </table>

            <hr />
            <button onClick={onUpdate}>Update</button>
            <button onClick={onDelete} style={{ marginLeft: 10 }}>Delete</button>
            <button onClick={() => navigate("/items")} style={{ marginLeft: 10 }}>Back</button>
        </div>
    );
}