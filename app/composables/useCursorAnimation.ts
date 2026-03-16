import gsap from 'gsap';

export function useCursorAnimation(
  innerEl: Ref<HTMLElement | null>,
  outerEl: Ref<HTMLElement | null>,
) {
  const liquidGlassSize = ref(0);
  let enlargeTween: gsap.core.Tween | null = null;
  let bumpTween: gsap.core.Tween | null = null;

  const createAnimations = (
    fullCursorSize: number,
    easing: gsap.EaseFunction,
  ) => {
    if (!outerEl.value || !innerEl.value) return;

    enlargeTween = gsap.to(outerEl.value, {
      duration: 0.5,
      width: fullCursorSize,
      height: fullCursorSize,
      ease: easing,
      paused: true,
      onUpdate() {
        if (!outerEl.value) return;
        liquidGlassSize.value = parseFloat(outerEl.value.style.width);
      },
    });

    bumpTween = gsap.to(innerEl.value, {
      duration: 0.3,
      scale: 0.3,
      paused: true,
      onComplete: () => {
        gsap.to(innerEl.value, {
          duration: 0.2,
          scale: 0.5,
          ease: easing,
        });
      },
    });
  };

  const onEnter = () => {
    enlargeTween?.play();
    bumpTween?.play();
  };

  const onLeave = () => {
    enlargeTween?.reverse();
    bumpTween?.reverse();
  };

  const bump = () => bumpTween?.play();

  const destroy = () => {
    enlargeTween?.kill();
    bumpTween?.kill();
  };

  return {
    liquidGlassSize,
    createAnimations,
    onEnter,
    onLeave,
    bump,
    destroy,
  };
}
