$(function () {
    const percentText = document.getElementById('percent');
    const imgEls = Array.from(document.images);
    const bgEls = Array.from(document.querySelectorAll('.lazy-bg'));

    const total = imgEls.length + bgEls.length;
    let loaded = 0;
    let minTimeDone = false;
    let imageLoadDone = false;
    const minDuration = 2000;
    const startTime = performance.now();
    let displayPercent = 0;

    function incrementLoaded() {
        loaded++;
        if (loaded === total) {
            imageLoadDone = true;
        }
    }

    function checkFinish() {
        if (minTimeDone && imageLoadDone) {
            setTimeout(() => {
                document.documentElement.classList.add('is-page-loaded');

                // ✅ スクロール解放（Lenis再開）
                lenis.start();
            }, 300);
        }
    }
    // Lenis 初期化
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    const lenis = new Lenis({
        duration: 1,
        lerp: isMobile ? .7 : 0.5,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        smooth: true,
        smoothTouch: true,
    });
    lenis.stop(); // 🔒 読み込み完了までスクロール禁止

    // スクロール位置が変わるたびに呼ばれる
    lenis.on('scroll', (e) => {
        // console.log(e)
    })
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    function updateProgress(timestamp) {
        const elapsed = timestamp - startTime;
        const timeRatio = Math.min(elapsed / minDuration, 1);
        const loadRatio = total > 0 ? loaded / total : 1;
        const effectiveRatio = elapsed < minDuration
            ? Math.min(timeRatio, loadRatio)
            : loadRatio;

        const targetPercent = Math.floor(effectiveRatio * 100);
        displayPercent += (targetPercent - displayPercent) * 0.2;
        const percentValue = Math.floor(displayPercent);
        percentText.textContent = percentValue;

        // ✅ マスク形状だけを拡大
        gsap.set(".mask-shape", {
            scale: percentValue / 100,
            transformOrigin: "center bottom"
        });

        if (elapsed >= minDuration) {
            minTimeDone = true;
        }

        if (!minTimeDone || !imageLoadDone) {
            requestAnimationFrame(updateProgress);
        } else {
            percentText.textContent = 100;
            gsap.set(".mask-shape", { scale: 1 });
            checkFinish();
        }
    }

    requestAnimationFrame(updateProgress);

    /* === 画像監視 === */
    imgEls.forEach(img => {
        if (img.complete) {
            incrementLoaded();
        } else {
            img.addEventListener('load', incrementLoaded);
            img.addEventListener('error', incrementLoaded);
        }
    });

    /* === 背景監視 === */
    bgEls.forEach(el => {
        const bgUrl = el.dataset.bg;
        if (!bgUrl) {
            incrementLoaded();
            return;
        }
        const img = new Image();
        img.src = bgUrl;
        img.onload = () => {
            el.style.backgroundImage = `url(${bgUrl})`;
            el.classList.add('is-loaded');
            incrementLoaded();
        };
        img.onerror = () => incrementLoaded();
    });

    if (total === 0) {
        imageLoadDone = true;
    }
});





function getUser() {
    this.getDevice = function (i) {
        if (i <= 767) {
            is_sp = true;
            is_pad = false;
            is_pc = false;
            this.device = 'is_sp';
            $('html').addClass('is-sp').removeClass('is-pad is-pc');
        } else if (i <= 1023) {
            is_pad = true;
            is_sp = false;
            is_pc = false;
            this.device = 'is_pad';
            $('html').addClass('is-pad').removeClass('is-sp is-pc');
        } else {
            is_sp = false;
            is_pad = false;
            is_pc = true;
            this.device = 'is_pc';
            $('html').addClass('is-pc').removeClass('is-sp is-pad');
        }
        return false;
    },
        this.getBrows = function () {

            var _ua = window.navigator.userAgent;
            if (_ua.match(/MSIE/) || _ua.match(/Trident/)) {
                this.brows = 'is_ie';
                $('html').addClass('is-ie');
            } else if (_ua.indexOf("Edge") > -1) {
                this.brows = 'is_edge';
                $('html').addClass('is_edge is_ie11');
            } else if (_ua.indexOf("Firefox") > -1) {
                this.brows = 'is_firefox';
                $('html').addClass('is-firefox');
            } else if (_ua.indexOf("Chrome") > -1) {
                this.brows = 'is_chrome';
                $('html').addClass('is-chrome');
            } else if (_ua.indexOf("Opera") > -1) {
                this.brows = 'is_opera';
                $('html').addClass('is-opera');
            } else if (_ua.indexOf("Safari") > -1) {
                this.brows = 'is_safari';
                $('html').addClass('is-safari');
            } else {
                this.brows = 'is_other';
                $('html').addClass('is-other');
            }
            return false;
        }
};

$(function () {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-onscreen');
            } else {
                entry.target.classList.remove('is-onscreen');
            }
        });
    });

    document.querySelectorAll('.js-onscreen').forEach(el => {
        observer.observe(el);
    });

});



$(function () {
    var e = "onwheel" in document ? "wheel" : "onmousewheel" in document ? "mousewheel" : "DOMMouseScroll";
    $(document).on(e, function (e) {
        e.preventDefault()
    }), $(document).on("touchmove.noScroll", function (e) {
        e.preventDefault()
    })
});


$(function () {
    var e = "onwheel" in document ? "wheel" : "onmousewheel" in document ? "mousewheel" : "DOMMouseScroll";
    $(document).off(e), $(document).off(".noScroll")
});
var timer, common = common || {},
    $window = $(window),
    $document = $(document),
    $html = $("html"),
    $body = $("body"),
    $wrapper = $(".l-wrapper"),
    $gnav = $(".l-gnav"),
    $main = $(".l-main"),
    scrVal = 0,
    windowWidth = window.innerWidth,
    windowHeight = window.innerHeight,
    conf = {
        padWidth: 1023,
        mobileWidth: 767,
        device: "pc",
        devicemode: null
    },
    flag = {
        isLoaded: !1,
        isFirst: !1,
        isReel: !1,
        isNavi: !1,
        isTransition: !1,
        isHome: !1
    },
    timerflg = !1;






$(function () {
    let loopState = false;
    function toggleLoop() {
        loopState = !loopState;
        $('.js-loop').toggleClass('is-loop', loopState);
        setTimeout(() => {
            requestAnimationFrame(toggleLoop);
        }, 1000);
    }
    toggleLoop();
});







$(function () {

    //header
    gsap.to('.l-header-logo', {
        scrollTrigger: {
            trigger: '.l-content',
            toggleActions: "play none none reverse", // 上スクロールで戻る
            start: "top top",
            invalidateOnRefresh: !0,
            toggleClass: {
                targets: ".l-header,.l-gnav__btn", // クラスを切り替える対象の要素
                className: "is-active", // クラス名 "active" を切り替える
            },
        },
    });
    gsap.to('.l-header-logo', {
        scrollTrigger: {
            trigger: '.p-product',
            toggleActions: "play none none reverse", // 上スクロールで戻る
            start: "top top",
            invalidateOnRefresh: !0,
            toggleClass: {
                targets: ".l-header", // クラスを切り替える対象の要素
                className: "is-active-2", // クラス名 "active" を切り替える
            },
        },
    });
    gsap.to('.l-header-logo', {
        scrollTrigger: {
            trigger: '.p-product',
            toggleActions: "play none none reverse", // 上スクロールで戻る
            start: "top -15%",
            invalidateOnRefresh: !0,
            toggleClass: {
                targets: ".c-logo,.l-gnav__btn", // クラスを切り替える対象の要素
                className: "is-active", // クラス名 "active" を切り替える
            },
        },
    });
    gsap.to('.l-header-logo', {
        scrollTrigger: {
            trigger: '.p-spec',
            toggleActions: "play none none reverse", // 上スクロールで戻る
            start: "top top",
            invalidateOnRefresh: !0,
            toggleClass: {
                targets: ".l-header", // クラスを切り替える対象の要素
                className: "is-active-2", // クラス名 "active" を切り替える
            },
        },
    });
    gsap.to('.l-header-logo', {
        scrollTrigger: {
            trigger: '.p-spec',
            toggleActions: "play none none reverse", // 上スクロールで戻る
            start: "top top",
            invalidateOnRefresh: !0,
            toggleClass: {
                targets: ".c-logo,.l-gnav__btn", // クラスを切り替える対象の要素
                className: "is-active", // クラス名 "active" を切り替える
            },
        },
    });

    gsap.to('.l-header-logo', {
        scrollTrigger: {
            trigger: '.p-order',
            toggleActions: "play none none reverse", // 上スクロールで戻る
            start: "top top",
            invalidateOnRefresh: !0,
            toggleClass: {
                targets: ".l-header", // クラスを切り替える対象の要素
                className: "is-active-2", // クラス名 "active" を切り替える
            },
        },
    });
    gsap.to('.l-header-logo', {
        scrollTrigger: {
            trigger: '.p-order',
            toggleActions: "play none none reverse", // 上スクロールで戻る
            start: "top top",
            invalidateOnRefresh: !0,
            toggleClass: {
                targets: ".c-logo,.l-gnav__btn", // クラスを切り替える対象の要素
                className: "is-active", // クラス名 "active" を切り替える
            },
        },
    });
    gsap.to('.l-header-logo', {
        scrollTrigger: {
            trigger: '.p-footer',
            toggleActions: "play none none reverse", // 上スクロールで戻る
            start: "top top",
            invalidateOnRefresh: !0,
            toggleClass: {
                targets: ".l-header", // クラスを切り替える対象の要素
                className: "is-active-2", // クラス名 "active" を切り替える
            },
        },
    });
    gsap.to('.l-header-logo', {
        scrollTrigger: {
            trigger: '.p-footer',
            toggleActions: "play none none reverse", // 上スクロールで戻る
            start: "top top",
            invalidateOnRefresh: !0,
            toggleClass: {
                targets: ".c-logo,.l-gnav__btn", // クラスを切り替える対象の要素
                className: "is-active", // クラス名 "active" を切り替える
            },
        },
    });
    //header

    if (window.matchMedia('(min-width: 767px)').matches) {
        gsap.to('.p-kv__logo img', {
            duration: 1,
            opacity: "0",
            scrollTrigger: {
                trigger: '.p-kv__space',
                start: "top 200%",
                end: "top 90%",
                invalidateOnRefresh: !0,
                scrub: 1
            }
        });
        gsap.to('.p-kv__produce-inner', {
            duration: 1,
            opacity: "0",
            scrollTrigger: {
                trigger: '.p-kv__space',
                start: "top 200%",
                end: "top 90%",
                invalidateOnRefresh: !0,
                scrub: 1
            }
        });

        gsap.to('.c-scroll__inner', {
            duration: 1,
            opacity: "0",
            scrollTrigger: {
                trigger: '.p-kv__space',
                start: "top 200%",
                end: "top 90%",
                invalidateOnRefresh: !0,
                scrub: 1
            }
        });
        gsap.to('.p-kv__img-mask-text-inner', {
            duration: 1,
            opacity: "0",
            scrollTrigger: {
                trigger: '.p-kv__space',
                start: "top 200%",
                end: "top 90%",
                invalidateOnRefresh: !0,
                scrub: 1
            }
        });
    }
    if (window.matchMedia('(max-width: 768px)').matches) {
        gsap.to('.p-kv__logo img', {
            duration: 1,
            opacity: "0",
            scrollTrigger: {
                trigger: '.p-kv__space',
                start: "top bottom",
                end: "top 80%",// 上に着くまで
                scrub: true            // スクロール連動
            }
        });
        gsap.to('.p-kv__produce-inner', {
            duration: 1,
            opacity: "0",
            scrollTrigger: {
                trigger: '.p-kv__space',
                start: "top bottom",
                end: "top 80%",// 上に着くまで
                scrub: true            // スクロール連動
            }
        });

        gsap.to('.c-scroll__inner', {
            duration: 1,
            opacity: "0",
            scrollTrigger: {
                trigger: '.p-kv__space',
                start: "top bottom",
                end: "top 80%",// 上に着くまで
                scrub: true            // スクロール連動
            }
        });
        gsap.to('.p-kv__img-mask-text-inner', {
            duration: 1,
            opacity: "0",
            scrollTrigger: {
                trigger: '.p-kv__space',
                start: "top bottom",
                end: "top 80%",// 上に着くまで
                scrub: true            // スクロール連動
            }
        });
    }
    gsap.to('.l-header-logo', {
        duration: 1,
        opacity: "1",
        scrollTrigger: {
            trigger: '.p-kv__space',
            start: "top 90%",
            end: "top 90%",
            invalidateOnRefresh: !0,
            scrub: 1
        }
    });

    gsap.to('.p-kv__img-mask', {
        duration: 1,
        opacity: "0",
        scrollTrigger: {
            trigger: '.p-kv__space',
            start: "center bottom",
            end: "center top",
            invalidateOnRefresh: !0,
            scrub: 1
        }
    });
    gsap.to('.p-intro__body', {
        duration: 1,
        opacity: "1",
        scrollTrigger: {
            trigger: '.p-kv__space',
            start: "center center",
            end: "center top",
            invalidateOnRefresh: !0,
            scrub: 1
        }
    });

    if (window.matchMedia('(min-width: 767px)').matches) {
        gsap.to('.p-intro__img', {
            duration: 1,
            right: "40vw",
            scrollTrigger: {
                trigger: '.p-intro__space',
                start: "top bottom",
                end: "bottom bottom",
                invalidateOnRefresh: !0,
                scrub: 1
            }
        });
    }
    if (window.matchMedia('(max-width: 768px)').matches) {
        gsap.to('.p-intro__img', {
            duration: 1,
            right: "20vw",
            scrollTrigger: {
                trigger: '.p-intro__space',
                start: "top 20%",
                end: "bottom bottom",
                invalidateOnRefresh: !0,
                scrub: 1
            }
        });
    }

    gsap.to('.p-intro__caption', {
        duration: 1,
        opacity: "1",
        scrollTrigger: {
            trigger: '.p-intro__space',
            start: "top bottom",
            end: "top bottom",
            invalidateOnRefresh: !0,
            scrub: 1
        }
    });
    gsap.fromTo(
        ".p-kv__img-mask svg image", // ← マスク適用されてる画像だけ
        { scale: 1, transformOrigin: "50% 50%" },
        {
            scale: 1.4, // 拡大率
            ease: "none",
            scrollTrigger: {
                trigger: '.p-kv__space',
                start: "top bottom",
                end: "center top",// 上に着くまで
                scrub: true            // スクロール連動
            }
        }
    );


    if (window.matchMedia('(min-width: 767px)').matches) {

        const trigger = '.p-concept__copy-jp--1';
        const steps = [
            { selector: '.jp-1', start: 'top 70%' },
            { selector: '.jp-2', start: 'top 65%' },
            { selector: '.jp-3', start: 'top 60%' },
            { selector: '.jp-4', start: 'top 55%' },
            { selector: '.jp-5', start: 'top 55%' },
        ];
        steps.forEach(({ selector, start }) => {
            gsap.to(`.p-concept__copy-jp--1 ${selector}`, {
                scrollTrigger: {
                    trigger: trigger,
                    start: start,
                    toggleActions: 'play none none reverse',
                    toggleClass: {
                        targets: `.p-concept__copy-jp--1 ${selector}`,
                        className: 'is-active',
                    },
                },
            });
        });

        const trigger2 = '.p-concept__copy-jp--2';
        const steps2 = [
            { selector: '.jp-1', start: 'top 55%' },
            { selector: '.jp-2', start: 'top 45%' },
            { selector: '.jp-3', start: 'top 35%' },
            { selector: '.jp-4', start: 'top 30%' },
            { selector: '.jp-5', start: 'top 25%' },
        ];
        steps2.forEach(({ selector, start }) => {
            gsap.to(`.p-concept__copy-jp--2 ${selector}`, {
                scrollTrigger: {
                    trigger: trigger2,
                    start: start,
                    toggleActions: 'play none none reverse',
                    toggleClass: {
                        targets: `.p-concept__copy-jp--2 ${selector}`,
                        className: 'is-active',
                    },
                },
            });
        });

        const trigger3 = '.p-concept__copy-jp--3';
        const steps3 = [
            { selector: '.jp-1', start: 'top 25%' },
            { selector: '.jp-2', start: 'top 20%' },
            { selector: '.jp-3', start: 'top 15%' },
            { selector: '.jp-4', start: 'top 10%' },
            { selector: '.jp-5', start: 'top 5%' },
        ];
        steps3.forEach(({ selector, start }) => {
            gsap.to(`.p-concept__copy-jp--3 ${selector}`, {
                scrollTrigger: {
                    trigger: trigger3,
                    start: start,
                    toggleActions: 'play none none reverse',
                    toggleClass: {
                        targets: `.p-concept__copy-jp--3 ${selector}`,
                        className: 'is-active',
                    },
                },
            });
        });

        const trigger4 = '.p-concept__copy-jp--4';
        const steps4 = [
            { selector: '.jp-1', start: 'top top' },  // 画面下端に触れたら付与
            { selector: '.jp-2', start: 'top -5%' },
            { selector: '.jp-3', start: 'top -10%' },
            { selector: '.jp-4', start: 'top -15%' },
        ];

        steps4.forEach(({ selector, start }) => {
            const target = `${trigger4} ${selector}`;

            gsap.fromTo(target,
                // 初期値（ぼかし）
                {
                    filter: 'blur(4px)',
                    WebkitFilter: 'blur(4px)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                },
                // 終値（クリア）
                {
                    filter: 'blur(0px)',
                    WebkitFilter: 'blur(0px)',
                    backdropFilter: 'blur(0px)',
                    WebkitBackdropFilter: 'blur(0px)',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: target,     // 各要素を基準
                        start: start,        // 入り始め
                        end: start,   // 完全に画面外へ出るまで
                        scrub: true,         // スクロール連動で滑らかに
                        // markers: true,
                    },
                }
            );
        });

    }


    if (window.matchMedia('(max-width: 768px)').matches) {





        const trigger = '.p-concept__copy-jp--1';
        const steps = [
            { selector: '.jp-1', start: 'top 115%' },
            { selector: '.jp-2', start: 'top 105%' },
            { selector: '.jp-3', start: 'top 95%' },
            { selector: '.jp-4', start: 'top 85%' },
            { selector: '.jp-5', start: 'top 75%' },
        ];

        steps.forEach(({ selector, start }) => {
            const target = `${trigger} ${selector}`;

            gsap.fromTo(target,
                // 初期値（ぼかし）
                {
                    filter: 'blur(4px)',
                    WebkitFilter: 'blur(4px)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                },
                // 終値（クリア）
                {
                    filter: 'blur(0px)',
                    WebkitFilter: 'blur(0px)',
                    backdropFilter: 'blur(0px)',
                    WebkitBackdropFilter: 'blur(0px)',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: target,     // 各要素を基準
                        start: start,        // 入り始め
                        end: start,   // 完全に画面外へ出るまで
                        scrub: true,         // スクロール連動で滑らかに
                        // markers: true,
                    },
                }
            );
        });



        const trigger2 = '.p-concept__copy-jp--2';
        const steps2 = [
            { selector: '.jp-1', start: 'top 115%' },
            { selector: '.jp-2', start: 'top 105%' },
            { selector: '.jp-3', start: 'top 95%' },
            { selector: '.jp-4', start: 'top 85%' },
            { selector: '.jp-5', start: 'top 75%' },
        ];

        steps2.forEach(({ selector, start }) => {
            const target = `${trigger2} ${selector}`;

            gsap.fromTo(target,
                // 初期値（ぼかし）
                {
                    filter: 'blur(4px)',
                    WebkitFilter: 'blur(4px)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                },
                // 終値（クリア）
                {
                    filter: 'blur(0px)',
                    WebkitFilter: 'blur(0px)',
                    backdropFilter: 'blur(0px)',
                    WebkitBackdropFilter: 'blur(0px)',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: target,     // 各要素を基準
                        start: start,        // 入り始め
                        end: start,   // 完全に画面外へ出るまで
                        scrub: true,         // スクロール連動で滑らかに
                        // markers: true,
                    },
                }
            );
        });

        const trigger3 = '.p-concept__copy-jp--3';
        const steps3 = [
            { selector: '.jp-1', start: 'top 115%' },
            { selector: '.jp-2', start: 'top 105%' },
            { selector: '.jp-3', start: 'top 95%' },
            { selector: '.jp-4', start: 'top 85%' },
            { selector: '.jp-5', start: 'top 75%' },
        ];

        steps3.forEach(({ selector, start }) => {
            const target = `${trigger3} ${selector}`;

            gsap.fromTo(target,
                // 初期値（ぼかし）
                {
                    filter: 'blur(4px)',
                    WebkitFilter: 'blur(4px)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                },
                // 終値（クリア）
                {
                    filter: 'blur(0px)',
                    WebkitFilter: 'blur(0px)',
                    backdropFilter: 'blur(0px)',
                    WebkitBackdropFilter: 'blur(0px)',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: target,     // 各要素を基準
                        start: start,        // 入り始め
                        end: start,   // 完全に画面外へ出るまで
                        scrub: true,         // スクロール連動で滑らかに
                        // markers: true,
                    },
                }
            );
        });

        const trigger4 = '.p-concept__copy-jp--4';
        const steps4 = [
            { selector: '.jp-1', start: 'top 85%' },
            { selector: '.jp-2', start: 'top 75%' },
            { selector: '.jp-3', start: 'top 65%' },
            { selector: '.jp-4', start: 'top 55%' },
        ];

        steps4.forEach(({ selector, start }) => {
            const target = `${trigger4} ${selector}`;

            gsap.fromTo(target,
                // 初期値（ぼかし）
                {
                    filter: 'blur(4px)',
                    WebkitFilter: 'blur(4px)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                },
                // 終値（クリア）
                {
                    filter: 'blur(0px)',
                    WebkitFilter: 'blur(0px)',
                    backdropFilter: 'blur(0px)',
                    WebkitBackdropFilter: 'blur(0px)',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: target,     // 各要素を基準
                        start: start,        // 入り始め
                        end: start,   // 完全に画面外へ出るまで
                        scrub: true,         // スクロール連動で滑らかに
                        // markers: true,
                    },
                }
            );
        });

    }



    gsap.to('.p-concept__copy-jp--5', {
        duration: 1,
        filter: "blur(0px)",
        opacity: "1",
        scrollTrigger: {
            trigger: '.p-concept__copy-jp--5',
            start: "top 80%",
            end: "top 60%",
            invalidateOnRefresh: true,
            scrub: 1,
        },
    });


    if (window.matchMedia('(min-width: 767px)').matches) {
        gsap.to('.p-concept__wrap', {
            duration: 1,
            x: "110vw",
            y: "-230vh",
            scrollTrigger: {
                trigger: '.p-concept__space',
                start: "top top",
                end: "bottom bottom",
                invalidateOnRefresh: !0,
                scrub: 1
            }
        });
    }
    if (window.matchMedia('(max-width: 768px)').matches) {
        gsap.to('.p-concept__wrap', {
            duration: 1,
            x: "187vw",
            y: "-230vh",
            scrollTrigger: {
                trigger: '.p-concept__space',
                start: "top top",
                end: "bottom bottom",
                invalidateOnRefresh: !0,
                scrub: 1
            }
        });
    }


    if (window.matchMedia('(min-width: 767px)').matches) {
        gsap.to('.p-product__list', {
            duration: 1,
            x: "-315%",
            scrollTrigger: {
                trigger: '.p-product__space',
                start: "top center",
                end: "bottom bottom",
                invalidateOnRefresh: !0,
                scrub: 1
            }
        });
    }



});
document.addEventListener("DOMContentLoaded", () => {
    gsap.fromTo("textPath",
        { attr: { startOffset: "100%" } }, // 右下から登場
        {
            attr: { startOffset: "-100%" },  // 左下に消える
            duration: 30,                    // 1周の時間
            ease: "none",
            repeat: -1,                      // 無限ループ
            repeatDelay: 0                   // 間隔なし
        }
    );
});




$(function () {
    $('.l-gnav__btn,.l-gnav__item a,.l-gnav__close').on('click', function () {
        $html.toggleClass('is-gnav-open');
    });
    $('.p-spec__icon--3,.p-spec__icon-close').on('click', function () {
        $html.toggleClass('is-modal-open');
    });
    $('.p-spec__icon--1,.p-spec__icon-close-2').on('click', function () {
        $html.toggleClass('is-modal-open-2');
    });
    $('.p-spec__icon--2,.p-spec__icon-close-3').on('click', function () {
        $html.toggleClass('is-modal-open-3');
    });
    $('.floor__item--1').on('click', function () {
        $('.floor__item--2').removeClass('is-active');
        $(this).addClass('is-active');
        $('.p-spec__floor-item--1').addClass('is-active');
        $('.p-spec__floor-item--2').removeClass('is-active');
    });
    $('.floor__item--2').on('click', function () {
        $('.floor__item--1').removeClass('is-active');
        $(this).addClass('is-active');
        $('.p-spec__floor-item--2').addClass('is-active');
        $('.p-spec__floor-item--1').removeClass('is-active');
    });


});

document.addEventListener("DOMContentLoaded", () => {
    noise.seed(Math.random());

    const cx = 50.5;
    const cy = 47;
    const r = 46.5;
    const segments = 70;
    const ids = ["circlePath", "circlePath2", "circlePath3", "circlePath4", "circlePath5", "circlePath6", "circlePath7"];
    const times = new Array(ids.length).fill(0);
    let isPaused = false;

    const btn = document.querySelector(".p-footer__btn-circle");
    if (btn) {
        btn.addEventListener("mouseenter", () => { isPaused = true; });
        btn.addEventListener("mouseleave", () => { isPaused = false; });
    }

    function generatePath(time) {
        const points = [];
        for (let i = 0; i < segments; i++) {
            const angle = (Math.PI * 2 * i) / segments;
            const radius = r + noise.perlin2(Math.cos(angle) + time, Math.sin(angle) + time) * 1.5;
            const x = (cx + Math.cos(angle) * radius).toFixed(3);
            const y = (cy + Math.sin(angle) * radius).toFixed(3);
            points.push([x, y]);
        }
        return `M${points[0][0]} ${points[0][1]} ` + points.map(p => `L${p[0]} ${p[1]}`).join(" ") + " Z";
    }

    function animate() {
        if (!isPaused) {
            ids.forEach((id, index) => {
                const el = document.getElementById(id);
                if (el) {
                    el.setAttribute("d", generatePath(times[index]));
                    times[index] += 0.004;
                }
            });
        }
        requestAnimationFrame(animate);
    }

    animate();
});


new Swiper(".swiper", {
    slidesPerView: 'auto',
    loop: false,
    spaceBetween: 40,
    navigation: {
        nextEl: ".p-topics-swiper-button-next",
        prevEl: ".p-topics-swiper-button-prev",
    },
    breakpoints: {
        768: {
            centeredSlides: false,
        },
        0: {
            slidesPerView: 'auto',
            spaceBetween: 26,
            centeredSlides: true,
            loop: true,
        }
    }
});