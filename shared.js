
// ========================================
// 成电开放原子开源社团 - 共享脚本 v2.0
// 功能：主题切换 + 回到顶部 + 导航栏滚动效果 + 入场动画
// ========================================

(function() {
    'use strict';

    // ========== 主题切换 ==========
    window.toggleTheme = function() {
        document.body.classList.toggle('light');
        var isLight = document.body.classList.contains('light');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        // 切换按钮图标
        var btns = document.querySelectorAll('.theme-toggle');
        btns.forEach(function(b) {
            b.textContent = isLight ? '☀️' : '🌙';
            // 加个弹跳动画
            b.style.transform = 'rotate(360deg) scale(0.8)';
            setTimeout(function() { b.style.transform = ''; }, 300);
        });
    };

    // 读取保存的主题
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light');
        var btns = document.querySelectorAll('.theme-toggle');
        btns.forEach(function(b) { b.textContent = '☀️'; });
    }

    // ========== 回到顶部 ==========
    window.scrollToTop = function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    var backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });
    }

    // ========== 导航栏滚动效果 ==========
    var navbar = document.querySelector('.navbar');
    if (navbar) {
        var lastScrollY = 0;
        var ticking = false;
        
        window.addEventListener('scroll', function() {
            lastScrollY = window.scrollY;
            if (!ticking) {
                requestAnimationFrame(function() {
                    if (lastScrollY > 20) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ========== 滚动入场动画 (IntersectionObserver) ==========
    if ('IntersectionObserver' in window) {
        var animObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    animObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        // 观察所有带 animate 类的元素（如果还没被 CSS 动画处理）
        document.querySelectorAll('[data-animate]').forEach(function(el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            animObserver.observe(el);
        });

        // 自动给 sidebar-card 和 feature-card 加观察（如果没有动画类）
        document.querySelectorAll('.sidebar-card, .feature-card, .resource-card, .contact-card, .member-card, .project-card, .blog-card').forEach(function(el) {
            if (!el.className.includes('animate-')) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(16px)';
                el.style.transition = 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)';
                animObserver.observe(el);
            }
        });
    }

    // ========== 数字计数器动画 ==========
    function animateNumbers() {
        if (!('IntersectionObserver' in window)) return;
        
        var numObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var target = parseInt(entry.target.getAttribute('data-count') || entry.target.textContent);
                    if (isNaN(target)) return;
                    
                    var current = 0;
                    var step = Math.max(1, Math.floor(target / 40));
                    var el = entry.target;
                    
                    var timer = setInterval(function() {
                        current += step;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        el.textContent = current.toLocaleString();
                    }, 25);
                    
                    numObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('[data-count]').forEach(function(el) {
            numObserver.observe(el);
        });
    }
    animateNumbers();

})();
