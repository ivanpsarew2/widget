(function () {
    function initPhotoSliders() {
        const sliders = document.querySelectorAll('.js-photo-slider');

        sliders.forEach(function initPhotoSlider(slider) {
            const track = slider.querySelector('.js-photo-slider-track');
            const slides = Array.from(
                slider.querySelectorAll('.js-photo-slider-slide'),
            );
            const prev = slider.querySelector('.js-photo-slider-prev');
            const next = slider.querySelector('.js-photo-slider-next');
            const dots = Array.from(
                slider.querySelectorAll('.js-photo-slider-dot'),
            );

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
                    dot.classList.toggle(
                        'photo-slider__dot_active',
                        dotIndex === activeIndex,
                    );
                });

                if (prev) {
                    prev.disabled = activeIndex === 0;
                }

                if (next) {
                    next.disabled = activeIndex === slides.length - 1;
                }
            }

            function scrollToSlide(index) {
                const target =
                    slides[Math.max(0, Math.min(index, slides.length - 1))];

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
                const nextIndex = slides.reduce(function getClosestSlideIndex(
                    closestIndex,
                    slide,
                    index,
                ) {
                    const currentDistance = Math.abs(
                        getSlideScrollLeft(slide) - track.scrollLeft,
                    );
                    const closestSlide = slides[closestIndex];
                    const closestDistance = Math.abs(
                        getSlideScrollLeft(closestSlide) - track.scrollLeft,
                    );

                    return currentDistance < closestDistance
                        ? index
                        : closestIndex;
                }, 0);

                setActive(nextIndex);
            });

            setActive(0);
        });
    }

    function initIndexHeader() {
        const page = document.querySelector('.js-index-page');

        if (!page) {
            return;
        }

        const collapseDistance = 180;
        let isTicking = false;

        function updateIndexHeader() {
            const progress = Math.max(
                0,
                Math.min(window.scrollY / collapseDistance, 1),
            );

            page.style.setProperty(
                '--index-header-progress',
                progress.toFixed(3),
            );
            page.classList.toggle('index-page_collapsed', progress > 0.95);
            isTicking = false;
        }

        function requestIndexHeaderUpdate() {
            if (isTicking) {
                return;
            }

            window.requestAnimationFrame(updateIndexHeader);
            isTicking = true;
        }

        window.addEventListener('scroll', requestIndexHeaderUpdate, {
            passive: true,
        });
        updateIndexHeader();
    }

    function initScrollBgPages() {
        const pages = document.querySelectorAll('.js-scroll-bg-page');

        if (pages.length === 0) {
            return;
        }

        let isTicking = false;
        const fadeDistance = 120;

        function updateScrollBg() {
            const progress = Math.max(
                0,
                Math.min(window.scrollY / fadeDistance, 1),
            );

            pages.forEach(function updatePage(page) {
                page.style.setProperty(
                    '--appointment-topbar-bg-progress',
                    progress.toFixed(3),
                );
                page.classList.toggle(
                    'appointment-detail-page_scrolled',
                    progress > 0.95,
                );
            });
            isTicking = false;
        }

        function requestScrollBgUpdate() {
            if (isTicking) {
                return;
            }

            window.requestAnimationFrame(updateScrollBg);
            isTicking = true;
        }

        window.addEventListener('scroll', requestScrollBgUpdate, {
            passive: true,
        });
        updateScrollBg();
    }

    function initAnchorChips() {
        const chipGroups = Array.from(document.querySelectorAll('.chips'))
            .map(function getChipGroup(chips) {
                const items = Array.from(
                    chips.querySelectorAll('.chip[href^="#"]'),
                )
                    .map(function getChipTarget(chip) {
                        const href = chip.getAttribute('href');
                        const id = href
                            ? decodeURIComponent(href.slice(1))
                            : '';
                        const target = id ? document.getElementById(id) : null;

                        return target ? { chip, target } : null;
                    })
                    .filter(Boolean);

                return items.length > 0
                    ? { chips, items, activeChip: null }
                    : null;
            })
            .filter(Boolean);

        if (chipGroups.length === 0) {
            return;
        }

        let isTicking = false;

        function getElementTop(element) {
            return element.getBoundingClientRect().top + window.scrollY;
        }

        function getGroupOffset(group) {
            const styles = window.getComputedStyle(group.chips);
            const stickyTop = parseFloat(styles.top) || 0;

            return stickyTop + group.chips.offsetHeight + 8;
        }

        function setActiveChip(group, activeChip) {
            if (!activeChip || group.activeChip === activeChip) {
                return;
            }

            group.items.forEach(function updateChip(item) {
                item.chip.classList.toggle(
                    'chip_selected',
                    item.chip === activeChip,
                );
            });

            activeChip.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
            });
            group.activeChip = activeChip;
        }

        function updateAnchorChips() {
            chipGroups.forEach(function updateChipGroup(group) {
                const markerTop = window.scrollY + getGroupOffset(group);
                const activeItem = group.items.reduce(function getActiveItem(
                    currentItem,
                    item,
                ) {
                    return getElementTop(item.target) <= markerTop
                        ? item
                        : currentItem;
                }, group.items[0]);

                setActiveChip(group, activeItem.chip);
            });
            isTicking = false;
        }

        function requestAnchorChipsUpdate() {
            if (isTicking) {
                return;
            }

            window.requestAnimationFrame(updateAnchorChips);
            isTicking = true;
        }

        window.addEventListener('scroll', requestAnchorChipsUpdate, {
            passive: true,
        });
        window.addEventListener('resize', requestAnchorChipsUpdate);
        updateAnchorChips();
    }

    function init() {
        initPhotoSliders();
        initIndexHeader();
        initScrollBgPages();
        initAnchorChips();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
