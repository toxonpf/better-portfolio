gsap.registerPlugin(ScrollTrigger, ScrollSmoother, Flip, SplitText, CustomEase, MorphSVGPlugin);

ScrollSmoother.create({
    wrapper: '#smoothWrapper',
    content: '#smoothContent'
});