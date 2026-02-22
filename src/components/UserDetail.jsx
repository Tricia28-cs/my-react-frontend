import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UserDetail() {
    const { id } = useParams();
    const nav = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        firstname: "",
        lastname: "",
        status: "ACTIVE",
        password: ""
    });

    async function load() {
        const res = await fetch(`http://localhost:3000/api/user/${id}`);
        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Load failed");
            return;
        }

        setForm({
            username: data.username ?? "",
            email: data.email ?? "",
            firstname: data.firstname ?? "",
            lastname: data.lastname ?? "",
            status: data.status ?? "ACTIVE",
            password: ""
        });
    }

    async function onSave() {
        const body = {
            username: form.username,
            email: form.email,
            firstname: form.firstname,
            lastname: form.lastname,
            status: form.status
        };

        // only send password if user typed it
        if (form.password.trim().length > 0) body.password = form.password;

        const res = await fetch(`http://localhost:3000/api/user/${id}`, {
            method: "PATCH",
            body: JSON.stringify(body)
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            alert(data.message || "Update failed");
            return;
        }

        alert("Updated!");
        load();
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h2>Edit User</h2>

            <div style={{ display: "grid", gap: 10, maxWidth: 420 }}>
                <label>
                    Username
                    <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                </label>

                <label>
                    Email
                    <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </label>

                <label>
                    Firstname
                    <input value={form.firstname} onChange={(e) => setForm({ ...form, firstname: e.target.value })} />
                </label>

                <label>
                    Lastname
                    <input value={form.lastname} onChange={(e) => setForm({ ...form, lastname: e.target.value })} />
                </label>

                <label>
                    Status
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="SUSPENDED">SUSPENDED</option>
                        <option value="DELETED">DELETED</option>
                    </select>
                </label>

                <label>
                    New Password (optional)
                    <input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                </label>

                <div>
                    <button onClick={onSave}>Save</button>
                    <button onClick={() => nav("/users")} style={{ marginLeft: 10 }}>Back</button>
                </div>
            </div>
        </div>
    );
}