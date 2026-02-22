import { useEffect, useState } from "react";

const PAGE_SIZE = 5;

export default function Users() {
    const [page, setPage] = useState(1);
    const [data, setData] = useState({ users: [], totalPages: 1 });
    const [loading, setLoading] = useState(false);

    async function load(p = page) {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:3000/api/user?page=${p}&limit=${PAGE_SIZE}`);
            const json = await res.json();
            setData(json);
        } catch (e) {
            alert("Load users failed");
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    async function onDelete(id) {
        if (!confirm("Delete this user? (status will become DELETED)")) return;

        const res = await fetch(`http://localhost:3000/api/user/${id}`, { method: "DELETE" });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            alert(err.message || "Delete failed");
            return;
        }
        load(page);
    }

    useEffect(() => {
        load(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h2>User Management</h2>

            <div style={{ marginBottom: 10 }}>
                <button disabled={page <= 1 || loading} onClick={() => { setPage(page - 1); load(page - 1); }}>
                    Prev
                </button>
                <span style={{ margin: "0 10px" }}>
                    Page {page} / {data.totalPages || 1}
                </span>
                <button
                    disabled={page >= (data.totalPages || 1) || loading}
                    onClick={() => { setPage(page + 1); load(page + 1); }}
                >
                    Next
                </button>
            </div>

            {loading && <p>Loading...</p>}

            <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Status</th>
                        <th style={{ width: 160 }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {(data.users || []).map((u) => (
                    <tr key={u._id}>
                        <td>{u._id}</td>
                        <td>{u.username}</td>
                        <td>{u.email}</td>
                        <td>{u.firstname}</td>
                        <td>{u.lastname}</td>
                        <td>{u.status}</td>
                        <td>
                            <a href={`/users/${u._id}`}>Edit</a>{" | "}
                            <button onClick={() => onDelete(u._id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                {(!data.users || data.users.length === 0) && (
                    <tr><td colSpan="7">No users found</td></tr>
                )}
                </tbody>
            </table>
        </div>
    );
}