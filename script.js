let notes = [
    
    {
        id: "1",
        title: "Introduction to React",
        content: "<h1>React Basics</h1><p>React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components and manage application state effectively.</p><h2>Key Concepts</h2><ul><li>Components</li><li>Props</li><li>State</li><li>JSX</li></ul>",
        subject: "Computer Science",
        tags: ["react", "javascript", "frontend"],
        privacy_level: "private",
        collaborators: [],
        is_favorite: false,
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString()
    },
    {
        id: "2",
        title: "Study Guide - Final Exam",
        content: "<h1>Final Exam Preparation</h1><h2>Key Topics</h2><ul><li>Calculus fundamentals</li><li>Integration techniques</li><li>Differential equations</li></ul><h2>Practice Problems</h2><p>Review chapters 1-5 and complete practice exercises.</p>",
        subject: "Mathematics",
        tags: ["exam", "study-guide", "calculus"],
        privacy_level: "shared",
        collaborators: ["friend@example.com"],
        is_favorite: true,
        created_date: new Date(Date.now() - 86400000).toISOString(),
        updated_date: new Date(Date.now() - 3600000).toISOString()
    }
];

let comments = [
    {
        id: "1",
        note_id: "1",
        content: "Great explanation of React concepts! This will be really helpful for the upcoming project.",
        commenter_name: "John Doe",
        is_resolved: false,
        created_date: new Date(Date.now() - 7200000).toISOString()
    }
];

let currentNoteId = null;
let currentPage = 'dashboard';
let searchQuery = '';
let currentFilters = {
    subject: '',
    privacy: ''
};

// Theme Management
let currentTheme = localStorage.getItem('theme') || 'light';

function initializeTheme() {
    // Apply saved theme or default to light
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
    
    // Show theme change notification
    showNotification(`Switched to ${currentTheme} mode`, 'success');
}

function updateThemeIcon() {
    const themeIcon = document.getElementById('themeIcon');
    if (currentTheme === 'dark') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// Auto theme detection
function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

// Listen for system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            currentTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', currentTheme);
            updateThemeIcon();
        }
    });
}

// Built-in templates
const templates = [
    {
        id: "lecture",
        name: "Lecture Notes",
        type: "lecture",
        description: "Perfect for organizing lecture content with clear sections for topics, key points, and takeaways.",
        content_structure: `<h1>[Lecture Title]</h1>
<h2>Date: [Date]</h2>
<h2>Course: [Course Name]</h2>

<h2>Key Topics</h2>
<ul>
<li>[Topic 1]</li>
<li>[Topic 2]</li>
<li>[Topic 3]</li>
</ul>

<h2>Main Points</h2>
<h3>[Point 1]</h3>
<p>[Detailed explanation]</p>

<h3>[Point 2]</h3>
<p>[Detailed explanation]</p>

<h2>Questions & Notes</h2>
<p>[Add questions and additional notes here]</p>

<h2>Action Items</h2>
<ul>
<li>[ ] [Action item 1]</li>
<li>[ ] [Action item 2]</li>
</ul>`,
        icon: "fas fa-graduation-cap",
        color: "blue"
    },
    {
        id: "revision",
        name: "Study Guide",
        type: "revision",
        description: "Organize your study materials with sections for key concepts, formulas, and practice questions.",
        content_structure: `<h1>[Subject] - Study Guide</h1>
<h2>Exam Date: [Date]</h2>

<h2>Key Concepts</h2>
<ul>
<li>[Concept 1] - [Brief description]</li>
<li>[Concept 2] - [Brief description]</li>
<li>[Concept 3] - [Brief description]</li>
</ul>

<h2>Important Formulas</h2>
<h3>[Formula Category]</h3>
<p><strong>[Formula Name]:</strong> [Formula]</p>
<p><em>When to use:</em> [Application]</p>

<h2>Practice Questions</h2>
<ol>
<li>[Question 1]</li>
<li>[Question 2]</li>
<li>[Question 3]</li>
</ol>

<h2>Review Checklist</h2>
<ul>
<li>[ ] [Topic to review]</li>
<li>[ ] [Topic to review]</li>
<li>[ ] [Topic to review]</li>
</ul>`,
        icon: "fas fa-list-check",
        color: "green"
    },
    {
        id: "summary",
        name: "Summary",
        type: "summary",
        description: "Condense complex topics into clear, concise summaries with main points and conclusions.",
        content_structure: `<h1>[Topic] Summary</h1>

<h2>Overview</h2>
<p>[Brief overview of the topic]</p>

<h2>Main Points</h2>
<h3>Point 1: [Title]</h3>
<p>[Detailed explanation]</p>

<h3>Point 2: [Title]</h3>
<p>[Detailed explanation]</p>

<h3>Point 3: [Title]</h3>
<p>[Detailed explanation]</p>

<h2>Key Takeaways</h2>
<ul>
<li>[Takeaway 1]</li>
<li>[Takeaway 2]</li>
<li>[Takeaway 3]</li>
</ul>

<h2>Conclusion</h2>
<p>[Summary conclusion and final thoughts]</p>`,
        icon: "fas fa-file-lines",
        color: "purple"
    },
    {
        id: "flashcard",
        name: "Flash Cards",
        type: "flashcard",
        description: "Create digital flashcards for quick review sessions and memory reinforcement.",
        content_structure: `<h1>[Subject] Flashcards</h1>

<div style="border: 2px solid #e2e8f0; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0; background: #f8fafc;">
<h3>Card 1</h3>
<p><strong>Q:</strong> [Question or term]</p>
<hr style="margin: 0.5rem 0;">
<p><strong>A:</strong> [Answer or definition]</p>
</div>

<div style="border: 2px solid #e2e8f0; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0; background: #f8fafc;">
<h3>Card 2</h3>
<p><strong>Q:</strong> [Question or term]</p>
<hr style="margin: 0.5rem 0;">
<p><strong>A:</strong> [Answer or definition]</p>
</div>

<div style="border: 2px solid #e2e8f0; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0; background: #f8fafc;">
<h3>Card 3</h3>
<p><strong>Q:</strong> [Question or term]</p>
<hr style="margin: 0.5rem 0;">
<p><strong>A:</strong> [Answer or definition]</p>
</div>

<p><em>Add more cards as needed by copying the card format above.</em></p>`,
        icon: "fas fa-layer-group",
        color: "orange"
    }
];

// Utility Functions
function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function getTimeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diff = now - past;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function stripHtml(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
}

function countWords(text) {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Navigation Functions
function switchPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.style.display = 'none';
    });

    // Show selected page
    document.getElementById(pageName + 'Page').style.display = 'block';
    
    // Update page title
    const pageTitle = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    document.getElementById('pageTitle').textContent = pageTitle;

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`[data-page="${pageName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    currentPage = pageName;
    
    // Load page content
    if (pageName === 'dashboard') {
        updateDashboard();
    } else if (pageName === 'notes') {
        updateNotesPage();
    } else if (pageName === 'templates') {
        updateTemplatesPage();
    }
}

// Dashboard Functions
function updateDashboard() {
    updateStats();
    updateRecentNotes();
    updateRecentActivity();
    updateSubjectOverview();
}

function updateStats() {
    const totalNotes = notes.length;
    const sharedNotes = notes.filter(n => n.privacy_level === 'shared' || n.privacy_level === 'public').length;
    const totalComments = comments.length;
    const subjects = [...new Set(notes.map(n => n.subject).filter(Boolean))].length;
    
    document.getElementById('totalNotes').textContent = totalNotes;
    document.getElementById('sharedNotes').textContent = sharedNotes;
    document.getElementById('totalComments').textContent = totalComments;
    document.getElementById('totalSubjects').textContent = subjects;
}

function updateRecentNotes() {
    const container = document.getElementById('recentNotes');
    const recentNotes = notes
        .sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date))
        .slice(0, 4);
    
    if (recentNotes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon" style="background: linear-gradient(to right, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));">
                    <i class="fas fa-file-text" style="color: var(--primary);"></i>
                </div>
                <h3>No notes yet</h3>
                <p>Create your first note to get started</p>
                <button class="btn btn-primary" onclick="createNewNote()">Create Note</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recentNotes.map(note => `
        <div class="note-item" onclick="openNote('${note.id}')">
            <div class="note-icon">
                <i class="fas fa-file-text"></i>
            </div>
            <div class="note-info">
                <div class="note-title">${note.title}</div>
                <div class="note-meta">
                    <i class="fas fa-clock"></i>
                    <span>${getTimeAgo(note.updated_date)}</span>
                    ${note.subject ? `<span class="badge">${note.subject}</span>` : ''}
                    ${note.privacy_level !== 'private' ? '<i class="fas fa-users" style="color: var(--secondary);"></i>' : ''}
                    ${note.is_favorite ? '<i class="fas fa-star" style="color: #f59e0b;"></i>' : ''}
                </div>
            </div>
            <i class="fas fa-chevron-right" style="color: var(--gray-400);"></i>
        </div>
    `).join('');
}

function updateRecentActivity() {
    const container = document.getElementById('recentActivity');
    const recentActivity = comments
        .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
        .slice(0, 5);
    
    if (recentActivity.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon" style="background: linear-gradient(to right, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1));">
                    <i class="fas fa-comment" style="color: var(--secondary);"></i>
                </div>
                <h3>No recent activity</h3>
                <p>Comments and collaborations will appear here</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recentActivity.map(activity => {
        const relatedNote = notes.find(note => note.id === activity.note_id);
        return `
            <div class="activity-item">
                <div class="activity-avatar">${activity.commenter_name?.charAt(0) || 'U'}</div>
                <div class="activity-content">
                    <div class="activity-text">
                        <strong>${activity.commenter_name}</strong> commented on <strong>${relatedNote?.title || 'a note'}</strong>
                    </div>
                    <div class="activity-comment">"${activity.content}"</div>
                    <div class="activity-time">
                        <i class="fas fa-clock"></i>
                        <span>${getTimeAgo(activity.created_date)}</span>
                        ${activity.is_resolved ? '<span class="badge" style="background: var(--success); color: white;">Resolved</span>' : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updateSubjectOverview() {
    const container = document.getElementById('subjectOverview');
    const subjectCounts = {};
    
    notes.forEach(note => {
        if (note.subject) {
            subjectCounts[note.subject] = (subjectCounts[note.subject] || 0) + 1;
        }
    });
    
    const subjects = Object.entries(subjectCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);
    
    if (subjects.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon" style="background: linear-gradient(to right, rgba(16, 185, 129, 0.1), rgba(20, 184, 166, 0.1));">
                    <i class="fas fa-book-open" style="color: var(--success);"></i>
                </div>
                <h3>No subjects yet</h3>
                <p>Add subjects to your notes to see them here</p>
            </div>
        `;
        return;
    }
    
    const colors = ['blue', 'purple', 'green', 'orange', 'yellow', 'indigo'];
    
    container.innerHTML = subjects.map(([subject, count], index) => `
        <div class="subject-item">
            <div class="subject-info">
                <div class="subject-icon ${colors[index % colors.length]}">
                    <i class="fas fa-book-open"></i>
                </div>
                <div class="subject-details">
                    <h4>${subject}</h4>
                    <div class="subject-meta">
                        <i class="fas fa-trending-up"></i>
                        <span>${count} notes</span>
                    </div>
                </div>
            </div>
            <div class="subject-count">${count}</div>
        </div>
    `).join('');
}

// Notes Page Functions
function updateNotesPage() {
    updateSubjectFilter();
    renderNotes();
}

function updateSubjectFilter() {
    const subjectFilter = document.getElementById('subjectFilter');
    const subjects = [...new Set(notes.map(n => n.subject).filter(Boolean))];
    
    subjectFilter.innerHTML = '<option value="">All Subjects</option>' +
        subjects.map(subject => `<option value="${subject}">${subject}</option>`).join('');
    
    subjectFilter.value = currentFilters.subject;
}

function renderNotes() {
    const container = document.getElementById('notesGrid');
    let filteredNotes = notes;
    
    // Apply search filter
    if (searchQuery) {
        filteredNotes = filteredNotes.filter(note => 
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            stripHtml(note.content).toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }
    
    // Apply subject filter
    if (currentFilters.subject) {
        filteredNotes = filteredNotes.filter(note => note.subject === currentFilters.subject);
    }
    
    // Apply privacy filter
    if (currentFilters.privacy) {
        filteredNotes = filteredNotes.filter(note => note.privacy_level === currentFilters.privacy);
    }
    
    // Sort by updated date (newest first)
    filteredNotes.sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date));
    
    if (filteredNotes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon" style="background: linear-gradient(to right, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));">
                    <i class="fas fa-file-text" style="color: var(--primary);"></i>
                </div>
                <h3>No notes found</h3>
                <p>${searchQuery || currentFilters.subject || currentFilters.privacy ? 'Try adjusting your filters' : 'Create your first note to get started'}</p>
                <button class="btn btn-primary" onclick="createNewNote()">Create Note</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredNotes.map(note => {
        const preview = stripHtml(note.content).substring(0, 150) + '...';
        return `
            <div class="card note-card" onclick="openNote('${note.id}')">
                <div class="card-header">
                    <div class="note-title">${note.title}</div>
                    <div class="note-meta">
                        <i class="fas fa-clock"></i>
                        <span>${getTimeAgo(note.updated_date)}</span>
                        ${note.privacy_level !== 'private' ? '<i class="fas fa-users" style="color: var(--secondary);"></i>' : ''}
                        ${note.is_favorite ? '<i class="fas fa-star" style="color: #f59e0b;"></i>' : ''}
                    </div>
                </div>
                <div class="card-content">
                    <div class="note-preview">${preview}</div>
                    <div class="note-tags">
                        ${note.subject ? `<span class="badge">${note.subject}</span>` : ''}
                        ${note.tags.map(tag => `<span class="badge">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Templates Page Functions
function updateTemplatesPage() {
    const container = document.getElementById('templatesGrid');
    
    container.innerHTML = templates.map(template => `
        <div class="card template-card">
            <div class="card-header">
                <div class="template-info">
                    <div class="template-icon ${template.color}">
                        <i class="${template.icon}"></i>
                    </div>
                    <div class="template-details">
                        <h3>${template.name}</h3>
                        <span class="badge" style="text-transform: capitalize;">${template.type}</span>
                    </div>
                </div>
            </div>
            <div class="card-content">
                <p class="template-description">${template.description}</p>
                <button class="btn btn-primary" style="width: 100%;" onclick="useTemplate('${template.id}')">
                    Use Template
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function useTemplate(templateId) {
    const template = templates.find(t => t.id === templateId);
    if (template) {
        currentNoteId = null;
        document.getElementById('noteTitle').value = `New ${template.name}`;
        document.getElementById('noteSubject').value = '';
        document.getElementById('notePrivacy').value = 'private';
        document.getElementById('noteEditor').innerHTML = template.content_structure;
        document.getElementById('tagInput').value = '';
        updateTagsList([]);
        updateWordCount();
        showModal();
    }
}
function startAutoSave() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
        if (currentNoteId && document.getElementById('noteTitle').value.trim()) {
            saveNote(); // actually save the note
            document.getElementById('lastSaved').textContent = 'Auto-saved';
        }
    }, 5000);
}

function createTemplate() {
    alert('Custom template creation feature coming soon! You can use the existing templates or create a note and save it as your personal template.');
}


// Note Editor Functions
function createNewNote() {
    currentNoteId = null;
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteSubject').value = '';
    document.getElementById('notePrivacy').value = 'private';
    document.getElementById('noteEditor').innerHTML = '';
    document.getElementById('tagInput').value = '';
    updateTagsList([]);
    updateFavoriteButton(false);
    updateWordCount();
    showModal();
}

function openNote(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
        currentNoteId = noteId;
        document.getElementById('noteTitle').value = note.title;
        document.getElementById('noteSubject').value = note.subject || '';
        document.getElementById('notePrivacy').value = note.privacy_level;
        document.getElementById('noteEditor').innerHTML = note.content;
        document.getElementById('tagInput').value = '';
        updateTagsList(note.tags || []);
        updateFavoriteButton(note.is_favorite);
        updateWordCount();
        showModal();
    }
}

function saveNote() {
    const title = document.getElementById('noteTitle').value.trim();
    const subject = document.getElementById('noteSubject').value.trim();
    const privacy = document.getElementById('notePrivacy').value;
    const content = document.getElementById('noteEditor').innerHTML;
    const tags = getCurrentTags();
    const isFavorite = document.getElementById('favoriteBtn').classList.contains('active');
    
    if (!title) {
        alert('Please enter a note title');
        return;
    }
    
    if (!content.trim() || content === '<div><br></div>' || content === '<br>') {
        alert('Please add some content to your note');
        return;
    }
    
    if (currentNoteId) {
        // Update existing note
        const noteIndex = notes.findIndex(n => n.id === currentNoteId);
        if (noteIndex !== -1) {
            notes[noteIndex] = {
                ...notes[noteIndex],
                title,
                subject,
                privacy_level: privacy,
                content,
                tags,
                is_favorite: isFavorite,
                updated_date: new Date().toISOString()
            };
        }
    } else {
        // Create new note
        const newNote = {
            id: generateId(),
            title,
            subject,
            privacy_level: privacy,
            content,
            tags,
            collaborators: [],
            is_favorite: isFavorite,
            created_date: new Date().toISOString(),
            updated_date: new Date().toISOString()
        };
        notes.push(newNote);
    }
    
    closeModal();
    updateDashboard();
    updateNotesPage();
    showSaveConfirmation();
}

function deleteNote() {
    if (!currentNoteId) return;
    
    if (confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
        notes = notes.filter(n => n.id !== currentNoteId);
        comments = comments.filter(c => c.note_id !== currentNoteId);
        closeModal();
        updateDashboard();
        updateNotesPage();
        showDeleteConfirmation();
    }
}

function toggleFavorite() {
    const btn = document.getElementById('favoriteBtn');
    const icon = btn.querySelector('i');
    
    if (btn.classList.contains('active')) {
        btn.classList.remove('active');
        icon.className = 'fas fa-star';
        icon.style.color = '';
    } else {
        btn.classList.add('active');
        icon.className = 'fas fa-star';
        icon.style.color = '#f59e0b';
    }
}

function updateFavoriteButton(isFavorite) {
    const btn = document.getElementById('favoriteBtn');
    const icon = btn.querySelector('i');
    
    if (isFavorite) {
        btn.classList.add('active');
        icon.style.color = '#f59e0b';
    } else {
        btn.classList.remove('active');
        icon.style.color = '';
    }
}

// Tag Management
function addTag() {
    const tagInput = document.getElementById('tagInput');
    const tag = tagInput.value.trim().toLowerCase();
    
    if (tag && !getCurrentTags().includes(tag)) {
        const currentTags = getCurrentTags();
        currentTags.push(tag);
        updateTagsList(currentTags);
        tagInput.value = '';
    }
}

function removeTag(tagToRemove) {
    const currentTags = getCurrentTags().filter(tag => tag !== tagToRemove);
    updateTagsList(currentTags);
}

function getCurrentTags() {
    const tagsList = document.getElementById('tagsList');
    return Array.from(tagsList.querySelectorAll('.tag')).map(tagEl => 
        tagEl.textContent.replace('×', '').trim()
    );
}

function updateTagsList(tags) {
    const tagsList = document.getElementById('tagsList');
    tagsList.innerHTML = tags.map(tag => `
        <span class="tag">
            ${tag}
            <button class="tag-remove" onclick="removeTag('${tag}')">×</button>
        </span>
    `).join('');
}

// Editor Functions
function execCommand(command, value = null) {
    document.execCommand(command, false, value);
    document.getElementById('noteEditor').focus();
    updateWordCount();
}

function insertHeading(level) {
    execCommand('formatBlock', `H${level}`);
}

function insertBlockquote() {
    execCommand('formatBlock', 'blockquote');
}

function insertLink() {
    const url = prompt('Enter the URL:');
    if (url) {
        execCommand('createLink', url);
    }
}

function insertImage() {
    const url = prompt('Enter the image URL:');
    if (url) {
        execCommand('insertImage', url);
    }
}

function updateWordCount() {
    const editor = document.getElementById('noteEditor');
    const text = stripHtml(editor.innerHTML);
    const wordCount = countWords(text);
    document.getElementById('wordCount').textContent = wordCount;
}

// Modal Functions
function showModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Focus on title input
    setTimeout(() => {
        document.getElementById('noteTitle').focus();
    }, 100);
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('show');
    document.body.style.overflow = 'auto';
    
    // Reset share modal if it was open
    closeShareModal();
}

function previewNote() {
    const content = document.getElementById('noteEditor').innerHTML;
    const previewWindow = window.open('', '_blank', 'width=800,height=600');
    previewWindow.document.write(`
        <html>
            <head>
                <title>Note Preview</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 2rem; line-height: 1.6; }
                    h1, h2, h3 { color: #1e293b; }
                    blockquote { border-left: 4px solid #8b5cf6; padding-left: 1rem; background: #f8fafc; margin: 1rem 0; }
                </style>
            </head>
            <body>
                ${content}
            </body>
        </html>
    `);
    previewWindow.document.close();
}

// Share Functions
function shareNote() {
    if (!currentNoteId) {
        alert('Please save the note first before sharing.');
        return;
    }
    
    const note = notes.find(n => n.id === currentNoteId);
    if (note) {
        document.getElementById('sharePrivacySelect').value = note.privacy_level;
        updateShareModal(note.privacy_level);
        document.getElementById('shareModal').style.display = 'block';
    }
}

function closeShareModal() {
    document.getElementById('shareModal').style.display = 'none';
}

function updateShareModal(privacyLevel) {
    const shareUrlSection = document.getElementById('shareUrlSection');
    const collaboratorsSection = document.getElementById('collaboratorsSection');
    
    if (privacyLevel === 'private') {
        shareUrlSection.style.display = 'none';
        collaboratorsSection.style.display = 'none';
    } else if (privacyLevel === 'public') {
        shareUrlSection.style.display = 'block';
        collaboratorsSection.style.display = 'none';
        
        // Update share URL
        const shareUrl = `${window.location.origin}/notes/${currentNoteId}`;
        document.getElementById('shareUrl').value = shareUrl;
    } else if (privacyLevel === 'shared') {
        shareUrlSection.style.display = 'none';
        collaboratorsSection.style.display = 'block';
        
        // Update collaborators list
        const note = notes.find(n => n.id === currentNoteId);
        updateCollaboratorsList(note ? note.collaborators || [] : []);
    }
}

function copyShareUrl() {
    const shareUrl = document.getElementById('shareUrl');
    shareUrl.select();
    shareUrl.setSelectionRange(0, 99999);
    
    try {
        document.execCommand('copy');
        const btn = shareUrl.nextElementSibling;
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            btn.innerHTML = originalHTML;
        }, 2000);
    } catch (err) {
        alert('Failed to copy URL');
    }
}

function addCollaborator() {
    const emailInput = document.getElementById('collaboratorEmail');
    const email = emailInput.value.trim();
    
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }
    
    const note = notes.find(n => n.id === currentNoteId);
    if (!note) return;
    
    if (note.collaborators && note.collaborators.includes(email)) {
        alert('This collaborator is already added');
        return;
    }
    
    const collaborators = note.collaborators || [];
    collaborators.push(email);
    
    // Update the note
    const noteIndex = notes.findIndex(n => n.id === currentNoteId);
    if (noteIndex !== -1) {
        notes[noteIndex].collaborators = collaborators;
        notes[noteIndex].updated_date = new Date().toISOString();
    }
    
    updateCollaboratorsList(collaborators);
    emailInput.value = '';
}

function removeCollaborator(email) {
    const note = notes.find(n => n.id === currentNoteId);
    if (!note) return;
    
    const collaborators = (note.collaborators || []).filter(c => c !== email);
    
    // Update the note
    const noteIndex = notes.findIndex(n => n.id === currentNoteId);
    if (noteIndex !== -1) {
        notes[noteIndex].collaborators = collaborators;
        notes[noteIndex].updated_date = new Date().toISOString();
    }
    
    updateCollaboratorsList(collaborators);
}

function updateCollaboratorsList(collaborators) {
    const container = document.getElementById('collaboratorsList');
    
    if (collaborators.length === 0) {
        container.innerHTML = '<p style="color: var(--gray-500); text-align: center; padding: 1rem;">No collaborators added yet</p>';
        return;
    }
    
    container.innerHTML = collaborators.map(email => `
        <div class="collaborator-item">
            <span class="collaborator-email">${email}</span>
            <button class="btn btn-ghost btn-sm" onclick="removeCollaborator('${email}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// Search Functions
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    searchQuery = searchInput.value.trim();
    
    if (currentPage === 'notes') {
        renderNotes();
    }
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    searchQuery = '';
    
    if (currentPage === 'notes') {
        renderNotes();
    }
}

// Filter Functions
function handleSubjectFilter() {
    const subjectFilter = document.getElementById('subjectFilter');
    currentFilters.subject = subjectFilter.value;
    renderNotes();
}

function handlePrivacyFilter() {
    const privacyFilter = document.getElementById('privacyFilter');
    currentFilters.privacy = privacyFilter.value;
    renderNotes();
}

// Notification Functions
function showSaveConfirmation() {
    showNotification('Note saved successfully!', 'success');
    document.getElementById('lastSaved').textContent = 'Saved just now';
}

function showDeleteConfirmation() {
    showNotification('Note deleted successfully!', 'success');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Mobile Functions
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

function closeSidebarOnMobile() {
    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.remove('open');
    }
}

// Auto-save functionality
let autoSaveTimer;
function startAutoSave() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
        if (currentNoteId && document.getElementById('noteTitle').value.trim()) {
            // Auto-save logic here
            document.getElementById('lastSaved').textContent = 'Auto-saved';
        }
    }, 5000); // Auto-save after 5 seconds of inactivity
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme first
    initializeTheme();
    
    // Initialize the app
    updateDashboard();
    updateNotesPage();
    updateTemplatesPage();
    
    // Theme toggle event listener
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);
    
    // Navigation event listeners
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            switchPage(page);
            closeSidebarOnMobile();
        });
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (window.innerWidth <= 768) {
        mobileMenuBtn.style.display = 'inline-flex';
        mobileMenuBtn.addEventListener('click', toggleSidebar);
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Filter event listeners
    const subjectFilter = document.getElementById('subjectFilter');
    const privacyFilter = document.getElementById('privacyFilter');
    
    if (subjectFilter) subjectFilter.addEventListener('change', handleSubjectFilter);
    if (privacyFilter) privacyFilter.addEventListener('change', handlePrivacyFilter);
    
    // Editor event listeners
    const noteEditor = document.getElementById('noteEditor');
    noteEditor.addEventListener('input', () => {
        updateWordCount();
        startAutoSave();
    });
    
    // Tag input event listener
    const tagInput = document.getElementById('tagInput');
    tagInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    });
    
    // Toolbar event listeners
    document.querySelectorAll('.toolbar-btn').forEach(btn => {
        const command = btn.getAttribute('data-command');
        if (command) {
            btn.addEventListener('click', () => execCommand(command));
        }
    });
    
    // Font and size selectors
    const fontSelect = document.getElementById('fontSelect');
    const fontSizeSelect = document.getElementById('fontSizeSelect');
    
    fontSelect.addEventListener('change', (e) => {
        if (e.target.value) {
            execCommand('fontName', e.target.value);
            e.target.value = '';
        }
    });
    
    fontSizeSelect.addEventListener('change', (e) => {
        if (e.target.value) {
            execCommand('fontSize', e.target.value);
            e.target.value = '';
        }
    });
    
    // Share privacy change listener
    const sharePrivacySelect = document.getElementById('sharePrivacySelect');
    sharePrivacySelect.addEventListener('change', (e) => {
        if (currentNoteId) {
            const noteIndex = notes.findIndex(n => n.id === currentNoteId);
            if (noteIndex !== -1) {
                notes[noteIndex].privacy_level = e.target.value;
                notes[noteIndex].updated_date = new Date().toISOString();
                document.getElementById('notePrivacy').value = e.target.value;
            }
        }
        updateShareModal(e.target.value);
    });
    
    // Collaborator email input enter key
    const collaboratorEmail = document.getElementById('collaboratorEmail');
    collaboratorEmail.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addCollaborator();
        }
    });
    
    // Close modal when clicking outside
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Prevent modal close when clicking inside modal
    const noteEditorModal = document.getElementById('noteEditorModal');
    const shareModal = document.getElementById('shareModal');
    
    noteEditorModal.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    shareModal.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Window resize handler
    window.addEventListener('resize', () => {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (window.innerWidth <= 768) {
            mobileMenuBtn.style.display = 'inline-flex';
        } else {
            mobileMenuBtn.style.display = 'none';
            document.getElementById('sidebar').classList.remove('open');
        }
    });
});

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Additional CSS for notifications (to be added to styles.css or inline)
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        border-left: 4px solid var(--primary);
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        z-index: 9999;
        min-width: 300px;
        animation: slideInRight 0.3s ease-out;
    }
    
    .notification-success {
        border-left-color: var(--success);
    }
    
    .notification-error {
        border-left-color: var(--danger);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--gray-700);
    }
    
    .notification-success .notification-content i {
        color: var(--success);
    }
    
    .notification-error .notification-content i {
        color: var(--danger);
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--gray-400);
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 0.25rem;
        transition: background 0.2s;
    }
    
    .notification-close:hover {
        background: var(--gray-100);
        color: var(--gray-600);
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @media (max-width: 768px) {
        .notification {
            top: 1rem;
            right: 1rem;
            left: 1rem;
            min-width: auto;
        }
    }
`;

document.head.appendChild(notificationStyles);

// Export functions for global access (if needed)
window.StudySync = {
    switchPage,
    createNewNote,
    openNote,
    saveNote,
    deleteNote,
    toggleFavorite,
    useTemplate,
    createTemplate,
    addTag,
    removeTag,
    execCommand,
    insertHeading,
    insertBlockquote,
    insertLink,
    insertImage,
    showModal,
    closeModal,
    previewNote,
    shareNote,
    closeShareModal,
    copyShareUrl,
    addCollaborator,
    removeCollaborator,
    toggleSidebar
};

