/**
 * 应用主逻辑
 */

let matcher = null;
let knowledgeBase = {};

// DOM元素
const elements = {
    loadingOverlay: null,
    questionInput: null,
    searchBtn: null,
    clearBtn: null,
    resultContainer: null,
    noResultContainer: null,
    matchedQuestion: null,
    answerText: null,
    confidenceBadge: null,
    questionCount: null,
    popularQuestions: null,
    suggestionsContainer: null
};

/**
 * 初始化应用
 */
async function initApp() {
    // 获取DOM元素
    elements.loadingOverlay = document.getElementById('loadingOverlay');
    elements.questionInput = document.getElementById('questionInput');
    elements.searchBtn = document.getElementById('searchBtn');
    elements.clearBtn = document.getElementById('clearBtn');
    elements.resultContainer = document.getElementById('resultContainer');
    elements.noResultContainer = document.getElementById('noResultContainer');
    elements.matchedQuestion = document.getElementById('matchedQuestion');
    elements.answerText = document.getElementById('answerText');
    elements.confidenceBadge = document.getElementById('confidenceBadge');
    elements.questionCount = document.getElementById('questionCount');
    elements.popularQuestions = document.getElementById('popularQuestions');
    elements.suggestionsContainer = document.getElementById('suggestionsContainer');
    
    // 加载知识库
    await loadKnowledgeBase();

    // 恶俗
    console.log("Hello Dream,Hello Peter,I want to heni Peng Peng Peng Peng Peng Peng");
    console.log("WeChat:abc1094359168")
    
    // 初始化匹配器
    matcher = new AdvancedQuestionMatcher(knowledgeBase);
    
    // 更新问题数量
    elements.questionCount.textContent = Object.keys(knowledgeBase).length;
    
    // 显示热门问题
    displayPopularQuestions();
    
    // 绑定事件
    bindEvents();
    
    // 隐藏加载动画
    setTimeout(() => {
        elements.loadingOverlay.classList.add('hidden');
    }, 500);
}

/**
 * 加载知识库
 */
async function loadKnowledgeBase() {
    try {
        const response = await fetch('关于松未_你有什么想问的_._总稿.json');
        if (!response.ok) throw new Error('无法加载知识库');
        knowledgeBase = await response.json();
    } catch (error) {
        console.error('加载知识库错误:', error);
        knowledgeBase = {
            "徒步是什么？": "每年3月，初一、初二、高一和高二会到松山湖边徒步。",
            "能带手机吗？": "原则上不能，但可以向班主任申请。",
            "宿舍是几人间？": "目前高一、二男生是7人间，高三男生6人间，女生是6人间。"
        };
    }
}

/**
 * 绑定事件
 */
function bindEvents() {
    // 搜索按钮点击
    elements.searchBtn.addEventListener('click', handleSearch);
    
    // 输入框回车
    elements.questionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    // 输入框输入事件
    elements.questionInput.addEventListener('input', (e) => {
        elements.clearBtn.style.display = e.target.value ? 'flex' : 'none';
        handleInputChange(e.target.value);
    });
    
    // 点击外部关闭建议
    document.addEventListener('click', (e) => {
        if (!elements.questionInput.contains(e.target) && !elements.suggestionsContainer.contains(e.target)) {
            hideSuggestions();
        }
    });
    
    // 清除按钮
    elements.clearBtn.addEventListener('click', () => {
        elements.questionInput.value = '';
        elements.clearBtn.style.display = 'none';
        elements.questionInput.focus();
        hideResults();
        hideSuggestions();
    });
}

/**
 * 处理搜索
 */
function handleSearch() {
    const question = elements.questionInput.value.trim();
    
    if (!question) {
        showNotification('请输入问题');
        return;
    }
    
    // 特殊规则处理
    if (question.includes('夏令营')) {
        showNoResult('此问题请询问作者或管理员。');
        return;
    }
    
    if (question.includes('时候')) {
        if (!confirm('如果是关于日常作息的，请点击"确定"查看文档；如果不是，请点击"取消"继续搜索。')) {
            performSearch(question);
        } else {
            window.open('https://docs.qq.com/sheet/DSEVCYkJhUXVGVVFs', '_blank');
        }
        return;
    }
    
    if (question.includes('哪里') || question.includes('在哪')) {
        if (!confirm('如果是关于学校建筑位置的，请点击"确定"查看文档；如果不是，请点击"取消"继续搜索。')) {
            performSearch(question);
        } else {
            window.open('https://docs.qq.com/pdf/DSHBieVVBS01RUUZU', '_blank');
        }
        return;
    }
    
    performSearch(question);
}

/**
 * 执行搜索
 */
function performSearch(question) {
    // 显示加载状态
    elements.searchBtn.textContent = '搜索中...';
    elements.searchBtn.disabled = true;
    
    // 使用setTimeout模拟异步，避免UI阻塞
    setTimeout(() => {
        const result = matcher.answerQuestion(question);
        
        if (result.success) {
            showResult(result);
        } else {
            showNoResult(result.message);
        }
        
        // 恢复按钮状态
        elements.searchBtn.textContent = '搜索';
        elements.searchBtn.disabled = false;
    }, 100);
}

/**
 * 显示结果
 */
function showResult(result) {
    elements.matchedQuestion.textContent = result.question;
    elements.answerText.textContent = result.answer;
    elements.confidenceBadge.textContent = `匹配度 ${result.confidence}%`;
    
    // 根据置信度设置颜色
    if (result.confidence >= 80) {
        elements.confidenceBadge.style.background = 'linear-gradient(135deg, #34C759, #30D158)';
    } else if (result.confidence >= 60) {
        elements.confidenceBadge.style.background = 'linear-gradient(135deg, #FF9500, #FF9F0A)';
    } else {
        elements.confidenceBadge.style.background = 'linear-gradient(135deg, #FF3B30, #FF453A)';
    }
    
    elements.resultContainer.style.display = 'block';
    elements.noResultContainer.style.display = 'none';
    
    // 滚动到结果
    elements.resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * 显示无结果
 */
function showNoResult(message) {
    const noResultCard = elements.noResultContainer.querySelector('.no-result-card p');
    noResultCard.textContent = message;
    
    elements.resultContainer.style.display = 'none';
    elements.noResultContainer.style.display = 'block';
    
    // 滚动到结果
    elements.noResultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * 隐藏结果
 */
function hideResults() {
    elements.resultContainer.style.display = 'none';
    elements.noResultContainer.style.display = 'none';
}

/**
 * 显示通知
 */
function showNotification(message) {
    // 简单的alert，可以后续改进为更美观的通知
    alert(message);
}

/**
 * 显示热门问题
 */
function displayPopularQuestions() {
    const questions = Object.keys(knowledgeBase);
    
    // 随机选择8个问题
    const popularCount = Math.min(8, questions.length);
    const shuffled = questions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, popularCount);
    
    elements.popularQuestions.innerHTML = '';
    
    selected.forEach(question => {
        const item = document.createElement('div');
        item.className = 'popular-item';
        item.innerHTML = `<div class="popular-item-text">${question}</div>`;
        
        item.addEventListener('click', () => {
            elements.questionInput.value = question;
            elements.clearBtn.style.display = 'flex';
            handleSearch();
            
            // 滚动到搜索框
            elements.questionInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        
        elements.popularQuestions.appendChild(item);
    });
}

/**
 * 处理输入变化，显示建议
 */
function handleInputChange(value) {
    const trimmedValue = value.trim();
    
    if (!trimmedValue || trimmedValue.length < 2) {
        hideSuggestions();
        return;
    }
    
    // 获取相关问题建议
    const suggestions = getSuggestions(trimmedValue, 5);
    
    if (suggestions.length === 0) {
        hideSuggestions();
        return;
    }
    
    displaySuggestions(suggestions);
}

/**
 * 获取问题建议
 */
function getSuggestions(query, limit = 5) {
    const questions = Object.keys(knowledgeBase);
    const scored = [];
    
    questions.forEach(question => {
        const score = matcher.ensembleSimilarity(query, question);
        if (score > 0.1) { // 降低阈值以显示更多建议
            scored.push({ question, score });
        }
    });
    
    // 按分数排序并返回前N个
    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.question);
}

/**
 * 显示建议列表
 */
function displaySuggestions(suggestions) {
    elements.suggestionsContainer.innerHTML = '';
    
    suggestions.forEach((suggestion, index) => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.innerHTML = `
            <svg class="suggestion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
            </svg>
            <span class="suggestion-text">${suggestion}</span>
        `;
        
        // 点击建议项
        item.addEventListener('click', () => {
            elements.questionInput.value = suggestion;
            elements.clearBtn.style.display = 'flex';
            hideSuggestions();
            handleSearch();
        });
        
        elements.suggestionsContainer.appendChild(item);
    });
    
    elements.suggestionsContainer.style.display = 'block';
}

/**
 * 隐藏建议列表
 */
function hideSuggestions() {
    if (elements.suggestionsContainer) {
        elements.suggestionsContainer.style.display = 'none';
    }
}

/**
 * 页面加载完成后初始化
 */
document.addEventListener('DOMContentLoaded', initApp);

/**
 * 添加一些实用的键盘快捷键
 */
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K 聚焦搜索框
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        elements.questionInput.focus();
    }
    
    // ESC 清除搜索
    if (e.key === 'Escape') {
        elements.questionInput.value = '';
        elements.clearBtn.style.display = 'none';
        hideResults();
        hideSuggestions();
    }
    
    // 上下箭头导航建议
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const suggestionItems = elements.suggestionsContainer?.querySelectorAll('.suggestion-item');
        if (suggestionItems && suggestionItems.length > 0) {
            e.preventDefault();
            // 可以添加键盘导航逻辑
        }
    }
});
