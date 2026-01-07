import React, { useState, useEffect } from 'react';
import { api } from './api';

const PART_OF_SPEECH_OPTIONS = [
    'noun', 'pronoun', 'adjective', 'verb', 'auxiliary verb', 'adverb',
    'conjunction', 'determiner', 'prefix', 'suffix', 'circumfix',
    'particle', 'preposition', 'postposition', 'classifier', 'enclitics'
];


function VocabularyManager() {
    const [vocabulary, setVocabulary] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [selectedLang, setSelectedLang] = useState('');
    const [form, setForm] = useState({
        lemma: '', language: '', part_of_speech: '', transliteration: '',
        definition: '', synonyms: '', tags: '', etymology_notes: '',
        origin_language: '', notes: ''
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadLanguages();
    }, []);

    useEffect(() => {
        loadVocabulary();
    }, [selectedLang]);

    const loadLanguages = async () => {
        try {
            const data = await api.languages.list();
            setLanguages(data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const loadVocabulary = async () => {
        try {
            const data = await api.vocabulary.list(selectedLang);
            setVocabulary(data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.vocabulary.update(editingId, form);
            } else {
                await api.vocabulary.create(form);
            }
            resetForm();
            loadVocabulary();
        } catch (err) {
            alert('Error saving word');
        }
    };

    const resetForm = () => {
        setForm({
            lemma: '', language: selectedLang, part_of_speech: '', transliteration: '',
            definition: '', synonyms: '', tags: '', etymology_notes: '',
            origin_language: '', notes: ''
        });
        setEditingId(null);
    };

    const handleEdit = (v) => {
        setForm(v);
        setEditingId(v.word_id);
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this entry?')) {
            try {
                await api.vocabulary.delete(id);
                loadVocabulary();
            } catch (err) {
                alert('Error deleting word');
            }
        }
    };

    return (
        <div className="glass-panel">
            <h2>Vocabulary Management</h2>
            <div style={{ marginBottom: '1rem' }}>
                <label>Filter by Language:</label>
                <select value={selectedLang} onChange={e => setSelectedLang(e.target.value)}>
                    <option value="">All Languages</option>
                    {languages.map(l => <option key={l.code} value={l.code}>{l.exonym_en}</option>)}
                </select>
            </div>

            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="form-group">
                        <label>Lemma</label>
                        <input value={form.lemma} onChange={e => setForm({ ...form, lemma: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Language</label>
                        <select value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} required>
                            <option value="">Select Language</option>
                            {languages.map(l => <option key={l.code} value={l.code}>{l.exonym_en}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Part of Speech</label>
                        <select
                            value={form.part_of_speech}
                            onChange={e => setForm({ ...form, part_of_speech: e.target.value })}
                            required
                        >
                            <option value="">Select PoS</option>
                            {PART_OF_SPEECH_OPTIONS.map(pos => (
                                <option key={pos} value={pos}>{pos}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Transliteration</label>
                        <input value={form.transliteration} onChange={e => setForm({ ...form, transliteration: e.target.value })} />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label>Definition</label>
                        <textarea value={form.definition} onChange={e => setForm({ ...form, definition: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Synonyms (comma-separated IDs)</label>
                        <input value={form.synonyms} onChange={e => setForm({ ...form, synonyms: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Tags (comma-separated)</label>
                        <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Origin Language (ISO)</label>
                        <input value={form.origin_language} onChange={e => setForm({ ...form, origin_language: e.target.value })} />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label>Etymology & Notes</label>
                        <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                    </div>
                </div>
                <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Add'} Word</button>
                {editingId && <button onClick={resetForm} style={{ marginLeft: '1rem' }}>Cancel</button>}
            </form>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Lemma</th>
                        <th>Lang</th>
                        <th>PoS</th>
                        <th>Definition</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {vocabulary.map(v => (
                        <tr key={v.word_id}>
                            <td>{v.word_id}</td>
                            <td title={v.transliteration}>{v.lemma}</td>
                            <td>{v.language}</td>
                            <td>{v.part_of_speech}</td>
                            <td>{v.definition}</td>
                            <td>
                                <button onClick={() => handleEdit(v)} style={{ padding: '0.25rem 0.5rem', marginRight: '0.5rem' }}>Edit</button>
                                <button onClick={() => handleDelete(v.word_id)} style={{ padding: '0.25rem 0.5rem', background: '#ef4444', color: 'white' }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default VocabularyManager;
