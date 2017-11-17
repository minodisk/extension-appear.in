{
  const init = (audio, button) => {
    const width = 100;
    const padding = 10;

    button.style.position = 'relative';
    const volume = document.createElement('div');
    volume.style.position = 'absolute';
    volume.style.left = '60px';
    volume.style.top = '22px';
    volume.style.padding = '10px';
    volume.style.boxSizing = 'border-box';
    volume.style.marginTop = '-12px';
    volume.style.background = 'rgba(13, 22, 36, .5)';
    volume.style.userSelect = 'none';
    const rail = document.createElement('div');
    rail.style.position = 'relative';
    rail.style.width = `${width}px`;
    rail.style.height = '4px';
    rail.style.background = 'rgba(255, 255, 255, .5)';
    rail.style.userSelect = 'none';
    const indicator = document.createElement('div');
    indicator.style.position = 'absolute';
    indicator.style.bottom = 0;
    indicator.style.left = 0;
    indicator.style.width = '100%';
    indicator.style.height = '100%';
    indicator.style.background = 'rgb(252, 61, 96)';
    indicator.style.transform = `scaleX(${audio.volume})`;
    indicator.style.transformOrigin = 'left';
    indicator.style.userSelect = 'none';
    const thumb = document.createElement('div');
    thumb.style.position = 'absolute';
    thumb.style.top = '2px';
    thumb.style.left = 0;
    thumb.style.width = '6px';
    thumb.style.height = '16px';
    thumb.style.marginLeft = '-3px';
    thumb.style.marginTop = '-8px';
    thumb.style.background = 'rgb(255, 255, 255)';
    thumb.style.transform = `translateX(${width * audio.volume}px)`;
    thumb.style.userSelect = 'none';
    rail.appendChild(indicator);
    rail.appendChild(thumb);
    volume.appendChild(rail);
    button.appendChild(volume);

    const onMouseMove = e => {
      e.preventDefault();
      e.stopPropagation();

      let {left} = rail.getBoundingClientRect();
      left += window.pageXOffset;
      const x = e.pageX - left;
      let v = x / width;
      if (v < 0) {
        v = 0;
      } else if (v > 1) {
        v = 1;
      }
      indicator.style.transform = `scaleX(${v})`;
      thumb.style.transform = `translateX(${width * v}px)`;
      audio.volume = v;
    };
    volume.addEventListener('mousedown', e => {
      onMouseMove(e);
      document.addEventListener('mousemove', onMouseMove, true);
    });
    document.addEventListener('mouseup', e => {
      document.removeEventListener('mousemove', onMouseMove, true);
    });
  };

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      const frame = mutation.target;
      if (
        mutation.addedNodes.length === 0 ||
        frame.className !== 'video-frame'
      ) {
        continue;
      }
      const audio = frame.querySelector('audio');
      if (audio == null) {
        continue;
      }
      const button = frame.parentNode.parentNode.querySelector(
        'video-toolbar-button[action="module.toggleAudioOutputEnabled()"]',
      );
      if (button == null) {
        continue;
      }
      init(audio, button);
    }
  });
  observer.observe(document.querySelector('body'), {
    subtree: true,
    childList: true,
  });
}
