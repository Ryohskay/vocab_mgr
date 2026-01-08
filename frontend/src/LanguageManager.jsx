import React, { useState, useEffect } from 'react';
import { api } from './api';

function LanguageManager() {
    const [languages, setLanguages] = useState([]);
    const [form, setForm] = useState({ code: '', script: '', endonym: '', exonym_en: '', language_family: '', area_spoken: '' });
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        loadLanguages();
    }, []);

    const loadLanguages = async () => {
        try {
            const data = await api.languages.list();
            setLanguages(data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await api.languages.update(form.code, form);
            } else {
                await api.languages.create(form);
            }
            setForm({ code: '', script: '', endonym: '', exonym_en: '', language_family: '', area_spoken: '' });
            setEditing(false);
            loadLanguages();
        } catch (err) {
            alert('Error saving language');
        }
    };

    const handleEdit = (lang) => {
        setForm(lang);
        setEditing(true);
    };

    const handleDelete = async (code) => {
        if (confirm('Delete this language?')) {
            try {
                await api.languages.delete(code);
                loadLanguages();
            } catch (err) {
                alert('Error deleting language');
            }
        }
    };

    return (
        <div className="glass-panel">
            <h2>Languages</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label>ISO 639-3 Code <span className="required">*</span></label>
                        <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} disabled={editing} required />
                    </div>
                    <div className="form-group">
                        <label>ISO 15924 Script <span className="required">*</span></label>
                        <input value={form.script} onChange={e => setForm({ ...form, script: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Endonym <span className="required">*</span></label>
                        <input value={form.endonym} onChange={e => setForm({ ...form, endonym: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Exonym (EN) <span className="required">*</span></label>
                        <input value={form.exonym_en} onChange={e => setForm({ ...form, exonym_en: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Language Family <span className="optional">(optional)</span></label>
                        <input value={form.language_family} onChange={e => setForm({ ...form, language_family: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Area Spoken <span className="optional">(optional)</span></label>
                        <input value={form.area_spoken} onChange={e => setForm({ ...form, area_spoken: e.target.value })} />
                    </div>
                </div>
                <button type="submit" className="btn-primary">{editing ? 'Update' : 'Add'} Language</button>
                {editing && <button onClick={() => { setEditing(false); setForm({ code: '', script: '', endonym: '', exonym_en: '', language_family: '', area_spoken: '' }) }} style={{ marginLeft: '1rem' }}>Cancel</button>}
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Actions</th>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Script</th>
                        <th>Family</th>
                        <th>Area Spoken</th>
                    </tr>
                </thead>
                <tbody>
                    {languages.map(l => (
                        <tr key={l.code}>
                            <td>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => handleEdit(l)} className="btn-small">Edit</button>
                                    <button onClick={() => handleDelete(l.code)} className="btn-small btn-danger">Delete</button>
                                </div>
                            </td>
                            <td>{l.code}</td>
                            <td>{l.exonym_en} ({l.endonym})</td>
                            <td>{l.script}</td>
                            <td>{l.language_family}</td>
                            <td>{l.area_spoken}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default LanguageManager;
