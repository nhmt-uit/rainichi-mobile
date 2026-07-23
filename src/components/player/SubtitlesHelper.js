export default class SubtitlesHelper {
  registerSubtitlesTimes(sortedTimes, currentTime = 0) {
    this._times = sortedTimes;
    this.currentIndex = this._searchIndex(currentTime);
  }
  _locateIndex(time, index) {
    const start = this._times[index];
    if (time < start) {
      return -1;
    }
    if (index < this._times.length - 1) {
      const end = this._times[index + 1];
      if (time >= end) {
        return 1;
      }
    }
    return 0;
  }

  _searchIndex(time) {
    if (!this._times) {
      return 0;
    }
    let startIndex = 0;
    let endIndex = this._times.length - 1;
    while (endIndex > startIndex) {
      const centerIndex = Math.floor((endIndex + startIndex) / 2);
      const indexLocated = this._locateIndex(time, centerIndex);
      if (indexLocated === 0) {
        return centerIndex;
      }
      if (indexLocated > 0) {
        startIndex = centerIndex + 1;
      } else {
        endIndex = centerIndex - 1;
      }
    }

    if (startIndex > 0) {
      return startIndex;
    }
    if (this._locateIndex(time, 0) >= 0) {
      return 0;
    }
    return -1;
  }

  nextReachCheck(time) {
    const index = this._searchIndex(time);
    if (index > this.currentIndex) {
      this.currentIndex = index;
      return true;
    }
    return false;
  }
}
