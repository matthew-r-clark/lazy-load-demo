let LOGGING_ENABLED = true;
const DISTANCE_BELOW_VIEWPORT = 0;

window.addEventListener('load', function() {
  let $videoEmbeds = $('video'),
      $videoBgContainers = $('.background-video'),
      $imageEmbeds = $('img[data-src]'),
      $imageBgContainers = $('.background-image');

  function lazyLoader() {
    loadEmbeddedVideos();
    loadBackgroundVideos();
    loadEmbeddedImages();
    loadBackgroundImages();
  }

  function loadEmbeddedVideos() {
    let $videos = $videoEmbeds.filter(elementEnteredViewport);
    $videos.each(loadVideo);
    $videoEmbeds = $videoEmbeds.filter(embeddedVideoNotLoaded);
  }

  function loadBackgroundVideos() {
    let $containers = $videoBgContainers.filter(elementEnteredViewport);
    $containers.each(generateAndLoadVideo);
    $videoBgContainers = $videoBgContainers.filter(backgroundVideoNotLoaded);
  }

  function loadEmbeddedImages() {
    let $images = $imageEmbeds.filter(elementEnteredViewport);
    $images.each(loadImage);
    $imageEmbeds = $imageEmbeds.filter(embeddedImageNotLoaded);
  }

  function loadBackgroundImages() {
    let $containers = $imageBgContainers.filter(elementEnteredViewport);
    $containers.each(loadBackgroundImage);
    $imageBgContainers = $imageBgContainers.filter(backgroundImageNotLoaded);
  }

  lazyLoader();
  window.addEventListener('resize', lazyLoader);
  window.addEventListener('scroll', lazyLoader);
  window.addEventListener('orientationchange', lazyLoader);
});

function generateAndLoadVideo() {
  let $element = $(arguments[arguments.length - 1]);
  let $video = $('<video autoplay loop muted playsinline></video>');
  let posterUrl = $element.data('poster-url');
  let videoUrls = $element.data('video-urls');

  $element.removeAttr('data-poster-url')
          .removeAttr('data-video-urls');

  $video.css('background-image', 'url(' + posterUrl + ')');
  $video.attr('data-video-urls', videoUrls);

  $element.append($video);
  $video.each(loadVideo);
}

function loadVideo() {
  log('loading video');
  let $element = $(arguments[arguments.length - 1]);
  let urls = $element.data('video-urls')
                     .split(',').map(url => url.trim());
  urls.forEach(url => {
    let $source = $(document.createElement('source'));
    $source.attr({
      type: getVideoTypeFromUrl(url),
      src: url,
    });
    $element.append($source);
  });
  $element.removeAttr('data-video-urls');
}

function getVideoTypeFromUrl(url) {
  let allowedVideoTypes = ['mp4', 'webm', 'ogg', 'mov'];
  let fileExtension = url.split('.').last();
  if (allowedVideoTypes.includes(fileExtension)) {
    return 'video/' + fileExtension;
  }
}

function loadImage() {
  log('loading image');
  let $element = $(arguments[arguments.length - 1]);
  let url = $element.data('src');
  $element.attr('src', url)
          .removeAttr('data-src');
}

function loadBackgroundImage() {
  log('loading background image');
  let $element = $(arguments[arguments.length - 1]);
  let url = $element.data('src');
  $element.css('background-image', 'url(' + url + ')')
          .removeAttr('data-src');
}

function embeddedVideoNotLoaded() {
  let $element = $(arguments[arguments.length - 1]);
  let numberOfSources = $element.find('source').get().length;
  return numberOfSources === 0;
}

function backgroundVideoNotLoaded() {
  let $element = $(arguments[arguments.length - 1]);
  let numberOfVideos = $element.find('video').get().length;
  return numberOfVideos === 0;
}

function embeddedImageNotLoaded() {
  let $element = $(arguments[arguments.length - 1]);
  return !$element.attr('src');
}

function backgroundImageNotLoaded() {
  let $element = $(arguments[arguments.length - 1]);
  return $element.css('background-image') === "none";
}

function log(message) {
  if (LOGGING_ENABLED) {
    console.log(message);
  }
}

function elementEnteredViewport() {
  let element = arguments[arguments.length - 1];
  var boundingRect = element.getBoundingClientRect();
  return boundingRect.top < window.innerHeight + DISTANCE_BELOW_VIEWPORT;
}

if (!Array.prototype.last) {
  Array.prototype.last = function() {
    return this[this.length - 1];
  }
}

if (!Array.prototype.first) {
  Array.prototype.first = function() {
    return this[0];
  }
}