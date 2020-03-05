function easeOut (x) {
    return 1 - (1 - x) * (1 - x);
  }
  
  function createAnimation ({ duration = 300, update, done }) {
    let start =  0;
    let elapsed = 0;
    let progress = 0;
    let aborted = false;
    let animationFrameId = 0;
  
    // Ensure the `update` and `done` callbacks are callable functions
    done = (typeof done === 'function') ? done : function () {};
    update = (typeof update === 'function') ? update : function () {};
  
    // Function to effectively cancel the current animation frame
    function stopAnimation () {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
    }
  
    // Start a new animation by requesting for an animation frame
    animationFrameId = requestAnimationFrame(
      function _animation (timestamp) {
        // Set the animation start timestamp if not set
        if (!start) start = timestamp;
  
        // Compute the time elapsed and the progress (0 - 1)
        elapsed = timestamp - start;
        progress = Math.min(elapsed / duration, 1);
  
        // Call the `update()` callback with the current progress
        update(progress);
  
        // Stop the animation if `.abort()` has been called
        if (aborted === true) return stopAnimation();
  
        // Request another animation frame until duration elapses
        if (timestamp < start + duration) {
          animationFrameId = requestAnimationFrame(_animation);
          return;
        }
  
        // If duration has elapsed, cancel the current animation frame
        // and call the `done()` callback
        stopAnimation();
        done();
      }
    );
  
    // Return an object with an `.abort()` method to stop the animation
    // Returns: Object({ abort: fn() })
    return Object.defineProperty(Object.create(null), 'abort', {
      value: function _abortAnimation () { aborted = true }
    });
  }
  
  function getRippleElementProps (elem) {
    // Initialize the ripple elements registry (first call only)
    const rippleElems = new WeakMap();
  
    getRippleElementProps = function (elem) {
      if (elem instanceof HTMLElement) {
        if (!rippleElems.has(elem)) {
          // Get the dimensions and position of the element on the page
          const { width, height, y: top, x: left } = elem.getBoundingClientRect();
          const diameter = Math.min(width, height);
          const radius = Math.ceil(diameter / 2);
  
          // Configure functions to set and remove style properties
          const style = elem.style;
          const setProperty = style.setProperty.bind(style);
          const removeProperty = style.removeProperty.bind(style);
  
          // Function to remove multiple style properties at once
          function removeProperties (...properties) {
            properties.forEach(removeProperty);
          }
  
          // Set the diameter of the ripple in a custom CSS property
          setProperty('--ripple-diameter', `${diameter}px`);
  
          // Add the element and its geometric properties
          // to the ripple elements registry (WeakMap)
          rippleElems.set(elem, {
            animations: [],
            width, height, radius, top, left, setProperty, removeProperties
          });
        }
  
        // Return the geometric properties of the element
        return rippleElems.get(elem);
      }
    }
  
    return getRippleElementProps(elem);
  }
  
  function runRippleAnimation (elem, scaleFactor) {
    const { animations, setProperty, removeProperties } = getRippleElementProps(elem);
  
    // Abort all animations in the current sequence
    while (animations.length) {
      animations.pop().abort();
    }
  
    // Start the "scale up" animation and add it to the animation sequence
    animations.push(createAnimation({
      duration: 300,
      update: progress => {
        setProperty('--ripple-scale', progress * scaleFactor);
      }
    }));
  
    // Start the "opacity up" animation and add it to the animation sequence
    animations.push(createAnimation({
      duration: 200,
      update: progress => {
        setProperty('--ripple-opacity', Math.min(1, easeOut(progress) + 0.5));
      },
  
      done: () => {
        // Wait for at least 50ms
        // Start the "opacity down" animation and add it to the animation sequence
        setTimeout(() => {
          animations.push(createAnimation({
            duration: 200,
            update: progress => {
              setProperty('--ripple-opacity', easeOut(1 - progress));
            },
            
            done: () => {
              // Remove all the properties at the end of the sequence
              removeProperties(
                '--ripple-center-x',
                '--ripple-center-y',
                '--ripple-opacity',
                '--ripple-scale'
              );
            }
          }));
        }, 50);
      }
    }));
  }
  
  document.addEventListener('click', function _rippleClickHandler (evt) {
    // Capture clicks happening inside a ripple element
    const target = evt.target.closest('.ripple');
  
    if (target) {
      // Get ripple element geometric properties from registry
      const {
        width, height, radius, top, left, setProperty
      } = getRippleElementProps(target);
  
      // Get the half width and height of the ripple element
      const width_2 = width / 2;
      const height_2 = height / 2;
  
      // Get the x and y offsets of the click within the ripple element
      const x = evt.clientX - left;
      const y = evt.clientY - top;
  
      // Compute the scale factor using Pythagoras' theorem
      // and dividing by the ripple radius
      const scaleFactor = Math.ceil(
        Math.sqrt(
          Math.pow(width_2 + Math.abs(x - width_2), 2) +
          Math.pow(height_2 + Math.abs(y - height_2), 2)
        ) / radius
      );
  
      // Set the ripple center coordinates on the custom CSS properties
      // Notice the ripple radius being used for offsets
      setProperty('--ripple-center-x', `${x - radius}px`);
      setProperty('--ripple-center-y', `${y - radius}px`);
  
      // Run the ripple spreading animation
      runRippleAnimation(target, scaleFactor);
    }
  }, false);
