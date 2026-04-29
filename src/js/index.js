(function () {
    function initPhotoSliders() {
        const sliders = document.querySelectorAll('.js-photo-slider');

        sliders.forEach(function initPhotoSlider(slider) {
            const track = slider.querySelector('.js-photo-slider-track');
            const slides = Array.from(slider.querySelectorAll('.js-photo-slider-slide'));
            const prev = slider.querySelector('.js-photo-slider-prev');
            const next = slider.querySelector('.js-photo-slider-next');
            const dots = Array.from(slider.querySelectorAll('.js-photo-slider-dot'));

            if (!track || slides.length === 0) {
                return;
            }

            let activeIndex = 0;

            function getSlideScrollLeft(slide) {
                const trackStyles = window.getComputedStyle(track);
                const paddingLeft = parseFloat(trackStyles.paddingLeft) || 0;

                return slide.offsetLeft - track.offsetLeft - paddingLeft;
            }

            function setActive(index) {
                activeIndex = Math.max(0, Math.min(index, slides.length - 1));

                dots.forEach(function updateDot(dot, dotIndex) {
                    dot.classList.toggle('photo-slider__dot_active', dotIndex === activeIndex);
                });

                if (prev) {
                    prev.disabled = activeIndex === 0;
                }

                if (next) {
                    next.disabled = activeIndex === slides.length - 1;
                }
            }

            function scrollToSlide(index) {
                const target = slides[Math.max(0, Math.min(index, slides.length - 1))];

                if (!target) {
                    return;
                }

                track.scrollTo({
                    left: getSlideScrollLeft(target),
                    behavior: 'smooth',
                });
            }

            if (prev) {
                prev.addEventListener('click', function onPrevClick() {
                    scrollToSlide(activeIndex - 1);
                });
            }

            if (next) {
                next.addEventListener('click', function onNextClick() {
                    scrollToSlide(activeIndex + 1);
                });
            }

            track.addEventListener('scroll', function onTrackScroll() {
                const nextIndex = slides.reduce(function getClosestSlideIndex(closestIndex, slide, index) {
                    const currentDistance = Math.abs(getSlideScrollLeft(slide) - track.scrollLeft);
                    const closestSlide = slides[closestIndex];
                    const closestDistance = Math.abs(getSlideScrollLeft(closestSlide) - track.scrollLeft);

                    return currentDistance < closestDistance ? index : closestIndex;
                }, 0);

                setActive(nextIndex);
            });

            setActive(0);
        });
    }

    document.addEventListener('DOMContentLoaded', initPhotoSliders);
})();
