import React, { useState, useEffect } from "react";
import { vocabularyAPI } from "../api";
import "./VocabularyManager.css";

const VocabularyManager = ({ language }) => {
    const [vocabulary, setVocabulary] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        part_of_speech: "",
        lemma: "",
        transliteration: "",
        definition: "",
        origin_lang: "",
        process: "",
        etymology_notes: "",
        tag: "",
        notes: "",
    });

    useEffect(() => {
        if (language) {
            fetchVocabulary();
        }
    }, [language]);

    const fetchVocabulary = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await vocabularyAPI.getByLanguage(
                language.language_id,
            );
            setVocabulary(response.data);
        } catch (err) {
            setError(`Error fetching vocabulary: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.part_of_speech || !formData.lemma) {
            setError("Part of speech and Lemma are required");
            return;
        }

        setLoading(true);
        setError("");

        try {
            if (editingId) {
                await vocabularyAPI.update(
                    language.language_id,
                    editingId,
                    formData,
                );
                setSuccessMessage("Vocabulary entry updated successfully!");
            } else {
                await vocabularyAPI.create(language.language_id, {
                    language_id: language.language_id,
                    ...formData,
                });
                setSuccessMessage("Vocabulary entry created successfully!");
            }

            setFormData({
                part_of_speech: "",
                lemma: "",
                transliteration: "",
                definition: "",
                origin_lang: "",
                process: "",
                etymology_notes: "",
                tag: "",
                notes: "",
            });
            setEditingId(null);
            await fetchVocabulary();

            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (entry) => {
        setFormData(entry);
        setEditingId(entry.word_id);
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({
            part_of_speech: "",
            lemma: "",
            transliteration: "",
            definition: "",
            origin_lang: "",
            process: "",
            etymology_notes: "",
            tag: "",
            notes: "",
        });
    };

    const handleDelete = async (wordId) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this vocabulary entry?",
            )
        )
            return;

        setLoading(true);
        setError("");

        try {
            await vocabularyAPI.delete(language.language_id, wordId);
            setSuccessMessage("Vocabulary entry deleted successfully!");
            await fetchVocabulary();
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(`Error deleting vocabulary: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="vocabulary-manager">
            <h2>Vocabulary for {language.endonym}</h2>

            <div className="form-container">
                <h3>{editingId ? "Edit Entry" : "Add New Vocabulary Entry"}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <select
                            name="part_of_speech"
                            value={formData.part_of_speech}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select part of speech</option>
                            <option value="noun">Noun</option>
                            <option value="propn.">Proper Noun</option>
                            <option value="v. intra.">Intransitive Verb</option>
                            <option value="v. trans.">Transitive Verb</option>
                            <option value="v. root">Verb root</option>
                            <option value="v. aux.">Auxiliary Verb</option>
                            <option value="adj.">Adjective</option>
                            <option value="pron.">Pronoun</option>
                            <option value="preposition">Preposition</option>
                            <option value="postposition">Postposition</option>
                            <option value="particle">Particle</option>
                            <option value="conjunction">Conjunction</option>
                            <option value="interjection">Interjection</option>
                            <option value="determiner">Determiner</option>
                            <option value="adverb">Adverb</option>
                            <option value="numeral">Numeral</option>
                            <option value="classifier">Classifier</option>
                            <option value="prefix">Prefix</option>
                            <option value="suffix">Suffix</option>
                            <option value="infix">Infix</option>
                            <option value="circumfix">Circumfix</option>
                            <option value="idiom">Idiom</option>
                            <option value="coverb">Coverb</option>
                            <option value="preverb">Preverb</option>
                            <option value="other">Other</option>
                        </select>
                        <input
                            type="text"
                            name="lemma"
                            placeholder="Lemma (required)"
                            value={formData.lemma}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <input
                            type="text"
                            name="transliteration"
                            placeholder="Transliteration"
                            value={formData.transliteration}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="origin_lang"
                            placeholder="Origin language"
                            value={formData.origin_lang}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <input
                            type="text"
                            name="process"
                            placeholder="Learning process"
                            value={formData.process}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="tag"
                            placeholder="Tag"
                            value={formData.tag}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row full">
                        <textarea
                            name="definition"
                            placeholder="Definition"
                            value={formData.definition}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>

                    <div className="form-row full">
                        <textarea
                            name="etymology_notes"
                            placeholder="Etymology notes"
                            value={formData.etymology_notes}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>

                    <div className="form-row full">
                        <textarea
                            name="notes"
                            placeholder="Additional notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {editingId ? "Update Entry" : "Add Entry"}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="list-container">
                <h3>Entries ({vocabulary.length})</h3>

                {error && (
                    <div className="alert alert-error">
                        <span>{error}</span>
                    </div>
                )}

                {successMessage && (
                    <div className="alert alert-success">
                        <span>{successMessage}</span>
                    </div>
                )}

                {loading && <div className="loading">Loading...</div>}

                {vocabulary.length === 0 ? (
                    <p className="empty-state">No vocabulary entries yet.</p>
                ) : (
                    <div className="vocabulary-grid">
                        {vocabulary.map((entry) => (
                            <div
                                key={entry.word_id}
                                className="vocabulary-card"
                            >
                                <div className="card-content">
                                    <h4>{entry.lemma}</h4>
                                    <p className="pos">
                                        {entry.part_of_speech}
                                    </p>
                                    {entry.transliteration && (
                                        <p className="trans">
                                            Transliteration:{" "}
                                            {entry.transliteration}
                                        </p>
                                    )}
                                    {entry.definition && (
                                        <p className="definition">
                                            Definition: {entry.definition}
                                        </p>
                                    )}
                                    {entry.origin_lang && (
                                        <p className="origin">
                                            Origin: {entry.origin_lang}
                                        </p>
                                    )}
                                    {entry.tag && (
                                        <p className="tag">
                                            Tag:{" "}
                                            <span className="badge">
                                                {entry.tag}
                                            </span>
                                        </p>
                                    )}
                                    {entry.etymology_notes && (
                                        <p className="etymology">
                                            Etymology: {entry.etymology_notes}
                                        </p>
                                    )}
                                    {entry.notes && (
                                        <p className="notes">
                                            Notes: {entry.notes}
                                        </p>
                                    )}
                                </div>
                                <div className="card-actions">
                                    <button
                                        className="btn-small btn-warning"
                                        onClick={() => handleEdit(entry)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn-small btn-danger"
                                        onClick={() =>
                                            handleDelete(entry.word_id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VocabularyManager;
