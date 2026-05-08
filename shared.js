/**
 * shared.js - OpenAtom Club 全站共享脚本
 * 包含：主题切换、回到顶部、搜索弹窗等通用交互
 */

(function () {
    // ========== 主题切换 ==========
    // 页面加载时恢复用户之前的主题偏好
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light');
    }

    // 更新主题按钮图标
    function updateThemeIcon() {
        var btn = document.querySelector('.theme-toggle');
        if (btn) {
            btn.textContent = document.body.classList.contains('light') ? '🌙' : '☀️';
            btn.setAttribute('title', document.body.classList.contains('light') ? '切换到暗色主题' : '切换到亮色主题');
        }
    }
    updateThemeIcon();

    // 暴露到全局，供 onclick 调用
    window.toggleTheme = function () {
        document.body.classList.toggle('light');
        var isLight = document.body.classList.contains('light');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        updateThemeIcon();
    };

    // ========== 回到顶部按钮 ==========
    var backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
    }

    // 暴露到全局
    window.scrollToTop = function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
})();
