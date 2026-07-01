function Slider(sliderElement, opt = {}) {
    const container = sliderElement.querySelector('.js-slides');
    const btnPrev = sliderElement.querySelector('.js-slider-prev');
    const btnNext = sliderElement.querySelector('.js-slider-next');
    const slides = sliderElement.querySelectorAll('.js-slide');
    const threshold = opt.threshold || 30;
    const slidesLength = slides.length;
    let index = 0;
    let allowShift = true;
    let intervalId;

    // console.log('スライド数',slides);
    // console.log('スライドの長さ',slidesLength);

    const cloneFirstCount = opt.cloneFirstCount || 1;
    const cloneLastCount = opt.cloneLastCount || 1;
    const displayCount = opt.displayCount || 1;
    const dragCounterLimit = opt.dragCounterLimit || 5;

    // クローン処理
    // 先頭に追加するクローン：通常順で配列に格納
    const firstClones = [];
    for (let i = slidesLength - cloneLastCount; i < slidesLength; i++) {
        const cloneLast = slides[i].cloneNode(true);
        firstClones.push(cloneLast);
    }

    // 配列の順に先頭に挿入
    firstClones.reverse().forEach(clone => {
        container.insertBefore(clone, container.firstChild); // 順番を維持して挿入
    });

    // 末尾に追加するクローン：通常順
    for (let i = 0; i < cloneFirstCount; i++) {
        const cloneFirst = slides[i].cloneNode(true);
        container.appendChild(cloneFirst); // 通常順で末尾に追加
    }

    // コンテナ幅の設定
    container.style.width = `${(slidesLength + cloneFirstCount + cloneLastCount) * (100 / displayCount)}%`;
    sliderElement.classList.add('loaded');

    container.addEventListener('mousedown', dragStart);
    container.addEventListener('touchstart', dragStart, { passive: true });
    container.addEventListener('touchend', dragEnd);
    container.addEventListener('touchmove', dragAction);

    btnPrev && btnPrev.addEventListener('click', previous);
    btnNext && btnNext.addEventListener('click', next);

    container.addEventListener('transitionend', checkIndex);

    let posInitial, posFinal, posX1 = 0, posY = 0, posX2 = 0;

    function next() {
        if (allowShift) {
            stopAutoPlay();
            shift(++index);
        }
    }

    function previous() {
        if (allowShift) {
            stopAutoPlay();
            shift(--index);
        }
    }

    function dragStart(e) {
        posInitial = container.offsetLeft;
        counter = 0;

        if (e.type === 'touchstart') {
            dragging = false;
            posX1 = e.touches[0].clientX;
            posY = e.touches[0].clientY;
        } else {
            e.preventDefault();
            dragging = true;
            posX1 = e.clientX;
            posY = e.clientY;
            document.addEventListener('mouseup', dragEnd);
            document.addEventListener('mousemove', dragAction);
        }
    }

    let counter = 0;
    let dragging = false;

    function dragAction(e) {
        counter++;
        if (counter <= dragCounterLimit) return;

        const { clientX, clientY } = e.type === 'touchmove' ? e.touches[0] : e;

        if (!dragging && Math.abs(clientY - posY) > Math.abs(clientX - posX1)) {
            return;
        }

        container.classList.add('dragging');
        dragging = true;
        posX2 = posX1 - clientX;
        posX1 = clientX;
        container.style.left = `${container.offsetLeft - posX2}px`;
    }

    // function dragEnd(e) {
    //     e.preventDefault();
    //     counter = 0;
    //     posFinal = container.offsetLeft;

    //     if (posFinal - posInitial < -threshold) {
    //         shift(++index, 'drag');
    //     } else if (posFinal - posInitial > threshold) {
    //         shift(--index, 'drag');
    //     } else {
    //         container.style.left = `${posInitial}px`;
    //     }

    //     container.classList.remove('dragging');
    //     document.removeEventListener('mouseup', dragEnd);
    //     document.removeEventListener('mousemove', dragAction);
    // }
    function dragEnd(e) {
        counter = 0;
        posFinal = container.offsetLeft;
    
        // スワイプの距離を計算
        let diff = posFinal - posInitial;
    
        if (Math.abs(diff) > threshold) {
            if (diff < -threshold) {
                shift(++index, 'drag');
            } else {
                shift(--index, 'drag');
            }
            dragging = true; // スワイプが行われた場合はドラッグ扱い
        } else {
            container.style.left = `${posInitial}px`;
            dragging = false; // スワイプしていない場合はタップ
        }
    
        container.classList.remove('dragging');
        document.removeEventListener('mouseup', dragEnd);
        document.removeEventListener('mousemove', dragAction);
    }
    
    // スライド内のリンクをタップできるようにする
    container.addEventListener('click', function(e) {
        if (dragging) {
            e.stopPropagation(); // ドラッグ中のクリックを無効化（リンクに影響しない）
            e.preventDefault();
        }
    }, true);

    function shift(newIndex, action) {
        if (!allowShift) return;
        allowShift = false;

        container.classList.add('shifting');
        if (!action) posInitial = container.offsetLeft;

        index = newIndex;
        container.style.left = `${(index + 1) * -100 / displayCount}%`;
    }

    function checkIndex() {
        container.classList.remove('shifting');

        if (index === -1) {
            container.style.left = `${slidesLength * -100 / displayCount}%`;
            index = slidesLength - 1;
        }

        if (index === slidesLength) {
            container.style.left = `-${100 / displayCount}%`;
            index = 0;
        }

        allowShift = true;
        checkDots();

        // Only start autoplay if isPlaying is true
        if (isPlaying) {
            startAutoPlay();
        }
    }

    function jumpTo(newIndex) {
        if (!allowShift || newIndex === index) return;
        if (newIndex < 0 || newIndex >= slidesLength) {
            console.error('Invalid index.');
            return;
        }
        stopAutoPlay();
        shift(newIndex);
    }

    function checkDots() {
        if (!opt.dots) return;

        //dots custom
        const dotsEl = sliderElement.querySelector(opt.dots);

        if (opt.dotsType === 'number') {
            const total = slidesLength;
            dotsEl.textContent = `${index + 1} / ${total}`;
            return;
        }

        sliderElement.querySelectorAll(`${opt.dots} span`).forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    if (opt.dots) {
        const dots = sliderElement.querySelector(opt.dots);
        dots.innerHTML = '';

        if (opt.dotsType === 'number') {
            dots.textContent = `1 / ${slidesLength}`;
        } else {
            for (let i = 0; i < slidesLength; i++) {
                const dot = document.createElement('span');
                dot.addEventListener('click', () => {
                    jumpTo(i);
                    checkDots();
                });
                dots.appendChild(dot);
            }
            checkDots();
        }
    }

    const autoPlayEnabled = opt.autoPlay !== false;

    function startAutoPlay() {
        if (!autoPlayEnabled) return;
        stopAutoPlay();
        intervalId = setInterval(() => {
            next();
        }, 3000);
    }

    function stopAutoPlay() {
        clearInterval(intervalId);
    }

    // container.addEventListener('mouseenter', stopAutoPlay);
    // container.addEventListener('mouseleave', startAutoPlay);

     if (autoPlayEnabled) {
        startAutoPlay();
    }
    
    const controlButton = sliderElement.querySelector('.js-slider-ctrl');
    const playButtonIcon = controlButton.querySelector('.u-btn-play');
    let isPlaying = true;

    controlButton.addEventListener('click', () => {
        if (isPlaying) {
            stopAutoPlay();
            playButtonIcon.classList.add('js-pause');
        } else {
            startAutoPlay();
            playButtonIcon.classList.remove('js-pause');
        }
        isPlaying = !isPlaying;
    });

    // return { jumpTo, shift, previous, next };
    function preventClickIfDragging(e) {
        if (dragging) {
          e.stopPropagation();
          e.preventDefault();
        }
    }

    // return { jumpTo, shift, previous, next };
    return {
        jumpTo,
        shift,
        previous,
        next,
        destroy() {
          btnPrev && btnPrev.removeEventListener('click', previous);
          btnNext && btnNext.removeEventListener('click', next);
          container.removeEventListener('mousedown', dragStart);
          container.removeEventListener('touchstart', dragStart);
          container.removeEventListener('touchend', dragEnd);
          container.removeEventListener('touchmove', dragAction);
          container.removeEventListener('transitionend', checkIndex);
          container.removeEventListener('click', preventClickIfDragging, true);
          
          // ドットのイベント削除（クローンや再構築によって再追加された場合も考慮）
          if (opt.dots) {
            sliderElement.querySelectorAll(`${opt.dots} span`).forEach(dot => {
              dot.replaceWith(dot.cloneNode(true)); // イベントごと差し替え
            });
          }
      
          stopAutoPlay();
        }
    };

}

let resizeTimer;
window.addEventListener('resize', function() {
    // 画面幅が768px以上の場合のみリロードを実行
    if (window.innerWidth >= 768) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            location.reload();  // ページをリフレッシュ
        }, 200);  // 200ミリ秒待ってからリロード（頻繁に発火するのを防ぐ）
    }
});