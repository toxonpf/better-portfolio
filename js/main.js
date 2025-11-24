gsap.registerPlugin(ScrollTrigger, ScrollSmoother, Flip, SplitText, CustomEase, MorphSVGPlugin, ScrollToPlugin);
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

const smoother = ScrollSmoother.create({
    wrapper: '#smoothWrapper',
    content: '#smoothContent'
});

const resetScrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    smoother?.scrollTo(0, false);
};

resetScrollToTop();
window.addEventListener('pageshow', resetScrollToTop);