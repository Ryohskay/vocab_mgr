import React, { useState, useEffect } from "react";
import { languagesAPI } from "../api";
import "./LanguageManager.css";

const LanguageManager = ({ onSelectLanguage }) => {
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        iso: "",
        script: "",
        endonym: "",
        exonym_en: "",
        stage: "",
        language_family: "",
        area_used: "",
    });

    useEffect(() => {
        fetchLanguages();
    }, []);

    const fetchLanguages = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await languagesAPI.getAll();
            setLanguages(response.data);
        } catch (err) {
            setError(`Error fetching languages: ${err.message}`);
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

        if (!formData.iso || !formData.endonym) {
            setError("ISO and Endonym are required");
            return;
        }

        setLoading(true);
        setError("");

        try {
            if (editingId) {
                await languagesAPI.update(editingId, formData);
                setSuccessMessage("Language updated successfully!");
            } else {
                await languagesAPI.create(formData);
                setSuccessMessage("Language created successfully!");
            }

            setFormData({
                iso: "",
                script: "",
                endonym: "",
                exonym_en: "",
                stage: "",
                language_family: "",
                area_used: "",
            });
            setEditingId(null);
            await fetchLanguages();

            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (language) => {
        setFormData(language);
        setEditingId(language.language_id);
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({
            iso: "",
            script: "",
            endonym: "",
            exonym_en: "",
            stage: "",
            language_family: "",
            area_used: "",
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this language?"))
            return;

        setLoading(true);
        setError("");

        try {
            await languagesAPI.delete(id);
            setSuccessMessage("Language deleted successfully!");
            await fetchLanguages();
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(`Error deleting language: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="language-manager">
            <h2>Manage Languages</h2>

            <div className="form-container">
                <h3>{editingId ? "Edit Language" : "Add New Language"}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <input
                            type="text"
                            name="iso"
                            placeholder="ISO 639-2T code (required)"
                            value={formData.iso}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="endonym"
                            placeholder="Endonym (required)"
                            value={formData.endonym}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <input
                            type="text"
                            name="script"
                            placeholder="ISO 15924 script code"
                            value={formData.script}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="exonym_en"
                            placeholder="English name"
                            value={formData.exonym_en}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <input
                            type="text"
                            name="stage"
                            placeholder="Language stage (proto, classical, modern, etc.)"
                            value={formData.stage}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="language_family"
                            placeholder="Language family"
                            value={formData.language_family}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <input
                            type="text"
                            name="area_used"
                            placeholder="Geographic area"
                            value={formData.area_used}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {editingId ? "Update Language" : "Add Language"}
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
                <h3>Languages ({languages.length})</h3>

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

                {languages.length === 0 ? (
                    <p className="empty-state">
                        No languages yet. Add one to get started!
                    </p>
                ) : (
                    <div className="language-grid">
                        {languages.map((lang) => (
                            <div
                                key={lang.language_id}
                                className="language-card"
                            >
                                <div className="card-content">
                                    <h4>{lang.endonym}</h4>
                                    <p className="iso-code">ISO: {lang.iso}</p>
                                    {lang.exonym_en && (
                                        <p className="exonym">
                                            English: {lang.exonym_en}
                                        </p>
                                    )}
                                    {lang.stage && (
                                        <p className="stage">
                                            Stage: {lang.stage}
                                        </p>
                                    )}
                                    {lang.script && (
                                        <p className="script">
                                            Script: {lang.script}
                                        </p>
                                    )}
                                    {lang.language_family && (
                                        <p className="family">
                                            Family: {lang.language_family}
                                        </p>
                                    )}
                                </div>
                                <div className="card-actions">
                                    <button
                                        className="btn-small btn-info"
                                        onClick={() => onSelectLanguage(lang)}
                                    >
                                        View Vocabulary
                                    </button>
                                    <button
                                        className="btn-small btn-warning"
                                        onClick={() => handleEdit(lang)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn-small btn-danger"
                                        onClick={() =>
                                            handleDelete(lang.language_id)
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

export default LanguageManager;
