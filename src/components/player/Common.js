import SubtitlesHelper from './SubtitlesHelper';

// Shared subtitle-sync logic used by both AudioPlayer and VideoPlayer --
// tracks which subtitle cue the current playback time falls into and fires
// `subTitlesCallback` whenever the active cue changes.
export class Common {
  constructor() {
    this.subtitlesHelper = new SubtitlesHelper();
  }

  _fireSubtitleCallBack(props) {
    const {subTitlesCallback, subTitlesTimes} = props;
    if (subTitlesCallback && subTitlesTimes) {
      subTitlesCallback(this._getSubtitles(props, this.subtitlesHelper.currentIndex));
    }
  }

  _getSubtitles(props, timeIndex) {
    if (timeIndex < 0) {
      return null;
    }
    if (timeIndex % 2 !== 0) {
      return null;
    }
    const subtitlesIndex = timeIndex / 2;
    return props.subTitlesTimes[subtitlesIndex];
  }

  registerSubtitlesTimes(props, currentTime = 0) {
    const {subTitlesTimes} = props;
    const padding = props.subTitlesCallbackPadding || 0;
    const {subtitlesHelper} = this;
    if (subTitlesTimes) {
      const times = subTitlesTimes.flatMap(obj => (obj.start && [obj.start, obj.end]) || [obj]);
      subtitlesHelper.registerSubtitlesTimes(times, currentTime + padding);
      this._fireSubtitleCallBack(props);
    }
  }
  checkSubtitle(props, time) {
    const {subTitlesCallback, subTitlesTimes} = props;
    if (subTitlesCallback && subTitlesTimes) {
      const {subtitlesHelper} = this;
      const padding = props.subTitlesCallbackPadding || 0;
      if (subtitlesHelper.nextReachCheck(time + padding)) {
        this._fireSubtitleCallBack(props);
      }
    }
  }
}
