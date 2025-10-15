/**
 * upload.js - File Upload and Processing
 * Handles file selection, reading with FileReader, and triggers analysis
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initializeUpload();
});

/**
 * Initialize upload functionality
 */
function initializeUpload() {
    const fileInput = document.getElementById('fileInput');
    const uploadZone = document.getElementById('uploadZone');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    if (!fileInput || !uploadZone) {
        console.error('Upload elements not found');
        return;
    }
    
    // File input change event
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop events
    uploadZone.addEventListener('dragover', handleDragOver);
    uploadZone.addEventListener('dragleave', handleDragLeave);
    uploadZone.addEventListener('drop', handleDrop);
    
    // Click on upload zone to trigger file input
    uploadZone.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Analyze button click
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', processFile);
    }
}

/**
 * Handle file selection from input
 * @param {Event} e - Change event
 */
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        displayFileInfo(file);
    }
}

/**
 * Handle drag over event
 * @param {Event} e - Drag event
 */
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
}

/**
 * Handle drag leave event
 * @param {Event} e - Drag event
 */
function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
}

/**
 * Handle file drop
 * @param {Event} e - Drop event
 */
function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        
        // Validate file type
        if (file.name.endsWith('.log') || file.name.endsWith('.txt')) {
            // Manually set the file to the input element
            const fileInput = document.getElementById('fileInput');
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
            
            displayFileInfo(file);
        } else {
            alert('❌ Please upload a .log or .txt file');
        }
    }
}

/**
 * Display selected file information
 * @param {File} file - Selected file
 */
function displayFileInfo(file) {
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const uploadZone = document.getElementById('uploadZone');
    
    // Validate file size (max 10MB for Phase 1)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
        alert(`❌ File is too large (${(file.size / 1024 / 1024).toFixed(2)} MB). Maximum size is 10 MB.`);
        return;
    }
    
    // Display file info
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    
    // Show file info section and hide upload zone
    uploadZone.style.display = 'none';
    fileInfo.style.display = 'block';
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size
 */
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

/**
 * Process the uploaded file
 * Reads file, parses it, analyzes it, and redirects to results
 */
function processFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('❌ Please select a file first');
        return;
    }
    
    // Show loading spinner
    const fileInfo = document.getElementById('fileInfo');
    const loadingSpinner = document.getElementById('loadingSpinner');
    fileInfo.style.display = 'none';
    loadingSpinner.style.display = 'block';
    
    // Use FileReader to read the file
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const logContent = e.target.result;
            
            console.log('📄 File read successfully, starting analysis...');
            
            // Step 1: Parse the log file
            const parsedEntries = parseLog(logContent);
            
            if (parsedEntries.length === 0) {
                alert('❌ No valid log entries found in the file. Please check the log format.');
                resetUploadUI();
                return;
            }
            
            console.log(`✅ Parsed ${parsedEntries.length} entries`);
            
            // Step 2: Analyze for anomalies
            const anomalies = analyzeLog(parsedEntries);
            
            console.log(`✅ Found ${anomalies.length} anomalies`);
            
            // Step 3: Save results to sessionStorage
            const results = {
                parsed: parsedEntries,
                anomalies: anomalies,
                filename: file.name,
                fileSize: file.size,
                analyzedAt: new Date().toISOString()
            };
            
            sessionStorage.setItem('results', JSON.stringify(results));
            
            // Step 4: Redirect to results page
            console.log('✅ Analysis complete, redirecting to results...');
            window.location.href = 'results.html';
            
        } catch (error) {
            console.error('Error processing file:', error);
            alert('❌ Error analyzing the file: ' + error.message);
            resetUploadUI();
        }
    };
    
    reader.onerror = function(e) {
        console.error('Error reading file:', e);
        alert('❌ Error reading the file. Please try again.');
        resetUploadUI();
    };
    
    // Start reading the file as text
    reader.readAsText(file);
}

/**
 * Reset upload UI to initial state
 */
function resetUploadUI() {
    const fileInfo = document.getElementById('fileInfo');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const uploadZone = document.getElementById('uploadZone');
    
    fileInfo.style.display = 'none';
    loadingSpinner.style.display = 'none';
    uploadZone.style.display = 'block';
    
    // Clear file input
    document.getElementById('fileInput').value = '';
}

