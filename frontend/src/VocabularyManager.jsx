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
    const [searchTerm, setSearchTerm] = useState('');
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
        if (selectedLang) {
            loadVocabulary();
        } else if (languages.length > 0) {
            setSelectedLang(languages[0].code);
        }
    }, [selectedLang, languages]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (selectedLang) {
                loadVocabulary();
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const loadLanguages = async () => {
        try {
            const data = await api.languages.list();
            setLanguages(data || []);
            if (data && data.length > 0 && !selectedLang) {
                setSelectedLang(data[0].code);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const loadVocabulary = async () => {
        try {
            const data = await api.vocabulary.list(selectedLang, searchTerm);
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
        setForm({
            ...v,
            notes: v.notes || '',
            etymology_notes: v.etymology_notes || '',
        });
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
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Language Filter</label>
                    <select value={selectedLang} onChange={e => setSelectedLang(e.target.value)}>
                        {languages.map(l => <option key={l.code} value={l.code}>{l.exonym_en} ({l.code})</option>)}
                    </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '300px' }}>
                    <label>Search Vocabulary</label>
                    <input
                        type="text"
                        placeholder="Search by word, transliteration, definition, origin, or tags..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div className="form-group">
                        <label>Lemma <span className="required">*</span></label>
                        <input value={form.lemma} onChange={e => setForm({ ...form, lemma: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Language <span className="required">*</span></label>
                        <select value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} required>
                            <option value="">Select Language</option>
                            {languages.map(l => <option key={l.code} value={l.code}>{l.exonym_en}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Part of Speech <span className="required">*</span></label>
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
                        <label>Transliteration <span className="optional">(optional)</span></label>
                        <input value={form.transliteration} onChange={e => setForm({ ...form, transliteration: e.target.value })} />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label>Definition <span className="required">*</span></label>
                        <textarea value={form.definition} onChange={e => setForm({ ...form, definition: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Synonyms <span className="optional">(optional)</span></label>
                        <input value={form.synonyms} placeholder="comma-separated IDs" onChange={e => setForm({ ...form, synonyms: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Tags <span className="optional">(optional)</span></label>
                        <input value={form.tags} placeholder="comma-separated" onChange={e => setForm({ ...form, tags: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Origin Language <span className="optional">(optional)</span></label>
                        <input value={form.origin_language} placeholder="ISO code" onChange={e => setForm({ ...form, origin_language: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Etymology Notes <span className="optional">(optional)</span></label>
                        <input value={form.etymology_notes} onChange={e => setForm({ ...form, etymology_notes: e.target.value })} />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label>General Notes <span className="optional">(optional)</span></label>
                        <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                    </div>
                </div>
                <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Add'} Word</button>
                {editingId && <button type="button" onClick={resetForm} style={{ marginLeft: '1rem' }}>Cancel</button>}
            </form>

            <div className="table-container shadow-sm" style={{ overflowX: 'auto', borderRadius: '8px' }}>
                <table style={{ minWidth: '1200px' }}>
                    <thead>
                        <tr>
                            <th>Actions</th>
                            <th>ID</th>
                            <th>Lemma</th>
                            <th>Translit.</th>
                            <th>PoS</th>
                            <th>Definition</th>
                            <th>Origin</th>
                            <th>Synonyms</th>
                            <th>Tags</th>
                            <th>Etymology</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vocabulary.map(v => (
                            <tr key={v.word_id}>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => handleEdit(v)} className="btn-small">Edit</button>
                                        <button onClick={() => handleDelete(v.word_id)} className="btn-small btn-danger">Delete</button>
                                    </div>
                                </td>
                                <td>{v.word_id}</td>
                                <td><strong>{v.lemma}</strong></td>
                                <td>{v.transliteration}</td>
                                <td><span className="badge">{v.part_of_speech}</span></td>
                                <td style={{ maxWidth: '300px' }}>{v.definition}</td>
                                <td>{v.origin_language}</td>
                                <td>{v.synonyms}</td>
                                <td>{v.tags}</td>
                                <td>{v.etymology_notes}</td>
                                <td>{v.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default VocabularyManager;
