import React, { useState } from "react";
import LanguageManager from "./components/LanguageManager";
import VocabularyManager from "./components/VocabularyManager";
import "./App.css";

function App() {
    const [activeTab, setActiveTab] = useState("languages");
    const [selectedLanguage, setSelectedLanguage] = useState(null);

    const handleSelectLanguage = (language) => {
        setSelectedLanguage(language);
        setActiveTab("vocabulary");
    };

    return (
        <div className="App">
            <header className="app-header">
                <h1>🌍 Vocabulary Manager</h1>
                <p>Manage languages and their vocabulary</p>
            </header>

            <div className="container">
                <nav className="tabs">
                    <button
                        className={`tab-button ${activeTab === "languages" ? "active" : ""}`}
                        onClick={() => {
                            setActiveTab("languages");
                        }}
                    >
                        Languages
                    </button>
                    <button
                        className={`tab-button ${activeTab === "vocabulary" ? "active" : ""}`}
                        onClick={() => {
                            setActiveTab("vocabulary");
                        }}
                        disabled={!selectedLanguage}
                    >
                        Vocabulary{" "}
                        {selectedLanguage
                            ? `(${selectedLanguage.endonym})`
                            : ""}
                    </button>
                </nav>

                {activeTab === "languages" ? (
                    <LanguageManager onSelectLanguage={handleSelectLanguage} />
                ) : (
                    selectedLanguage && (
                        <VocabularyManager language={selectedLanguage} />
                    )
                )}
            </div>
        </div>
    );
}

export default App;
