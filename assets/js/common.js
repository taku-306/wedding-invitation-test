// ① 各ボタンでパネルを開く（+ body/htmlにスクロールロック）
$(".js-infoMenu-btn").click(function() {
  $("#infoMenu").addClass("is-visible");
  $("body, html").addClass("is-hidden");
});
$(".js-contentMenu-btn").click(function() {
  if ($("#contentMenu").hasClass("is-visible")) {
    // 閉じる
    $("#contentMenu").removeClass("is-visible");
    $("body, html").removeClass("is-hidden");
    $('.spNavBar__hamburger').removeClass('is-active');
    $('.spNavBar__item.-menuBtn .menuTxt').text('menu');
    $('#gLogo').show();
  } else {
    // 他のメニューを閉じてから開く
    $(".mContent").removeClass("is-visible");
    $("#contentMenu").addClass("is-visible");
    $("body, html").addClass("is-hidden");
    $('.spNavBar__hamburger').addClass('is-active');
    $('.spNavBar__item.-menuBtn .menuTxt').text('close');
    if (window.innerWidth <= 768) {
        $('#gLogo').hide();
    }
  }
});

// ② 閉じるボタン（共通）
$(".js-menu-close").on("click", function() {
  $(this).parents("nav").removeClass("is-visible");
  $("body, html").removeClass("is-hidden");
  $('.spNavBar__hamburger').removeClass('is-active');
  $('.spNavBar__item.-menuBtn .menuTxt').text('menu');
  $('#gLogo').show();
});

$("#contentMenu a[href*='#']").on("click", function() {
  $("#contentMenu").removeClass("is-visible");
  $("body, html").removeClass("is-hidden");
  $('.spNavBar__hamburger').removeClass('is-active');
  $('.spNavBar__item.-menuBtn .menuTxt').text('menu');
  $('#gLogo').show();
});



/*--------------------------------
    スクロールエフェクト
---------------------------------*/
$(document).ready(function (){


    function animateOnScroll(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const listItems = entry.target.querySelectorAll('.js-animate');
                let delay = 0;
                listItems.forEach((item, index) => {
                    // Calculate delay for each item (3-second interval)
                    delay = index * 300;
                    setTimeout(() => {
                        item.classList.add('active');
                    }, delay);
                });
                observer.unobserve(entry.target);
            }
        });
    }

    // Create Intersection Observer instance
    const observer = new IntersectionObserver(animateOnScroll, { threshold: 0.4 });

    // Observe the .p-cont__list element
    const contentLists = document.querySelectorAll('.js-anilist');
    contentLists.forEach(list => {
        if (!list.classList.contains('js-anipc') || window.innerWidth >= 769) {
            observer.observe(list);
        } else {
            // list.classList.add('is-animate');
            const children = list.querySelectorAll('.js-animate');
            children.forEach(child => {
                child.classList.add('is-animate');
            });
        }
    });

    const setAnimationObserver = () => {

        const callback = (entries) => { 
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }
        const options = {
            threshold: 0.4
        }

        const observer = new IntersectionObserver(callback, options);
        const targets = document.querySelectorAll('.is-animate');
        targets.forEach((elem) => {
            observer.observe(elem);
        });
    }
    //上記関数の実行
    setAnimationObserver();
});


const togbt = $('.js-hdtogbtn');
const togcont = $('.js-hdtogcont');
const lktogbt = $('.js-lktogbtn');
const lktogcont = $('.js-lktogcont');

// デフォルトで閉じる（非表示状態）
togcont.hide();

// 各ボタンにクリックイベントを追加
togbt.each(function(index) {
    $(this).on('click', function() {
        $(this).toggleClass('js-minus');
        $(this).closest('.nav-groupSp').toggleClass('is-active');
        togcont.eq(index).slideToggle();
    });
});

lktogcont.hide();

lktogbt.each(function(index) {
    $(this).on('click', function() {
        $(this).toggleClass('js-minus'); // ボタンにクラスをトグル
        lktogcont.eq(index).slideToggle(); // 対応するコンテンツをスライドで開閉
    });
});

document.querySelectorAll('.js-slider').forEach((slider) => {
    // if (slider.id === 'sumanavi-slider') return;
    let options;

    const slideCount = slider.querySelectorAll('.js-slide').length;
    
    if (window.matchMedia('(max-width: 768px)').matches) {
        // スマホ用の設定
        switch (slider.id) {
            case 'sumanavi-slider':
                options = { dots: '.js-slider-dots', cloneFirstCount: 1, cloneLastCount: 1, displayCount: 1, dragCounterLimit: slideCount };
                break;
            default:
                options = { dots: '.js-slider-dots', cloneFirstCount: 1, cloneLastCount: 1, displayCount: 1, dragCounterLimit: slideCount };
        }
    } else {
        // デスクトップ用の設定
        switch (slider.id) {
            case 'sumanavi-slider':
                options = null;
                break;
            default:
                options = { dots: '.js-slider-dots', cloneFirstCount: 1, cloneLastCount: 1, displayCount: 1, dragCounterLimit: slideCount };
        }
    }

    if (slideCount === 1) {
        options = null;
        slider.classList.add('js-single');
    }

    if (options) {
        Slider(slider, options);
    }
});
