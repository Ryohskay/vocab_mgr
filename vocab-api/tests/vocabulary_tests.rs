use vocab_api::models::VocabularyEntry;

// Helper function to create a test vocabulary entry
fn create_test_entry() -> VocabularyEntry {
    VocabularyEntry {
        word_id: None,
        language_id: 1,
        part_of_speech: "noun".to_string(),
        lemma: "test_word".to_string(),
        transliteration: Some("test_trans".to_string()),
        origin_lang: Some("English".to_string()),
        process: Some("learning".to_string()),
        etymology_notes: Some("from test".to_string()),
        tag: Some("common".to_string()),
        notes: Some("test note".to_string()),
    }
}

#[test]
fn test_vocabulary_entry_creation() {
    let entry = create_test_entry();
    assert_eq!(entry.lemma, "test_word");
    assert_eq!(entry.language_id, 1);
    assert_eq!(entry.part_of_speech, "noun");
    assert_eq!(entry.word_id, None);
}

#[test]
fn test_vocabulary_entry_with_minimal_fields() {
    let entry = VocabularyEntry {
        word_id: Some(1),
        language_id: 2,
        part_of_speech: "verb".to_string(),
        lemma: "run".to_string(),
        transliteration: None,
        origin_lang: None,
        process: None,
        etymology_notes: None,
        tag: None,
        notes: None,
    };
    
    assert_eq!(entry.word_id, Some(1));
    assert_eq!(entry.lemma, "run");
    assert!(entry.transliteration.is_none());
}

#[test]
fn test_vocabulary_entry_serialization() {
    let entry = create_test_entry();
    let json = serde_json::to_string(&entry).expect("Failed to serialize");
    
    assert!(json.contains("\"lemma\":\"test_word\""));
    assert!(json.contains("\"language_id\":1"));
    assert!(json.contains("\"part_of_speech\":\"noun\""));
}

#[test]
fn test_vocabulary_entry_deserialization() {
    let json = r#"{
        "word_id": null,
        "language_id": 1,
        "part_of_speech": "adjective",
        "lemma": "beautiful",
        "transliteration": "byu-tiful",
        "origin_lang": "English",
        "process": "learning",
        "etymology_notes": "from Old French",
        "tag": "common",
        "notes": "means pleasing to look at"
    }"#;
    
    let entry: VocabularyEntry = serde_json::from_str(json)
        .expect("Failed to deserialize");
    
    assert_eq!(entry.lemma, "beautiful");
    assert_eq!(entry.part_of_speech, "adjective");
    assert_eq!(entry.language_id, 1);
    assert_eq!(entry.transliteration, Some("byu-tiful".to_string()));
}

#[test]
fn test_multiple_entries_creation() {
    let entries = vec![
        VocabularyEntry {
            word_id: None,
            language_id: 1,
            part_of_speech: "noun".to_string(),
            lemma: "apple".to_string(),
            transliteration: Some("ap-ul".to_string()),
            origin_lang: Some("English".to_string()),
            process: Some("learning".to_string()),
            etymology_notes: None,
            tag: Some("fruit".to_string()),
            notes: None,
        },
        VocabularyEntry {
            word_id: None,
            language_id: 1,
            part_of_speech: "noun".to_string(),
            lemma: "orange".to_string(),
            transliteration: Some("or-inj".to_string()),
            origin_lang: Some("English".to_string()),
            process: Some("learning".to_string()),
            etymology_notes: None,
            tag: Some("fruit".to_string()),
            notes: None,
        },
    ];

    assert_eq!(entries.len(), 2);
    assert_eq!(entries[0].lemma, "apple");
    assert_eq!(entries[1].lemma, "orange");
    
    for entry in &entries {
        assert_eq!(entry.tag, Some("fruit".to_string()));
    }
}

#[test]
fn test_vocabulary_entry_update() {
    let mut entry = create_test_entry();
    
    entry.lemma = "updated_word".to_string();
    entry.part_of_speech = "verb".to_string();
    entry.notes = Some("updated note".to_string());
    
    assert_eq!(entry.lemma, "updated_word");
    assert_eq!(entry.part_of_speech, "verb");
    assert_eq!(entry.notes, Some("updated note".to_string()));
}

#[test]
fn test_vocabulary_entry_partial_update() {
    let mut entry = create_test_entry();
    let original_language_id = entry.language_id;
    
    entry.notes = Some("new note".to_string());
    
    assert_eq!(entry.language_id, original_language_id);
    assert_eq!(entry.notes, Some("new note".to_string()));
}

#[test]
fn test_vocabulary_entry_clone() {
    let entry1 = create_test_entry();
    let entry2 = VocabularyEntry {
        word_id: entry1.word_id,
        language_id: entry1.language_id,
        part_of_speech: entry1.part_of_speech.clone(),
        lemma: entry1.lemma.clone(),
        transliteration: entry1.transliteration.clone(),
        origin_lang: entry1.origin_lang.clone(),
        process: entry1.process.clone(),
        etymology_notes: entry1.etymology_notes.clone(),
        tag: entry1.tag.clone(),
        notes: entry1.notes.clone(),
    };
    
    assert_eq!(entry1.lemma, entry2.lemma);
    assert_eq!(entry1.language_id, entry2.language_id);
}

#[test]
fn test_vocabulary_entry_with_special_characters() {
    let entry = VocabularyEntry {
        word_id: None,
        language_id: 1,
        part_of_speech: "noun".to_string(),
        lemma: "café".to_string(),
        transliteration: Some("ka-fay".to_string()),
        origin_lang: Some("French".to_string()),
        process: Some("learning".to_string()),
        etymology_notes: Some("from Italian \"caffè\"".to_string()),
        tag: Some("food".to_string()),
        notes: Some("Has accent: é".to_string()),
    };
    
    assert!(entry.lemma.contains("café"));
    assert!(entry.etymology_notes.as_ref().unwrap().contains("caffè"));
}

#[test]
fn test_vocabulary_entry_empty_optional_fields() {
    let entry = VocabularyEntry {
        word_id: None,
        language_id: 1,
        part_of_speech: "noun".to_string(),
        lemma: "test".to_string(),
        transliteration: None,
        origin_lang: None,
        process: None,
        etymology_notes: None,
        tag: None,
        notes: None,
    };
    
    assert!(entry.transliteration.is_none());
    assert!(entry.origin_lang.is_none());
    assert!(entry.process.is_none());
    assert!(entry.etymology_notes.is_none());
    assert!(entry.tag.is_none());
    assert!(entry.notes.is_none());
}

#[test]
fn test_vocabulary_entry_different_languages() {
    let entries = vec![
        ("Japanese", 1),
        ("Spanish", 2),
        ("French", 3),
        ("German", 4),
        ("Chinese", 5),
    ];

    for (idx, (lang, lang_id)) in entries.iter().enumerate() {
        let entry = VocabularyEntry {
            word_id: Some((idx + 1) as i64),
            language_id: *lang_id,
            part_of_speech: "noun".to_string(),
            lemma: format!("word_{}", lang),
            transliteration: None,
            origin_lang: Some(lang.to_string()),
            process: None,
            etymology_notes: None,
            tag: None,
            notes: None,
        };
        
        assert_eq!(entry.language_id, *lang_id);
        assert_eq!(entry.origin_lang, Some(lang.to_string()));
    }
}
