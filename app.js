// Application State
let currentUser = null;
let currentView = 'dashboard';
let isAuthenticated = false;
let authMode = 'login';
let documents = [];
let searchHistory = [];
let analyticsData = {};
let isGridView = true;
let theme = 'light';
let tourStep = 0;
let searchTimeout = null;

// Sample Data
const sampleDocuments = [
    {
        id: "doc1",
        title: "Machine Learning in Healthcare: A Comprehensive Review",
        author: "Dr. Sarah Chen",
        uploadDate: "2024-12-15",
        type: "pdf",
        size: "2.3 MB",
        tags: ["machine learning", "healthcare", "AI", "medical"],
        content: "This paper reviews the current state of machine learning applications in healthcare, covering diagnostic imaging, drug discovery, personalized medicine, and clinical decision support systems. We examine the challenges and opportunities in implementing AI-driven solutions in medical practice.",
        embedding: [0.2, 0.8, 0.1, 0.9, 0.3, 0.7, 0.5, 0.4],
        relevanceScore: 0.95
    },
    {
        id: "doc2", 
        title: "Climate Change Impact on Global Agriculture",
        author: "Prof. Michael Rodriguez",
        uploadDate: "2024-12-10",
        type: "docx",
        size: "1.8 MB",
        tags: ["climate change", "agriculture", "sustainability", "environment"],
        content: "An analysis of how climate change affects agricultural productivity worldwide, including temperature variations, precipitation patterns, and soil degradation. The study provides recommendations for sustainable farming practices and adaptation strategies.",
        embedding: [0.1, 0.3, 0.8, 0.2, 0.9, 0.4, 0.6, 0.7],
        relevanceScore: 0.88
    },
    {
        id: "doc3",
        title: "Blockchain Technology in Supply Chain Management",
        author: "Lisa Johnson",
        uploadDate: "2024-12-08",
        type: "pdf", 
        size: "3.1 MB",
        tags: ["blockchain", "supply chain", "technology", "logistics"],
        content: "This research explores the implementation of blockchain technology in supply chain management, focusing on transparency, traceability, and efficiency improvements. Case studies from various industries demonstrate practical applications and benefits.",
        embedding: [0.7, 0.2, 0.4, 0.6, 0.1, 0.8, 0.9, 0.3],
        relevanceScore: 0.82
    },
    {
        id: "doc4",
        title: "Quantum Computing: Current State and Future Prospects",
        author: "Dr. Alex Thompson",
        uploadDate: "2024-12-05",
        type: "pdf",
        size: "2.7 MB", 
        tags: ["quantum computing", "technology", "physics", "computing"],
        content: "A comprehensive overview of quantum computing technology, including current hardware limitations, algorithm development, and potential applications in cryptography, optimization, and scientific simulation.",
        embedding: [0.9, 0.1, 0.6, 0.3, 0.8, 0.2, 0.4, 0.7],
        relevanceScore: 0.91
    },
    {
        id: "doc5",
        title: "Sustainable Urban Development Strategies",
        author: "Emma Williams",
        uploadDate: "2024-12-01",
        type: "docx",
        size: "1.9 MB",
        tags: ["urban development", "sustainability", "city planning", "environment"],
        content: "This document outlines strategies for sustainable urban development, including green infrastructure, smart city technologies, and community engagement approaches. Focus on reducing environmental impact while improving quality of life.",
        embedding: [0.3, 0.7, 0.2, 0.8, 0.5, 0.9, 0.1, 0.6],
        relevanceScore: 0.86
    },
    {
        id: "doc6",
        title: "Artificial Intelligence Ethics and Governance",
        author: "Dr. Robert Kim",
        uploadDate: "2024-11-28",
        type: "pdf",
        size: "2.5 MB",
        tags: ["AI ethics", "governance", "artificial intelligence", "policy"],
        content: "An examination of ethical considerations in AI development and deployment, covering bias, accountability, transparency, and regulatory frameworks. Proposes guidelines for responsible AI governance.",
        embedding: [0.6, 0.4, 0.9, 0.1, 0.7, 0.3, 0.8, 0.2],
        relevanceScore: 0.93
    }
];

const sampleUser = {
    id: "user1",
    name: "Dr. Sarah Mitchell",
    email: "sarah.mitchell@research.edu",
    role: "Research Scientist",
    avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='%23626c71'%3E%3Cpath d='M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L9 7V9C9 10.1 9.9 11 11 11V14L7 18V20H17V18L13 14V11C14.1 11 15 10.1 15 9Z'/%3E%3C/svg%3E",
    joinDate: "2024-10-15",
    documentsUploaded: 12,
    searchesPerformed: 145,
    preferences: {
        theme: "light",
        notifications: true,
        defaultResultCount: 10
    }
};

const sampleAnalytics = {
    totalDocuments: 47,
    totalSearches: 328,
    averageSearchTime: 2.3,
    topSearchTerms: [
        { term: "machine learning", count: 45 },
        { term: "climate change", count: 32 },
        { term: "blockchain", count: 28 },
        { term: "artificial intelligence", count: 38 },
        { term: "sustainability", count: 25 }
    ],
    searchTrends: [
        { date: "2024-12-01", searches: 15 },
        { date: "2024-12-02", searches: 22 },
        { date: "2024-12-03", searches: 18 },
        { date: "2024-12-04", searches: 31 },
        { date: "2024-12-05", searches: 28 },
        { date: "2024-12-06", searches: 24 },
        { date: "2024-12-07", searches: 35 }
    ]
};

const tourSteps = [
    {
        title: "Welcome to DocuFind!",
        description: "Let's take a quick tour of your new document search engine.",
        target: null
    },
    {
        title: "Smart Search",
        description: "Use our semantic search to find documents by meaning, not just keywords.",
        target: ".header-search"
    },
    {
        title: "Navigation",
        description: "Navigate between different sections of the application.",
        target: ".app-nav"
    },
    {
        title: "Upload Documents",
        description: "Easily upload and organize your documents with drag-and-drop.",
        target: "[data-view='upload']"
    },
    {
        title: "Analytics Dashboard",
        description: "Track your search patterns and document usage.",
        target: "[data-view='analytics']"
    }
];

// Global functions for HTML onclick handlers
window.showAuth = showAuth;
window.hideAuth = hideAuth;
window.toggleAuthMode = toggleAuthMode;
window.signInWithGoogle = signInWithGoogle;
window.switchView = switchView;
window.performSearch = performSearch;
window.performDemoSearch = performDemoSearch;
window.showDemo = showDemo;
window.setSampleQuery = setSampleQuery;
window.toggleTheme = toggleTheme;
window.toggleUserMenu = toggleUserMenu;
window.showProfile = showProfile;
window.showSettings = showSettings;
window.logout = logout;
window.viewDocument = viewDocument;
window.downloadDocument = downloadDocument;
window.toggleViewMode = toggleViewMode;
window.startTour = startTour;
window.nextTourStep = nextTourStep;
window.skipTour = skipTour;
window.selectSuggestion = selectSuggestion;

// Utility Functions
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

function cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

function generateQueryEmbedding(query) {
    // Mock embedding generation based on query terms
    const terms = query.toLowerCase().split(' ');
    const baseEmbedding = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
    
    // Modify embedding based on key terms
    const termWeights = {
        'machine': [0.8, 0.1, 0.2, 0.9, 0.3, 0.1, 0.4, 0.2],
        'learning': [0.7, 0.9, 0.1, 0.8, 0.2, 0.3, 0.5, 0.1],
        'ai': [0.9, 0.8, 0.1, 0.7, 0.2, 0.1, 0.3, 0.4],
        'healthcare': [0.2, 0.8, 0.1, 0.9, 0.3, 0.7, 0.5, 0.4],
        'climate': [0.1, 0.3, 0.8, 0.2, 0.9, 0.4, 0.6, 0.7],
        'blockchain': [0.7, 0.2, 0.4, 0.6, 0.1, 0.8, 0.9, 0.3],
        'quantum': [0.9, 0.1, 0.6, 0.3, 0.8, 0.2, 0.4, 0.7],
        'sustainability': [0.3, 0.7, 0.2, 0.8, 0.5, 0.9, 0.1, 0.6],
        'ethics': [0.6, 0.4, 0.9, 0.1, 0.7, 0.3, 0.8, 0.2]
    };
    
    let embedding = [...baseEmbedding];
    terms.forEach(term => {
        if (termWeights[term]) {
            embedding = embedding.map((val, i) => 
                (val + termWeights[term][i]) / 2
            );
        }
    });
    
    return embedding;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatFileSize(size) {
    if (typeof size === 'string' && size.includes('MB')) {
        return size;
    }
    const bytes = parseInt(size);
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Toast Notifications
function showToast(title, message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    
    const iconMap = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="${iconMap[type]}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.getElementById('toast-container').appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

// Authentication Functions
function showAuth(mode = 'login') {
    authMode = mode;
    const modal = document.getElementById('auth-modal');
    const title = document.getElementById('auth-title');
    const btnText = document.getElementById('auth-btn-text');
    const switchText = document.getElementById('auth-switch-text');
    const signupFields = document.getElementById('signup-fields');
    
    if (mode === 'signup') {
        title.textContent = 'Create Account';
        btnText.textContent = 'Create Account';
        switchText.innerHTML = 'Already have an account? <a href="#" onclick="toggleAuthMode()">Sign in</a>';
        signupFields.classList.remove('hidden');
    } else {
        title.textContent = 'Sign In';
        btnText.textContent = 'Sign In';
        switchText.innerHTML = 'Don\'t have an account? <a href="#" onclick="toggleAuthMode()">Sign up</a>';
        signupFields.classList.add('hidden');
    }
    
    modal.classList.remove('hidden');
    document.getElementById('email').focus();
}

function hideAuth() {
    document.getElementById('auth-modal').classList.add('hidden');
    clearAuthForm();
}

function toggleAuthMode() {
    showAuth(authMode === 'login' ? 'signup' : 'login');
}

function clearAuthForm() {
    document.getElementById('auth-form').reset();
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
}

async function signInWithGoogle() {
    showToast('Success', 'Google authentication simulated successfully!', 'success');
    await authenticateUser({
        name: 'Dr. Sarah Mitchell',
        email: 'sarah.mitchell@gmail.com',
        role: 'researcher'
    });
}

async function authenticateUser(userData = null) {
    // Simulate authentication
    currentUser = userData || sampleUser;
    isAuthenticated = true;
    
    // Update UI
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-email').textContent = currentUser.email;
    document.getElementById('user-avatar').src = currentUser.avatar;
    
    // Initialize app data
    documents = [...sampleDocuments];
    analyticsData = { ...sampleAnalytics };
    
    // Hide auth modal and landing page
    hideAuth();
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    
    // Show onboarding for new users
    if (userData && userData.email !== sampleUser.email) {
        setTimeout(() => startTour(), 1000);
    }
    
    // Initialize dashboard
    updateDashboard();
    initializeCharts();
    
    showToast('Welcome!', `Welcome back, ${currentUser.name}!`, 'success');
}

function logout() {
    currentUser = null;
    isAuthenticated = false;
    
    // Reset UI
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('landing-page').classList.remove('hidden');
    
    showToast('Logged Out', 'You have been successfully logged out.', 'info');
}

// Form Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function showFieldError(fieldId, message) {
    const errorEl = document.getElementById(`${fieldId}-error`);
    if (errorEl) {
        errorEl.textContent = message;
    }
}

function clearFieldError(fieldId) {
    const errorEl = document.getElementById(`${fieldId}-error`);
    if (errorEl) {
        errorEl.textContent = '';
    }
}

// Navigation Functions
function switchView(viewName) {
    console.log('Switching to view:', viewName);
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const navItem = document.querySelector(`[data-view="${viewName}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }
    
    // Update active view
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    const targetView = document.getElementById(`${viewName}-view`);
    if (targetView) {
        targetView.classList.add('active');
    }
    
    currentView = viewName;
    
    // Load view-specific data
    setTimeout(() => {
        switch (viewName) {
            case 'documents':
                renderDocuments();
                break;
            case 'analytics':
                updateAnalyticsCharts();
                break;
            case 'search':
                const searchInput = document.getElementById('main-search');
                if (searchInput) searchInput.focus();
                break;
            case 'upload':
                // Initialize upload area if needed
                break;
            case 'dashboard':
                updateDashboard();
                break;
        }
    }, 100);
    
    showToast('Navigation', `Switched to ${viewName.charAt(0).toUpperCase() + viewName.slice(1)} view`, 'info');
}

// Search Functions
function performDemoSearch() {
    const query = document.getElementById('demo-search').value;
    if (!query.trim()) return;
    
    const results = searchDocuments(query, sampleDocuments);
    displayDemoResults(results);
}

function performSearch() {
    const query = document.getElementById('main-search').value;
    if (!query.trim()) return;
    
    const results = searchDocuments(query, documents);
    
    // Switch to search view and display results
    switchView('search');
    setTimeout(() => displaySearchResults(results, query), 200);
    
    // Add to search history
    searchHistory.unshift({
        id: Date.now(),
        query: query,
        timestamp: new Date().toISOString(),
        resultsCount: results.length,
        timeSpent: Math.random() * 60 + 10
    });
    
    // Update analytics
    analyticsData.totalSearches++;
    updateDashboard();
}

function searchDocuments(query, docList) {
    if (!query.trim()) return [];
    
    const queryEmbedding = generateQueryEmbedding(query);
    const queryTerms = query.toLowerCase().split(' ');
    
    const results = docList.map(doc => {
        // Semantic similarity score
        const semanticScore = cosineSimilarity(queryEmbedding, doc.embedding);
        
        // Keyword matching score
        let keywordScore = 0;
        const docText = (doc.title + ' ' + doc.content + ' ' + doc.tags.join(' ')).toLowerCase();
        
        queryTerms.forEach(term => {
            if (docText.includes(term)) {
                keywordScore += 0.3;
            }
        });
        
        // Combined relevance score
        const relevanceScore = (semanticScore * 0.7) + (keywordScore * 0.3);
        
        return {
            ...doc,
            relevanceScore: relevanceScore,
            snippet: generateSnippet(doc.content, queryTerms)
        };
    }).filter(doc => doc.relevanceScore > 0.1)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    return results;
}

function generateSnippet(content, queryTerms) {
    const sentences = content.split('. ');
    let bestSentence = sentences[0];
    let maxMatches = 0;
    
    sentences.forEach(sentence => {
        let matches = 0;
        queryTerms.forEach(term => {
            if (sentence.toLowerCase().includes(term)) {
                matches++;
            }
        });
        if (matches > maxMatches) {
            maxMatches = matches;
            bestSentence = sentence;
        }
    });
    
    return bestSentence.length > 150 ? 
           bestSentence.substring(0, 150) + '...' : 
           bestSentence;
}

function displayDemoResults(results) {
    const resultsContainer = document.getElementById('demo-results');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found. Try a different search term.</p>';
        resultsContainer.classList.remove('hidden');
        return;
    }
    
    const html = results.slice(0, 3).map(doc => `
        <div class="demo-result">
            <h4>${doc.title}</h4>
            <p>${doc.snippet}</p>
            <span class="relevance-score">${(doc.relevanceScore * 100).toFixed(0)}% relevant</span>
        </div>
    `).join('');
    
    resultsContainer.innerHTML = html;
    resultsContainer.classList.remove('hidden');
}

function displaySearchResults(results, query) {
    const resultsContainer = document.getElementById('search-results');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <h3>No results found for "${query}"</h3>
                <p>Try different keywords or check the sample queries below.</p>
                <div class="sample-queries">
                    <h3>Try these sample queries:</h3>
                    <div class="sample-query-buttons">
                        <button class="btn btn--outline" onclick="setSampleQuery('AI applications in medical diagnosis')">
                            AI in Medical Diagnosis
                        </button>
                        <button class="btn btn--outline" onclick="setSampleQuery('environmental sustainability practices')">
                            Environmental Sustainability
                        </button>
                        <button class="btn btn--outline" onclick="setSampleQuery('emerging technology trends')">
                            Technology Trends
                        </button>
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    const html = `
        <div class="results-header">
            <h3>Found ${results.length} results for "${query}"</h3>
        </div>
        <div class="results-list">
            ${results.map(doc => `
                <div class="result-item">
                    <div class="result-header">
                        <h4 class="result-title">${doc.title}</h4>
                        <span class="relevance-score">${(doc.relevanceScore * 100).toFixed(0)}% relevant</span>
                    </div>
                    <div class="result-meta">
                        <span><i class="fas fa-user"></i> ${doc.author}</span>
                        <span><i class="fas fa-calendar"></i> ${formatDate(doc.uploadDate)}</span>
                        <span><i class="fas fa-file"></i> ${doc.type.toUpperCase()}</span>
                        <span><i class="fas fa-hdd"></i> ${doc.size}</span>
                    </div>
                    <p class="result-snippet">${doc.snippet}</p>
                    <div class="result-tags">
                        ${doc.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    resultsContainer.innerHTML = html;
}

function setSampleQuery(query) {
    document.getElementById('main-search').value = query;
    performSearch();
}

// Document Management
function renderDocuments() {
    const grid = document.getElementById('documents-grid');
    
    const html = documents.map(doc => `
        <div class="document-card" onclick="viewDocument('${doc.id}')">
            <div class="document-header">
                <h3 class="document-title">${doc.title}</h3>
                <div class="document-author">by ${doc.author}</div>
            </div>
            <div class="document-body">
                <div class="document-meta">
                    <span><i class="fas fa-calendar"></i> ${formatDate(doc.uploadDate)}</span>
                    <span><i class="fas fa-file"></i> ${doc.type.toUpperCase()}</span>
                    <span><i class="fas fa-hdd"></i> ${doc.size}</span>
                </div>
                <div class="document-preview">${doc.content.substring(0, 120)}...</div>
            </div>
            <div class="document-footer">
                <div class="result-tags">
                    ${doc.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="document-actions">
                    <button class="btn btn--sm btn--outline" onclick="event.stopPropagation(); downloadDocument('${doc.id}')">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    grid.innerHTML = html;
}

function viewDocument(docId) {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;
    
    showToast('Document Opened', `Opening ${doc.title}`, 'info');
}

function downloadDocument(docId) {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;
    
    showToast('Download Started', `Downloading ${doc.title}`, 'success');
}

function toggleViewMode() {
    isGridView = !isGridView;
    const icon = document.getElementById('view-mode-icon');
    const grid = document.getElementById('documents-grid');
    
    if (isGridView) {
        icon.className = 'fas fa-th';
        grid.className = 'documents-grid';
    } else {
        icon.className = 'fas fa-list';
        grid.className = 'documents-list';
    }
    
    renderDocuments();
}

// File Upload
function initializeFileUpload() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    
    if (!uploadArea || !fileInput) return;
    
    uploadArea.addEventListener('click', () => fileInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
    
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
}

function handleFiles(files) {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        const maxSize = 10 * 1024 * 1024; // 10MB
        
        if (!validTypes.includes(file.type)) {
            showToast('Invalid File Type', `${file.name} is not a supported file type.`, 'error');
            return false;
        }
        
        if (file.size > maxSize) {
            showToast('File Too Large', `${file.name} exceeds the 10MB limit.`, 'error');
            return false;
        }
        
        return true;
    });
    
    if (validFiles.length === 0) return;
    
    document.getElementById('upload-progress').classList.remove('hidden');
    uploadFiles(validFiles);
}

async function uploadFiles(files) {
    const uploadList = document.getElementById('upload-list');
    
    for (const file of files) {
        const uploadItem = createUploadItem(file);
        uploadList.appendChild(uploadItem);
        
        // Simulate upload progress
        await simulateUpload(uploadItem, file);
        
        // Add to documents
        const newDoc = {
            id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: file.name.replace(/\.[^/.]+$/, ""),
            author: currentUser.name,
            uploadDate: new Date().toISOString().split('T')[0],
            type: getFileExtension(file.name),
            size: formatFileSize(file.size),
            tags: ['uploaded', 'new'],
            content: `Content extracted from ${file.name}. This is a placeholder for the actual document content that would be extracted using OCR or document parsing libraries.`,
            embedding: generateQueryEmbedding(file.name),
            relevanceScore: 0.8
        };
        
        documents.unshift(newDoc);
    }
    
    // Update analytics
    analyticsData.totalDocuments += files.length;
    currentUser.documentsUploaded += files.length;
    
    updateDashboard();
    showToast('Upload Complete', `Successfully uploaded ${files.length} document(s).`, 'success');
    
    setTimeout(() => {
        document.getElementById('upload-progress').classList.add('hidden');
        uploadList.innerHTML = '';
    }, 2000);
}

function createUploadItem(file) {
    const item = document.createElement('div');
    item.className = 'upload-item';
    item.innerHTML = `
        <div class="upload-item-icon">
            <i class="fas fa-file"></i>
        </div>
        <div class="upload-item-info">
            <div class="upload-item-name">${file.name}</div>
            <div class="upload-item-size">${formatFileSize(file.size)}</div>
        </div>
        <div class="upload-item-progress">
            <div class="upload-item-progress-bar" style="width: 0%"></div>
        </div>
    `;
    return item;
}

async function simulateUpload(uploadItem, file) {
    const progressBar = uploadItem.querySelector('.upload-item-progress-bar');
    
    return new Promise(resolve => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                resolve();
            }
            progressBar.style.width = `${progress}%`;
        }, 200);
    });
}

function getFileExtension(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const typeMap = {
        'pdf': 'pdf',
        'docx': 'docx',
        'doc': 'docx',
        'txt': 'txt'
    };
    return typeMap[ext] || 'unknown';
}

// Dashboard Functions
function updateDashboard() {
    const totalDocsEl = document.getElementById('total-docs');
    const totalSearchesEl = document.getElementById('total-searches');
    const avgSearchTimeEl = document.getElementById('avg-search-time');
    const recentUploadsEl = document.getElementById('recent-uploads');
    
    if (totalDocsEl) totalDocsEl.textContent = analyticsData.totalDocuments;
    if (totalSearchesEl) totalSearchesEl.textContent = analyticsData.totalSearches;
    if (avgSearchTimeEl) avgSearchTimeEl.textContent = `${analyticsData.averageSearchTime}s`;
    if (recentUploadsEl) recentUploadsEl.textContent = currentUser.documentsUploaded;
    
    renderRecentActivity();
}

function renderRecentActivity() {
    const activityContainer = document.getElementById('recent-activity');
    if (!activityContainer) return;
    
    const activities = [
        {
            icon: 'fas fa-search',
            title: 'Searched for "machine learning applications"',
            time: '2 minutes ago'
        },
        {
            icon: 'fas fa-upload',
            title: 'Uploaded "Research_Paper_2024.pdf"',
            time: '1 hour ago'
        },
        {
            icon: 'fas fa-file-alt',
            title: 'Viewed "Quantum Computing Overview"',
            time: '3 hours ago'
        },
        {
            icon: 'fas fa-search',
            title: 'Searched for "climate change impact"',
            time: '5 hours ago'
        },
        {
            icon: 'fas fa-upload',
            title: 'Uploaded 3 new documents',
            time: '1 day ago'
        }
    ];
    
    const html = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
    
    activityContainer.innerHTML = html;
}

// Analytics & Charts
function initializeCharts() {
    setTimeout(() => {
        createSearchTrendsChart();
        createTopTermsChart();
        createDocTypesChart();
    }, 100);
}

function updateAnalyticsCharts() {
    // Update chart data when analytics view is active
    if (currentView === 'analytics') {
        initializeCharts();
    }
}

function createSearchTrendsChart() {
    const canvas = document.getElementById('search-trends-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: analyticsData.searchTrends.map(item => 
                new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            ),
            datasets: [{
                label: 'Daily Searches',
                data: analyticsData.searchTrends.map(item => item.searches),
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function createTopTermsChart() {
    const canvas = document.getElementById('top-terms-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: analyticsData.topSearchTerms.map(item => item.term),
            datasets: [{
                data: analyticsData.topSearchTerms.map(item => item.count),
                backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createDocTypesChart() {
    const canvas = document.getElementById('doc-types-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const typeCounts = documents.reduce((acc, doc) => {
        acc[doc.type] = (acc[doc.type] || 0) + 1;
        return acc;
    }, {});
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(typeCounts),
            datasets: [{
                label: 'Document Count',
                data: Object.values(typeCounts),
                backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Theme Management
function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-color-scheme', theme);
    
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    showToast('Theme Changed', `Switched to ${theme} theme.`, 'info');
}

// User Menu
function toggleUserMenu() {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
}

function showProfile() {
    showToast('Profile', 'Profile management coming soon!', 'info');
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
        dropdown.classList.add('hidden');
    }
}

function showSettings() {
    showToast('Settings', 'Settings panel coming soon!', 'info');
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
        dropdown.classList.add('hidden');
    }
}

// Onboarding Tour
function startTour() {
    tourStep = 0;
    document.getElementById('tour-overlay').classList.remove('hidden');
    showTourStep();
}

function showTourStep() {
    const step = tourSteps[tourStep];
    document.getElementById('tour-title').textContent = step.title;
    document.getElementById('tour-description').textContent = step.description;
    
    const nextBtn = document.querySelector('.tour-actions .btn--primary');
    if (nextBtn) {
        nextBtn.textContent = tourStep === tourSteps.length - 1 ? 'Finish' : 'Next';
    }
}

function nextTourStep() {
    tourStep++;
    if (tourStep >= tourSteps.length) {
        skipTour();
    } else {
        showTourStep();
    }
}

function skipTour() {
    const tourOverlay = document.getElementById('tour-overlay');
    if (tourOverlay) {
        tourOverlay.classList.add('hidden');
    }
    tourStep = 0;
}

// Demo Functions
function showDemo() {
    const demoSearch = document.getElementById('demo-search');
    if (demoSearch) {
        demoSearch.value = 'AI applications in medical diagnosis';
        performDemoSearch();
    }
}

// Search Suggestions
function initializeSearchSuggestions() {
    const searchInput = document.getElementById('main-search');
    const suggestions = document.getElementById('search-suggestions');
    
    if (!searchInput || !suggestions) return;
    
    searchInput.addEventListener('input', debounce((e) => {
        const query = e.target.value.trim();
        if (query.length < 2) {
            suggestions.classList.add('hidden');
            return;
        }
        
        const suggestionsList = generateSuggestions(query);
        if (suggestionsList.length > 0) {
            displaySuggestions(suggestionsList);
        } else {
            suggestions.classList.add('hidden');
        }
    }, 300));
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.classList.add('hidden');
        }
    });
}

function generateSuggestions(query) {
    const commonTerms = [
        'machine learning', 'artificial intelligence', 'climate change',
        'blockchain technology', 'quantum computing', 'sustainability',
        'healthcare AI', 'supply chain', 'urban development', 'ethics'
    ];
    
    return commonTerms
        .filter(term => term.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);
}

function displaySuggestions(suggestionsList) {
    const suggestions = document.getElementById('search-suggestions');
    const html = suggestionsList.map(suggestion => `
        <div class="suggestion-item" onclick="selectSuggestion('${suggestion}')">
            ${suggestion}
        </div>
    `).join('');
    
    suggestions.innerHTML = html;
    suggestions.classList.remove('hidden');
}

function selectSuggestion(suggestion) {
    const mainSearch = document.getElementById('main-search');
    const suggestions = document.getElementById('search-suggestions');
    
    if (mainSearch) mainSearch.value = suggestion;
    if (suggestions) suggestions.classList.add('hidden');
    
    performSearch();
}

// Initialize Filter Dropdowns
function initializeFilterDropdowns() {
    const typeFilter = document.getElementById('type-filter');
    const dateFilter = document.getElementById('date-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    if (typeFilter) {
        typeFilter.addEventListener('change', function(e) {
            showToast('Filter Applied', `Filtered by type: ${e.target.value || 'All Types'}`, 'info');
        });
    }
    
    if (dateFilter) {
        dateFilter.addEventListener('change', function(e) {
            showToast('Filter Applied', `Filtered by date: ${e.target.value || 'All Time'}`, 'info');
        });
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', function(e) {
            showToast('Sort Applied', `Sorted by: ${e.target.value}`, 'info');
        });
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        const landingPage = document.getElementById('landing-page');
        
        if (loadingScreen) loadingScreen.classList.add('hidden');
        if (landingPage) landingPage.classList.remove('hidden');
    }, 2000);
    
    // Initialize navigation event listeners with immediate attachment
    function initializeNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const viewName = this.getAttribute('data-view');
                console.log('Nav item clicked:', viewName);
                if (viewName) {
                    switchView(viewName);
                }
            });
        });
        
        // Initialize quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const text = this.textContent.trim().toLowerCase();
                console.log('Quick action clicked:', text);
                if (text.includes('upload')) {
                    switchView('upload');
                } else if (text.includes('search')) {
                    switchView('search');
                } else if (text.includes('analytics')) {
                    switchView('analytics');
                }
            });
        });
    }
    
    // Initialize navigation immediately and after app loads
    initializeNavigation();
    
    // Re-initialize navigation after authentication
    setTimeout(() => {
        initializeNavigation();
    }, 4000);
    
    // Initialize form handlers
    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Clear previous errors
            clearFieldError('email');
            clearFieldError('password');
            
            // Validate
            let isValid = true;
            
            if (!validateEmail(email)) {
                showFieldError('email', 'Please enter a valid email address.');
                isValid = false;
            }
            
            if (!validatePassword(password)) {
                showFieldError('password', 'Password must be at least 6 characters long.');
                isValid = false;
            }
            
            if (!isValid) return;
            
            // Simulate authentication
            const userData = authMode === 'signup' ? {
                name: document.getElementById('name').value || 'New User',
                email: email,
                role: document.getElementById('role').value || 'user'
            } : null;
            
            await authenticateUser(userData);
            
            // Re-initialize navigation after login
            setTimeout(() => {
                initializeNavigation();
            }, 500);
        });
    }
    
    // Initialize file upload
    initializeFileUpload();
    
    // Initialize search suggestions
    initializeSearchSuggestions();
    
    // Initialize filter dropdowns
    initializeFilterDropdowns();
    
    // Add search handlers
    const demoSearch = document.getElementById('demo-search');
    if (demoSearch) {
        demoSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performDemoSearch();
            }
        });
    }
    
    const mainSearch = document.getElementById('main-search');
    if (mainSearch) {
        mainSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-menu')) {
            const dropdown = document.getElementById('user-dropdown');
            if (dropdown) {
                dropdown.classList.add('hidden');
            }
        }
    });
});

// Auto-login for demo purposes (remove in production)
setTimeout(() => {
    if (!isAuthenticated) {
        authenticateUser();
        
        // Ensure navigation is working after auto-login
        setTimeout(() => {
            document.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    const viewName = this.getAttribute('data-view');
                    if (viewName) {
                        switchView(viewName);
                    }
                });
            });
        }, 500);
    }
}, 3000);