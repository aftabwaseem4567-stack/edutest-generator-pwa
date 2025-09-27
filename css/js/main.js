// EduTest Generator - Main JavaScript
class EduTestGenerator {
    constructor() {
        this.wordFile = null;
        this.pdfFile = null;
        this.isGenerating = false;
        this.init();
    }

    init() {
        this.setupFileUploads();
        this.setupGenerationButton();
        this.setupDemoButtons();
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupPWA();
    }

    setupFileUploads() {
        // Word file upload
        const wordUpload = document.getElementById('wordUpload');
        const wordFileInput = document.getElementById('wordFile');
        const wordFileInfo = document.getElementById('wordFileInfo');

        // PDF file upload
        const pdfUpload = document.getElementById('pdfUpload');
        const pdfFileInput = document.getElementById('pdfFile');
        const pdfFileInfo = document.getElementById('pdfFileInfo');

        // Setup drag and drop for Word files
        this.setupDragAndDrop(wordUpload, wordFileInput, wordFileInfo, 'word');
        
        // Setup drag and drop for PDF files
        this.setupDragAndDrop(pdfUpload, pdfFileInput, pdfFileInfo, 'pdf');

        // File input change handlers
        wordFileInput.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0], wordFileInfo, 'word');
        });

        pdfFileInput.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0], pdfFileInfo, 'pdf');
        });

        // Click to browse functionality
        wordUpload.addEventListener('click', () => wordFileInput.click());
        pdfUpload.addEventListener('click', () => pdfFileInput.click());
    }

    setupDragAndDrop(uploadArea, fileInput, fileInfo, type) {
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                this.handleFileSelect(files[0], fileInfo, type);
            }
        });
    }

    handleFileSelect(file, fileInfo, type) {
        if (!file) return;

        // Validate file type
        const validTypes = {
            word: ['.doc', '.docx', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            pdf: ['.pdf', 'application/pdf']
        };

        const isValidType = validTypes[type].some(validType => 
            file.name.toLowerCase().endsWith(validType.toLowerCase()) || 
            file.type === validType
        );

        if (!isValidType) {
            this.showError(`Please select a valid ${type.toUpperCase()} file.`);
            return;
        }

        // Store file reference
        if (type === 'word') {
            this.wordFile = file;
            document.getElementById('wordUpload').classList.add('file-selected');
        } else {
            this.pdfFile = file;
            document.getElementById('pdfUpload').classList.add('file-selected');
        }

        // Display file info
        fileInfo.innerHTML = `
            <h4><i class="fas fa-check-circle"></i> File Selected</h4>
            <p><strong>Name:</strong> ${file.name}</p>
            <p><strong>Size:</strong> ${this.formatFileSize(file.size)}</p>
            <p><strong>Type:</strong> ${file.type || 'Unknown'}</p>
        `;
        fileInfo.style.display = 'block';

        // Check if both files are uploaded
        this.updateGenerateButton();
    }

    updateGenerateButton() {
        const generateBtn = document.getElementById('generateBtn');
        const canGenerate = this.wordFile && this.pdfFile && !this.isGenerating;
        
        generateBtn.disabled = !canGenerate;
        
        if (canGenerate) {
            generateBtn.innerHTML = '<i class="fas fa-cogs"></i> Generate Test';
        } else if (this.isGenerating) {
            generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        } else {
            generateBtn.innerHTML = '<i class="fas fa-cogs"></i> Upload Both Files First';
        }
    }

    setupGenerationButton() {
        const generateBtn = document.getElementById('generateBtn');
        generateBtn.addEventListener('click', () => {
            if (this.wordFile && this.pdfFile && !this.isGenerating) {
                this.generateTest();
            }
        });
    }

    async generateTest() {
        this.isGenerating = true;
        this.updateGenerateButton();

        // Show loading modal
        const loadingModal = document.getElementById('loadingModal');
        const loadingText = document.getElementById('loadingText');
        const progressFill = document.getElementById('progressFill');
        
        loadingModal.style.display = 'flex';

        const steps = [
            { text: 'Analyzing reference format...', progress: 20 },
            { text: 'Processing PDF content...', progress: 40 },
            { text: 'Extracting key topics...', progress: 60 },
            { text: 'Generating questions...', progress: 80 },
            { text: 'Finalizing test format...', progress: 100 }
        ];

        // Simulate processing steps
        for (let i = 0; i < steps.length; i++) {
            await this.delay(1000 + Math.random() * 1000);
            loadingText.textContent = steps[i].text;
            progressFill.style.width = steps[i].progress + '%';
        }

        await this.delay(500);

        // Generate test content based on file analysis
        const testContent = await this.analyzeFilesAndGenerate();

        // Hide loading modal
        loadingModal.style.display = 'none';

        // Show results
        this.displayResults(testContent);

        this.isGenerating = false;
        this.updateGenerateButton();
    }

    async analyzeFilesAndGenerate() {
        // Simulate file analysis and determine test format
        const formats = ['mcq', 'short', 'mixed'];
        const selectedFormat = formats[Math.floor(Math.random() * formats.length)];
        
        const testTitle = document.getElementById('testTitle').value || 'Generated Test';
        const difficulty = document.getElementById('difficulty').value;

        return this.generateTestContent(selectedFormat, testTitle, difficulty);
    }

    generateTestContent(format, title, difficulty) {
        const testContent = {
            title: title,
            difficulty: difficulty,
            format: format,
            questions: []
        };

        switch (format) {
            case 'mcq':
                testContent.questions = this.generateMCQs(difficulty);
                break;
            case 'short':
                testContent.questions = this.generateShortQuestions(difficulty);
                break;
            case 'mixed':
                testContent.questions = [
                    ...this.generateMCQs(difficulty, 4),
                    ...this.generateShortQuestions(difficulty, 3)
                ];
                break;
        }

        return testContent;
    }

    generateMCQs(difficulty, count = 7) {
        const topics = [
            'Photosynthesis and plant biology',
            'Cellular respiration processes',
            'DNA structure and replication',
            'Protein synthesis mechanisms',
            'Evolution and natural selection',
            'Ecosystem dynamics',
            'Genetics and inheritance patterns'
        ];

        const mcqs = [];
        for (let i = 0; i < count; i++) {
            const topic = topics[i % topics.length];
            mcqs.push({
                type: 'mcq',
                number: i + 1,
                question: this.generateMCQQuestion(topic, difficulty),
                options: this.generateMCQOptions(topic, difficulty),
                correct: 'A',
                explanation: `This relates to ${topic} and demonstrates understanding of key concepts.`
            });
        }
        return mcqs;
    }

    generateShortQuestions(difficulty, count = 5) {
        const topics = [
            'photosynthesis process',
            'cell division mechanisms',
            'genetic inheritance',
            'ecosystem relationships',
            'metabolic pathways'
        ];

        const shortQuestions = [];
        for (let i = 0; i < count; i++) {
            const topic = topics[i % topics.length];
            shortQuestions.push({
                type: 'short',
                number: i + 1,
                question: this.generateShortQuestion(topic, difficulty),
                points: difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 8,
                expectedAnswer: `Expected answer should cover key aspects of ${topic} including main mechanisms and significance.`
            });
        }
        return shortQuestions;
    }

    generateMCQQuestion(topic, difficulty) {
        const questions = {
            easy: {
                'Photosynthesis and plant biology': 'Which of the following is the primary product of photosynthesis?',
                'Cellular respiration processes': 'What is the main purpose of cellular respiration?',
                'DNA structure and replication': 'DNA is composed of which type of molecules?'
            },
            medium: {
                'Photosynthesis and plant biology': 'In which part of the chloroplast does the light-dependent reaction of photosynthesis occur?',
                'Cellular respiration processes': 'How many ATP molecules are typically produced during aerobic cellular respiration?',
                'DNA structure and replication': 'Which enzyme is primarily responsible for unwinding the DNA double helix during replication?'
            },
            hard: {
                'Photosynthesis and plant biology': 'What would be the most likely effect of inhibiting ATP synthase in chloroplasts?',
                'Cellular respiration processes': 'If oxygen is not available during cellular respiration, which alternative pathway might cells use?',
                'DNA structure and replication': 'How does the leading strand differ from the lagging strand during DNA replication?'
            }
        };

        return questions[difficulty][topic] || `Analyze the relationship between ${topic} and cellular functions.`;
    }

    generateMCQOptions(topic, difficulty) {
        const optionSets = {
            'Photosynthesis and plant biology': [
                'A) Glucose and oxygen',
                'B) Carbon dioxide and water',
                'C) ATP and NADPH',
                'D) Chlorophyll and carotenoids'
            ],
            'Cellular respiration processes': [
                'A) To produce ATP energy',
                'B) To create glucose',
                'C) To store genetic information',
                'D) To synthesize proteins'
            ],
            'DNA structure and replication': [
                'A) Nucleotides',
                'B) Amino acids',
                'C) Fatty acids',
                'D) Simple sugars'
            ]
        };

        return optionSets[topic] || [
            'A) First option related to the topic',
            'B) Second option related to the topic',
            'C) Third option related to the topic',
            'D) Fourth option related to the topic'
        ];
    }

    generateShortQuestion(topic, difficulty) {
        const questions = {
            easy: {
                'photosynthesis process': 'Explain the basic equation of photosynthesis.',
                'cell division mechanisms': 'What are the main phases of mitosis?',
                'genetic inheritance': 'Define dominant and recessive alleles.'
            },
            medium: {
                'photosynthesis process': 'Compare and contrast the light-dependent and light-independent reactions of photosynthesis.',
                'cell division mechanisms': 'Explain how cytokinesis differs between plant and animal cells.',
                'genetic inheritance': 'Using a Punnett square, predict the offspring of a monohybrid cross.'
            },
            hard: {
                'photosynthesis process': 'Analyze the role of photosystem I and II in the light-dependent reactions and explain electron transport.',
                'cell division mechanisms': 'Critically evaluate the checkpoints in the cell cycle and their importance in preventing cancer.',
                'genetic inheritance': 'Explain the molecular basis of genetic inheritance including DNA transcription and translation.'
            }
        };

        return questions[difficulty][topic] || `Provide a detailed analysis of ${topic} and its biological significance.`;
    }

    displayResults(testContent) {
        // Update test info
        document.getElementById('generatedTestTitle').textContent = testContent.title;
        document.getElementById('generatedTestMeta').textContent = 
            `Format: ${testContent.format.toUpperCase()} | Difficulty: ${testContent.difficulty} | Questions: ${testContent.questions.length}`;

        // Generate test preview
        const testPreview = document.getElementById('testPreview');
        testPreview.innerHTML = this.generateTestHTML(testContent);

        // Show results section
        document.getElementById('results').style.display = 'block';
        
        // Scroll to results
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });

        // Setup result actions
        this.setupResultActions(testContent);
    }

    generateTestHTML(testContent) {
        let html = `
            <div class="test-header">
                <h2>${testContent.title}</h2>
                <p class="test-meta">
                    <i class="fas fa-clock"></i> Time: 60 minutes |
                    <i class="fas fa-question-circle"></i> Questions: ${testContent.questions.length} |
                    <i class="fas fa-signal"></i> Difficulty: ${testContent.difficulty}
                </p>
                <hr style="margin: 1.5rem 0; border: 1px solid #e2e8f0;">
            </div>
        `;

        testContent.questions.forEach(question => {
            if (question.type === 'mcq') {
                html += `
                    <div class="question">
                        <div class="question-number">Question ${question.number} (MCQ)</div>
                        <div class="question-text">${question.question}</div>
                        <ul class="question-options">
                            ${question.options.map(option => `<li>${option}</li>`).join('')}
                        </ul>
                        <div class="question-answer">
                            <strong>Correct Answer:</strong> ${question.correct}<br>
                            <strong>Explanation:</strong> ${question.explanation}
                        </div>
                    </div>
                `;
            } else if (question.type === 'short') {
                html += `
                    <div class="question">
                        <div class="question-number">Question ${question.number} (Short Answer - ${question.points} points)</div>
                        <div class="question-text">${question.question}</div>
                        <div class="question-answer">
                            <strong>Expected Answer:</strong> ${question.expectedAnswer}
                        </div>
                    </div>
                `;
            }
        });

        return html;
    }

    setupResultActions(testContent) {
        const editBtn = document.getElementById('editBtn');
        const downloadBtn = document.getElementById('downloadBtn');

        editBtn.onclick = () => {
            this.showInfo('Edit functionality would allow you to modify questions, add new ones, or change the test format.');
        };

        downloadBtn.onclick = () => {
            this.downloadTest(testContent);
        };
    }

    downloadTest(testContent) {
        // Create a simple text version for download
        let content = `${testContent.title}\n`;
        content += `Difficulty: ${testContent.difficulty} | Questions: ${testContent.questions.length}\n`;
        content += '='.repeat(50) + '\n\n';

        testContent.questions.forEach(question => {
            if (question.type === 'mcq') {
                content += `${question.number}. ${question.question}\n`;
                question.options.forEach(option => {
                    content += `   ${option}\n`;
                });
                content += `   Correct Answer: ${question.correct}\n\n`;
            } else {
                content += `${question.number}. ${question.question}\n`;
                content += `   (${question.points} points)\n\n`;
            }
        });

        // Create and trigger download
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${testContent.title.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.showSuccess('Test downloaded successfully!');
    }

    setupDemoButtons() {
        document.getElementById('demoMCQ').addEventListener('click', () => {
            this.runDemo('mcq');
        });

        document.getElementById('demoShort').addEventListener('click', () => {
            this.runDemo('short');
        });

        document.getElementById('demoMixed').addEventListener('click', () => {
            this.runDemo('mixed');
        });
    }

    runDemo(format) {
        // Simulate files being uploaded
        this.wordFile = { name: 'sample_format.docx', size: 15420, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
        this.pdfFile = { name: 'biology_chapter.pdf', size: 245680, type: 'application/pdf' };

        // Update UI to show files selected
        document.getElementById('wordUpload').classList.add('file-selected');
        document.getElementById('pdfUpload').classList.add('file-selected');

        document.getElementById('wordFileInfo').innerHTML = `
            <h4><i class="fas fa-check-circle"></i> Demo File Selected</h4>
            <p><strong>Name:</strong> ${this.wordFile.name}</p>
            <p><strong>Size:</strong> ${this.formatFileSize(this.wordFile.size)}</p>
            <p><strong>Type:</strong> Word Document</p>
        `;
        document.getElementById('wordFileInfo').style.display = 'block';

        document.getElementById('pdfFileInfo').innerHTML = `
            <h4><i class="fas fa-check-circle"></i> Demo File Selected</h4>
            <p><strong>Name:</strong> ${this.pdfFile.name}</p>
            <p><strong>Size:</strong> ${this.formatFileSize(this.pdfFile.size)}</p>
            <p><strong>Type:</strong> PDF Document</p>
        `;
        document.getElementById('pdfFileInfo').style.display = 'block';

        // Set demo values
        document.getElementById('testTitle').value = `Demo ${format.toUpperCase()} Test - Biology Chapter 3`;
        document.getElementById('difficulty').value = 'medium';

        this.updateGenerateButton();

        // Generate demo test
        const demoContent = this.generateTestContent(format, `Demo ${format.toUpperCase()} Test - Biology Chapter 3`, 'medium');
        
        // Show success message
        this.showSuccess(`Demo ${format.toUpperCase()} test ready! Click "Generate Test" to see the result.`);

        // Scroll to upload section
        document.getElementById('upload').scrollIntoView({ behavior: 'smooth' });
    }

    setupNavigation() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }

                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Close mobile menu if open
                const mobileNav = document.getElementById('mobileNav');
                const mobileToggle = document.getElementById('mobileMenuToggle');
                if (mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });

        // Update active nav on scroll
        window.addEventListener('scroll', () => {
            const sections = ['home', 'features', 'upload', 'demo'];
            const scrollPos = window.scrollY + 150;

            sections.forEach(sectionId => {
                const section = document.getElementById(sectionId);
                const navLinks = document.querySelectorAll(`[href="#${sectionId}"]`);
                
                if (section && navLinks.length > 0) {
                    const sectionTop = section.offsetTop;
                    const sectionBottom = sectionTop + section.offsetHeight;
                    
                    if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                        navLinks.forEach(link => link.classList.add('active'));
                    }
                }
            });
        });
    }

    setupMobileMenu() {
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const mobileNav = document.getElementById('mobileNav');

        mobileToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            const isActive = mobileNav.classList.contains('active');
            mobileToggle.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                mobileNav.classList.remove('active');
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }

    setupPWA() {
        let deferredPrompt;
        const installBanner = document.getElementById('pwaInstallBanner');
        const installBtn = document.getElementById('pwaInstallBtn');
        const dismissBtn = document.getElementById('pwaDismissBtn');

        // Listen for the beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('PWA install prompt available');
            e.preventDefault();
            deferredPrompt = e;
            
            // Show custom install banner
            installBanner.style.display = 'block';
        });

        // Handle install button click
        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) {
                this.showInfo('App installation is not available on this device/browser');
                return;
            }

            // Hide the banner
            installBanner.style.display = 'none';

            // Show the install prompt
            deferredPrompt.prompt();

            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`PWA install prompt outcome: ${outcome}`);

            if (outcome === 'accepted') {
                this.showSuccess('EduTest Generator installed successfully! Look for it in your app drawer.');
            } else {
                this.showInfo('App installation was cancelled');
            }

            deferredPrompt = null;
        });

        // Handle dismiss button click
        dismissBtn.addEventListener('click', () => {
            installBanner.style.display = 'none';
            deferredPrompt = null;
            
            // Don't show again for this session
            sessionStorage.setItem('pwa-install-dismissed', 'true');
        });

        // Check if already dismissed in this session
        if (sessionStorage.getItem('pwa-install-dismissed')) {
            installBanner.style.display = 'none';
        }

        // Listen for successful installation
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.showSuccess('EduTest Generator installed! You can now use it like a native app.');
            installBanner.style.display = 'none';
            deferredPrompt = null;
        });

        // Check if running as PWA
        if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
            console.log('Running as PWA');
            document.body.classList.add('pwa-mode');
        }

        // Service Worker messaging
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'SW_UPDATED') {
                    this.showInfo('App updated! Refresh to get the latest version.');
                }
            });
        }
    }

    // Utility functions
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showInfo(message) {
        this.showNotification(message, 'info');
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${message}
        `;

        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            zIndex: '3000',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            maxWidth: '300px',
            animation: 'slideIn 0.3s ease'
        });

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EduTestGenerator();
});
